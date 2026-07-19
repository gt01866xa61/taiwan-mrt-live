import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, "inline app script not found");

function element(id = "") {
  const classes = new Set();
  const style = { setProperty(name, value) { this[name] = value; } };
  return {
    id,
    open:false,
    hidden:false,
    style,
    dataset:{},
    textContent:"",
    innerHTML:"",
    classList:{
      add: (...names) => names.forEach(name => classes.add(name)),
      remove: (...names) => names.forEach(name => classes.delete(name)),
      toggle: (name, force) => force === undefined
        ? (classes.has(name) ? (classes.delete(name), false) : (classes.add(name), true))
        : (force ? classes.add(name) : classes.delete(name), force),
      contains: name => classes.has(name)
    },
    setAttribute(name, value) { this[name] = String(value); },
    removeAttribute(name) { delete this[name]; },
    addEventListener() {},
    appendChild() {},
    querySelectorAll() { return []; },
    setPointerCapture() {},
    showModal() { this.open = true; },
    close() { this.open = false; },
    getContext() { return canvasContext; }
  };
}

const canvasContext = new Proxy({}, {
  get(target, key) {
    if (!(key in target)) target[key] = () => {};
    return target[key];
  },
  set(target, key, value) { target[key] = value; return true; }
});

function boot() {
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) elements.set(id, element(id));
    return elements.get(id);
  };
  const document = {
    hidden:false,
    documentElement:element("html"),
    getElementById:get,
    createElement:tag => element(tag),
    addEventListener() {}
  };
  const sandbox = {
    document,
    console,
    Date,
    Map,
    Set,
    Math,
    Number,
    String,
    RegExp,
    Error,
    Object,
    Array,
    Blob,
    AbortController,
    fetch: async () => { throw new Error("fetch should remain disabled in smoke test"); },
    setTimeout,
    clearTimeout,
    requestAnimationFrame() {},
    getComputedStyle:() => ({ getPropertyValue:() => "#123456" }),
    matchMedia:() => ({ matches:false, addEventListener() {} }),
    MutationObserver:class { observe() {} },
    innerWidth:390,
    innerHeight:844,
    devicePixelRatio:2,
    addEventListener() {}
  };
  sandbox.window = sandbox;
  sandbox.MRT_OFFICIAL_FEED_URL = "";
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox, { timeout:5000 });
  return { sandbox, elements };
}

test("完整單頁在 390x844 初始化，資料源關閉時維持原推估", () => {
  const { sandbox, elements } = boot();
  assert.equal(elements.get("methodBadge").textContent, "班表推估 · 非 GPS");
  assert.equal(typeof sandbox.__MRT_OFFICIAL_TEST__.parseTaipeiTimestamp, "function");
  assert.equal(elements.get("tab0")["aria-selected"], "true");
});

test("匯入唯一官方事件不增加或刪除模擬列車", () => {
  const { sandbox } = boot();
  const tnow = { svcMin:1175.57, isHol:true };
  sandbox.__tnow = tnow;
  const before = vm.runInContext("activeTrains(0, __tnow).map(t => officialTrainKey(t.sv,t.dir,t.dep)).sort().join(',')", sandbox);
  const receivedAt = Date.UTC(2026, 6, 19, 11, 36, 0);
  sandbox.__MRT_OFFICIAL_TEST__.ingestOfficialPayload([
    { Station:"大安站", Destination:"動物園站", UpdateTime:"20260719193534" }
  ], receivedAt);
  assert.ok(vm.runInContext("officialFeed.corrections.size", sandbox) >= 1);
  const after = vm.runInContext("activeTrains(0, __tnow).map(t => officialTrainKey(t.sv,t.dir,t.dep)).sort().join(',')", sandbox);
  assert.equal(after, before);
});

