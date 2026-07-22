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
  assert.equal(vm.runInContext("services.length", sandbox), 18);
  assert.equal(vm.runInContext("stationIndex.size", sandbox), 258);
});

test("北捷核心線套用官方逐站秒數，其他路網保留距離模型", () => {
  const { sandbox } = boot();
  const result = vm.runInContext(`
    (() => {
      const br = services.find(item => item.serviceId === "br:0");
      const red = services.find(item => item.serviceId === "r:0");
      const taichung = services.find(item => item.serviceId === "tc:0");
      return {
        brOfficial:br.officialTiming,
        brFirst:br.segSec[0],
        brDwellAtDaan:br.dwellFwd[8],
        redOfficial:red.officialTiming,
        redFirst:red.segSec[0],
        redLast:red.segSec.at(-1),
        taichungOfficial:taichung.officialTiming
      };
    })()
  `, sandbox);
  assert.equal(result.brOfficial, true);
  assert.equal(result.brFirst, 67);
  assert.equal(result.brDwellAtDaan, 45);
  assert.equal(result.redOfficial, true);
  assert.equal(result.redFirst, 175);
  assert.equal(result.redLast, 93);
  assert.equal(result.taichungOfficial, false);
});

test("三鶯線試營運時段與尖離峰班距符合 2026 年 7 月公告", () => {
  const { sandbox } = boot();
  const schedule = vm.runInContext(`
    (() => {
      const sanying = services.find(item => item.serviceId === "lb:0");
      return {
        first:sanying.svc.hw.fd,
        last:sanying.svc.hw.ld,
        beforeEveningPeak:headwayAt(sanying.svc.hw, 17.25 * 60, false),
        eveningPeak:headwayAt(sanying.svc.hw, 18 * 60, false),
        weekdayOffPeak:headwayAt(sanying.svc.hw, 12 * 60, false),
        holiday:headwayAt(sanying.svc.hw, 18 * 60, true)
      };
    })()
  `, sandbox);
  assert.equal(schedule.first, 600);
  assert.equal(schedule.last, 1200);
  assert.equal(schedule.beforeEveningPeak, 8);
  assert.equal(schedule.eveningPeak, 6);
  assert.equal(schedule.weekdayOffPeak, 8);
  assert.equal(schedule.holiday, 8);
});

test("匯入唯一官方事件不增加或刪除模擬列車", () => {
  const { sandbox } = boot();
  const receivedAt = Date.UTC(2026, 6, 19, 11, 36, 0);
  sandbox.__receivedAt = receivedAt;
  vm.runInContext(`
    const __clock = serviceClockAt(__receivedAt);
    var __tnow = {
      svcMin:__clock.svcSec / 60,
      isHol:__clock.isHol,
      serviceDayKey:__clock.serviceDayKey
    };
  `, sandbox);
  const before = vm.runInContext("activeTrains(0, __tnow, __receivedAt).map(t => t.trainKey).sort().join(',')", sandbox);
  sandbox.__MRT_OFFICIAL_TEST__.ingestOfficialPayload([
    { Station:"大安站", Destination:"動物園站", UpdateTime:"20260719193534" }
  ], receivedAt);
  assert.ok(vm.runInContext("officialFeed.corrections.size", sandbox) >= 1);
  assert.equal(vm.runInContext("activeTrains(0, __tnow, __receivedAt).some(t => Boolean(t.officialCorrection))", sandbox), true);
  const after = vm.runInContext("activeTrains(0, __tnow, __receivedAt).map(t => t.trainKey).sort().join(',')", sandbox);
  assert.equal(after, before);
});

test("官方校正接近首末站時仍保留原列車集合", () => {
  const { sandbox } = boot();
  const result = vm.runInContext(`
    (() => {
      const sv = services.find(item => item.line.id === "br");
      const dep = departures(sv, true)[0];
      const durationMin = sv.durFwd / 60;
      const nowMs = Date.now();
      const serviceDayKey = serviceClockAt(nowMs).serviceDayKey;
      const snapshots = [];
      for (const sample of [
        { svcMin:dep, offset:300 },
        { svcMin:dep + durationMin, offset:-300 }
      ]) {
        const tnow = { svcMin:sample.svcMin, isHol:true, serviceDayKey };
        const before = activeTrains(0, tnow).map(t => t.trainKey).sort().join(",");
        const key = officialTrainKey(sv, 0, dep, serviceDayKey);
        officialFeed.corrections.set(key, {
          targetOffsetSec:sample.offset,
          fromOffsetSec:sample.offset,
          durationMs:0,
          startedAt:nowMs,
          eventAt:nowMs,
          serviceDayKey
        });
        const current = trainPositionAt(sv, 0, dep, tnow, nowMs);
        const after = activeTrains(0, tnow).map(t => t.trainKey).sort().join(",");
        snapshots.push({ before, after, correctionApplied:Boolean(current?.correction) });
        officialFeed.corrections.clear();
      }
      return snapshots;
    })()
  `, sandbox);
  for (const snapshot of result) {
    assert.equal(snapshot.correctionApplied, true);
    assert.equal(snapshot.after, snapshot.before);
  }
});

