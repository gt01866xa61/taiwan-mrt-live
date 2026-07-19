import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

function between(start, end) {
  const from = html.indexOf(start);
  const to = html.indexOf(end);
  assert.ok(from >= 0 && to > from, `missing ${start}`);
  return html.slice(from + start.length, to);
}

const pureSource = between("/* official-feed:pure:start */", "/* official-feed:pure:end */");
const mappingSource = between("/* official-feed:mapping:start */", "/* official-feed:mapping:end */");
const context = vm.createContext({ Date, Map, Set, String, Number, Math, RegExp, Error });

vm.runInContext(`
  const OFFICIAL_MAX_FUTURE_MS = 30000;
  const OFFICIAL_STALE_MS = 600000;
  const OFFICIAL_LINE_IDS = new Set(["br", "r", "g", "o", "bl"]);
  const OFFICIAL_SHORT_TURN_TERMINALS = Object.freeze({
    "r|大安": 23,
    "g|台電大樓": 11,
    "bl|亞東醫院": 4
  });
  ${pureSource}
  var services = [];
  ${mappingSource}
  this.api = {
    normalizeOfficialName,
    resolveOfficialStationName,
    parseTaipeiTimestamp,
    parseOfficialPayload,
    serviceClockAt,
    resolveOfficialEvent,
    setServices(value) { services = value; }
  };
`, context);

const api = context.api;

test("14 位臺北時間戳正確轉成 UTC", () => {
  assert.equal(api.parseTaipeiTimestamp("20260719193534"), 1784460934000);
  assert.ok(Number.isNaN(api.parseTaipeiTimestamp("20260230010101")));
  assert.ok(Number.isNaN(api.parseTaipeiTimestamp("bad")));
});

test("站名先完整比對，再移除尾端站字", () => {
  const known = new Map([
    ["台北車站", "台北車站"],
    ["台大醫院", "台大醫院"],
    ["大安", "大安"]
  ]);
  assert.equal(api.resolveOfficialStationName("台北車站", known), "台北車站");
  assert.equal(api.resolveOfficialStationName("臺大醫院站", known), "台大醫院");
  assert.equal(api.resolveOfficialStationName(" 大安站 ", known), "大安");
  assert.equal(api.resolveOfficialStationName("不存在站", known), null);
});

test("解析器保留同站不同方向、去除完全重複與壞資料", () => {
  const known = new Map([["石牌", "石牌"], ["淡水", "淡水"], ["象山", "象山"]]);
  const now = Date.UTC(2026, 6, 19, 11, 36, 0);
  const rows = [
    { Station:"石牌站", Destination:"淡水站", UpdateTime:"20260719193534" },
    { Station:"石牌站", Destination:"象山站", UpdateTime:"20260719193534" },
    { Station:"石牌站", Destination:"淡水站", UpdateTime:"20260719193534" },
    { Station:"未知站", Destination:"淡水站", UpdateTime:"20260719193534" },
    { Station:"石牌站", Destination:"淡水站", UpdateTime:"bad" }
  ];
  const parsed = api.parseOfficialPayload(rows, known, now);
  assert.equal(parsed.inputCount, 5);
  assert.equal(parsed.events.map(event => `${event.station}>${event.destination}`).join(","), "石牌>淡水,石牌>象山");
});

test("代理包裝的抓取時間必須有效且新鮮", () => {
  const known = new Map([["石牌", "石牌"], ["淡水", "淡水"]]);
  const now = Date.UTC(2026, 6, 19, 11, 36, 0);
  const payload = {
    fetchedAt:"2026-07-19T11:35:58.000Z",
    events:[{ Station:"石牌站", Destination:"淡水站", UpdateTime:"20260719193534" }]
  };
  const parsed = api.parseOfficialPayload(payload, known, now);
  assert.equal(parsed.fetchedAtMs, Date.UTC(2026, 6, 19, 11, 35, 58));
  assert.throws(() => api.parseOfficialPayload({ ...payload, fetchedAt:"bad" }, known, now));
  assert.throws(() => api.parseOfficialPayload({
    ...payload,
    fetchedAt:"2026-07-19T11:20:00.000Z"
  }, known, now));
});

function service(id, names) {
  const n = names.length;
  return {
    serviceId: `${id}:0`,
    line: { id, region:0 },
    svc: { hw:{ dw:20 } },
    st: names.map(name => ["", name]),
    n,
    terminalA:names[0],
    terminalB:names[n - 1],
    depFwd: Array.from({ length:n }, (_, i) => i * 100),
    depRev: Array.from({ length:n }, (_, i) => i * 100),
    dwellFwd: Array.from({ length:n - 1 }, () => 0),
    dwellRev: Array.from({ length:n - 1 }, () => 0)
  };
}

test("只在路線唯一時解析；跨線歧義不猜", () => {
  api.setServices([
    service("br", ["動物園", "大安", "忠孝復興", "南港展覽館"]),
    service("r", ["淡水", "中正紀念堂", "大安", "象山"]),
    service("bl", ["頂埔", "忠孝復興", "南港展覽館"]),
    service("a", ["台北車站", "機場第一航廈"])
  ]);
  const br = api.resolveOfficialEvent({ station:"大安", destination:"動物園" });
  assert.equal(br.candidate.sv.line.id, "br");
  const shortTurn = api.resolveOfficialEvent({ station:"中正紀念堂", destination:"大安" });
  assert.equal(shortTurn.candidate.sv.line.id, "r");
  assert.equal(shortTurn.candidate.shortTerminalIdx, 23);
  const shortTurnTerminal = api.resolveOfficialEvent({ station:"大安", destination:"大安" });
  assert.equal(shortTurnTerminal.candidate.sv.line.id, "r");
  const ambiguous = api.resolveOfficialEvent({ station:"忠孝復興", destination:"南港展覽館" });
  assert.equal(ambiguous.candidate, null);
  assert.deepEqual([...ambiguous.lineIds].sort(), ["bl", "br"]);
  const unsupported = api.resolveOfficialEvent({ station:"台北車站", destination:"機場第一航廈" });
  assert.equal(unsupported.candidate, null);
});