test("官方校正接近首末站時仍保留原列車集合", () => {
  const { sandbox } = boot();
  const result = vm.runInContext(`
    (() => {
      const sv = services.find(item => item.line.id === "br");
      const dep = departures(sv, true)[0];
      const durationMin = sv.durFwd / 60;
      const snapshots = [];
      for (const sample of [
        { svcMin:dep, offset:300 },
        { svcMin:dep + durationMin, offset:-300 }
      ]) {
        const tnow = { svcMin:sample.svcMin, isHol:true };
        const before = activeTrains(0, tnow).map(t => officialTrainKey(t.sv,t.dir,t.dep)).sort().join(",");
        const key = officialTrainKey(sv, 0, dep);
        officialFeed.corrections.set(key, {
          targetOffsetSec:sample.offset,
          fromOffsetSec:sample.offset,
          durationMs:0,
          startedAt:0,
          eventAt:Date.now()
        });
        const after = activeTrains(0, tnow).map(t => officialTrainKey(t.sv,t.dir,t.dep)).sort().join(",");
        snapshots.push({ before, after });
        officialFeed.corrections.clear();
      }
      return snapshots;
    })()
  `, sandbox);
  for (const snapshot of result) assert.equal(snapshot.after, snapshot.before);
});

test("列車離開原班表生命週期後會關閉選取泡泡", () => {
  const { sandbox, elements } = boot();
  const closed = vm.runInContext(`
    (() => {
      const sv = services.find(item => item.line.id === "br");
      const dep = departures(sv, true)[0];
      selected = { type:"train", sv, dir:0, dep };
      updatePopup({ svcMin:dep + sv.durFwd / 60 + 0.01, isHol:true });
      return selected === null;
    })()
  `, sandbox);
  assert.equal(closed, true);
  assert.equal(elements.get("popup").classList.contains("show"), false);
});

test("跨線歧義事件只保留車站提示，不校正列車", () => {
  const { sandbox } = boot();
  const receivedAt = Date.UTC(2026, 6, 19, 11, 36, 0);
  sandbox.__MRT_OFFICIAL_TEST__.ingestOfficialPayload([
    { Station:"忠孝復興站", Destination:"南港展覽館站", UpdateTime:"20260719193534" }
  ], receivedAt);
  assert.equal(vm.runInContext("officialFeed.corrections.size", sandbox), 0);
  assert.equal(vm.runInContext("officialFeed.events[0].resolution.candidate", sandbox), null);
});

test("官方資料依 120 秒與 10 分鐘門檻切換 fresh/stale/offline", () => {
  const { sandbox } = boot();
  const now = Date.UTC(2026, 6, 19, 11, 36, 0);
  sandbox.__now = now;
  vm.runInContext("officialFeed.url='https://example.test/api'; officialFeed.lastSuccessAt=__now; officialFeed.latestEventAt=__now-30000; officialFeed.events=[{atMs:officialFeed.latestEventAt}]", sandbox);
  assert.equal(vm.runInContext("officialFeedStatus(__now)", sandbox), "fresh");
  assert.equal(vm.runInContext("officialFeedStatus(__now+121000)", sandbox), "stale");
  assert.equal(vm.runInContext("officialFeedStatus(__now+601000)", sandbox), "offline");
});

test("官方狀態永遠保留非 GPS 揭露，純推估路線不顯示北捷連線", () => {
  const { sandbox, elements } = boot();
  const now = Date.UTC(2026, 6, 19, 11, 36, 0);
  sandbox.__now = now;
  vm.runInContext(`
    officialFeed.url="https://example.test/api";
    officialFeed.lastSuccessAt=__now;
    officialFeed.latestEventAt=__now-10000;
    officialFeed.events=[{
      station:"大安", atMs:officialFeed.latestEventAt,
      resolution:{ lineIds:["br"], candidate:null }
    }];
    updateOfficialBadge(__now);
  `, sandbox);
  assert.match(elements.get("methodBadge").textContent, /班表推估 · 非 GPS/);
  assert.match(elements.get("methodBadge").textContent, /北捷/);

  vm.runInContext(`
    for (const key of lineVisible.keys()) lineVisible.set(key, false);
    lineVisible.set("a", true);
    updateOfficialBadge(__now);
  `, sandbox);
  assert.equal(elements.get("methodBadge").textContent, "班表推估 · 非 GPS");
});