test("最大正負校正都維持單向且限制在 0.25x 至 2x", () => {
  const { sandbox } = boot();
  const bounds = vm.runInContext(`
    (() => {
      function sample(target) {
        const durationMs = correctionDurationMs(0, target);
        const entry = {
          fromOffsetSec:0,
          targetOffsetSec:target,
          startedAt:0,
          durationMs
        };
        let previous = -Infinity, minRate = Infinity, maxRate = -Infinity;
        const stepMs = 250;
        for (let t = 0; t <= durationMs; t += stepMs) {
          const elapsed = t / 1000 - correctionOffset(entry, t);
          if (previous !== -Infinity) {
            const rate = (elapsed - previous) / (stepMs / 1000);
            minRate = Math.min(minRate, rate);
            maxRate = Math.max(maxRate, rate);
          }
          previous = elapsed;
        }
        return { durationMs, minRate, maxRate };
      }
      return { delayed:sample(300), early:sample(-300) };
    })()
  `, sandbox);
  assert.ok(bounds.delayed.durationMs > 15000);
  assert.ok(bounds.early.durationMs > 15000);
  assert.ok(bounds.delayed.minRate >= 0.249);
  assert.ok(bounds.early.maxRate <= 2.001);
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

test("短折返列車停在短終點、顯示短終點，停靠結束後退役", () => {
  const { sandbox, elements } = boot();
  const result = vm.runInContext(`
    (() => {
      const sv = services.find(item => item.serviceId === "r:0");
      const resolved = resolveOfficialEvent({ station:"中正紀念堂", destination:"大安" }).candidate;
      const serviceDayKey = "2026-07-23";
      const dep = departures(sv, false).find(value => value >= 600);
      const trainKey = officialTrainKey(sv, resolved.dir, dep, serviceDayKey);
      officialFeed.corrections.set(trainKey, {
        fromOffsetSec:0,
        targetOffsetSec:0,
        durationMs:0,
        startedAt:Date.now(),
        eventAt:Date.now(),
        station:"中正紀念堂",
        destination:"大安",
        shortTerminalIdx:resolved.shortTerminalIdx,
        shortDurationSec:resolved.shortDurationSec,
        shortTerminalName:resolved.shortTerminalName,
        serviceDayKey
      });

      const beforeEnd = {
        svcMin:dep + (resolved.shortDurationSec - 0.02) / 60,
        isHol:false,
        serviceDayKey
      };
      const current = trainPositionAt(sv, resolved.dir, dep, beforeEnd);
      selected = { type:"train", sv, dir:resolved.dir, dep };
      updatePopup(beforeEnd);
      const popupTitle = document.getElementById("poptitle").textContent;

      const afterEnd = {
        svcMin:dep + (resolved.shortDurationSec + 0.02) / 60,
        isHol:false,
        serviceDayKey
      };
      const sameTrainStillActive = activeTrains(0, afterEnd).some(train =>
        train.sv === sv && train.dir === resolved.dir && train.dep === dep
      );
      selected = { type:"train", sv, dir:resolved.dir, dep };
      updatePopup(afterEnd);

      return {
        nextName:current?.pos?.nextName,
        destName:current?.pos?.destName,
        popupTitle,
        sameTrainStillActive,
        popupClosed:selected === null
      };
    })()
  `, sandbox);

  assert.equal(result.nextName, "大安");
  assert.equal(result.destName, "大安");
  assert.equal(result.popupTitle, "往 大安");
  assert.equal(result.sameTrainStillActive, false);
  assert.equal(result.popupClosed, true);
  assert.equal(elements.get("popup").classList.contains("show"), false);
});

test("四個短折返終點只接受其實際進站方向", () => {
  const { sandbox } = boot();
  const result = vm.runInContext(`
    (() => {
      const cases = [
        ["中正紀念堂", "大安", 0],
        ["信義安和", "大安", null],
        ["奇岩", "北投", 1],
        ["紅樹林", "北投", null],
        ["古亭", "台電大樓", 0],
        ["公館", "台電大樓", null],
        ["府中", "亞東醫院", 1],
        ["土城", "亞東醫院", null]
      ];
      return cases.map(([station, destination, expected]) => ({
        station,
        destination,
        expected,
        actual:resolveOfficialEvent({ station, destination }).candidate?.dir ?? null
      }));
    })()
  `, sandbox);
  for (const item of result) {
    assert.equal(item.actual, item.expected, `${item.station}→${item.destination}`);
  }
});

test("橘線迴龍與蘆洲交路在共線區不產生完全重疊列車", () => {
  const { sandbox } = boot();
  const overlap = vm.runInContext(`
    (() => {
      for (const key of lineVisible.keys()) lineVisible.set(key, key === "o");
      for (let svcMin = 360; svcMin <= 480; svcMin += 0.5) {
        const trains = activeTrains(0, {
          svcMin,
          isHol:true,
          serviceDayKey:"2026-07-19"
        }).filter(train => train.sv.line.id === "o");
        for (let i = 0; i < trains.length; i++) {
          for (let j = i + 1; j < trains.length; j++) {
            const a = trains[i], b = trains[j];
            if (a.sv.serviceId === b.sv.serviceId || a.dir !== b.dir) continue;
            if (a.pos.nextName !== b.pos.nextName) continue;
            if (Math.hypot(a.pos.x - b.pos.x, a.pos.y - b.pos.y) < 1e-9) {
              return { svcMin, dir:a.dir, nextName:a.pos.nextName };
            }
          }
        }
      }
      return null;
    })()
  `, sandbox);
  assert.equal(overlap, null);
});

test("舊營運日校正不會套到隔週相同發車時間", () => {
  const { sandbox } = boot();
  const result = vm.runInContext(`
    (() => {
      const firstMs = Date.UTC(2026, 6, 19, 2, 0, 0);
      const nextMs = Date.UTC(2026, 6, 26, 2, 0, 0);
      const firstClock = serviceClockAt(firstMs);
      const nextClock = serviceClockAt(nextMs);
      const sv = services.find(item => item.serviceId === "r:0");
      const dep = departures(sv, firstClock.isHol).find(value => value >= 600);
      const firstKey = officialTrainKey(sv, 0, dep, firstClock.serviceDayKey);
      const nextKey = officialTrainKey(sv, 0, dep, nextClock.serviceDayKey);
      officialFeed.corrections.set(firstKey, {
        fromOffsetSec:60,
        targetOffsetSec:60,
        durationMs:0,
        startedAt:firstMs,
        eventAt:firstMs,
        serviceDayKey:firstClock.serviceDayKey
      });
      const current = trainPositionAt(sv, 0, dep, {
        svcMin:nextClock.svcSec / 60,
        isHol:nextClock.isHol,
        serviceDayKey:nextClock.serviceDayKey
      }, nextMs);
      return {
        firstDay:firstClock.serviceDayKey,
        nextDay:nextClock.serviceDayKey,
        firstKey,
        nextKey,
        correctionApplied:Boolean(current?.correction)
      };
    })()
  `, sandbox);
  assert.equal(result.firstDay, "2026-07-19");
  assert.equal(result.nextDay, "2026-07-26");
  assert.notEqual(result.firstKey, result.nextKey);
  assert.equal(result.correctionApplied, false);
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
  assert.equal(elements.get("methodBadge").textContent, "班表推估 · 非 GPS｜北捷進站事件正常");

  vm.runInContext(`
    (() => {
      const clock = serviceClockAt(__now);
      const sv = services.find(item => item.serviceId === "br:0");
      const dep = departures(sv, clock.isHol).find(value => {
        const elapsed = clock.svcSec - value * 60;
        return elapsed >= 0 && elapsed <= sv.durFwd;
      });
      const trainKey = officialTrainKey(sv, 0, dep, clock.serviceDayKey);
      officialFeed.corrections.set(trainKey, {
        fromOffsetSec:0,
        targetOffsetSec:0,
        durationMs:0,
        startedAt:__now,
        eventAt:__now - 10000,
        lineId:sv.line.id,
        serviceId:sv.serviceId,
        dir:0,
        dep,
        serviceDayKey:clock.serviceDayKey
      });
      updateOfficialBadge(__now);
    })()
  `, sandbox);
  assert.equal(elements.get("methodBadge").textContent, "融合推估 · 非 GPS｜北捷進站事件正常");

  vm.runInContext(`
    for (const key of lineVisible.keys()) lineVisible.set(key, false);
    lineVisible.set("bl", true);
    updateOfficialBadge(__now);
  `, sandbox);
  assert.equal(elements.get("methodBadge").textContent, "班表推估 · 非 GPS｜北捷進站事件正常");

  vm.runInContext(`
    for (const key of lineVisible.keys()) lineVisible.set(key, false);
    lineVisible.set("a", true);
    updateOfficialBadge(__now);
  `, sandbox);
  assert.equal(elements.get("methodBadge").textContent, "班表推估 · 非 GPS");
});

test("官方進站事件只在背景校正，不畫車站光圈或顯示正數計時", () => {
  assert.doesNotMatch(script, /OFFICIAL_ANCHOR_VISIBLE_MS|freshOfficialStationEvents/);
  assert.doesNotMatch(script, /ctx\.arc\(p\.x,\s*p\.y,\s*9\.5/);
  assert.doesNotMatch(script, /秒前|分前|官方進站錨點：/);
});
