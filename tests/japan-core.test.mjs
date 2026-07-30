import assert from "node:assert/strict";
import test from "node:test";

import { japanNow } from "../japan/core/clock.mjs";
import { activeTrains, tripPosition } from "../japan/core/timetable.mjs";
import { regions, regionById } from "../japan/data/index.mjs";

test("日本時間固定使用 UTC+9，凌晨三點前歸前一營運日", () => {
  const morning = japanNow(Date.UTC(2026, 6, 30, 0, 0, 0));
  assert.equal(morning.hh, 9);
  assert.equal(morning.serviceDayKey, "2026-07-30");

  const beforeCutoff = japanNow(Date.UTC(2026, 6, 29, 17, 30, 0));
  assert.equal(beforeCutoff.hh, 2);
  assert.equal(beforeCutoff.serviceMinute, 26.5 * 60);
  assert.equal(beforeCutoff.serviceDayKey, "2026-07-29");
});

test("日本版分成四區、共 36 條，資料代號與台灣完全隔離", () => {
  assert.deepEqual(regions.map(region => region.id), ["kanto", "tokai", "kansai", "tohoku"]);
  assert.deepEqual(regions.map(region => region.lines.length), [15, 6, 13, 2]);
  assert.equal(regions.flatMap(region => region.lines).length, 36);
  for (const region of regions) {
    for (const line of region.lines) {
      assert.match(line.id, /^jp-(tokyo|yokohama|nagoya|osaka|kyoto|kobe|sendai)-/);
      assert.ok(line.stations.length >= 2);
      assert.ok(line.timing.durationSeconds > 0);
      assert.ok(line.network);
    }
  }
});

test("每條路線只屬於一個營運系統，禁止跨公司或跨城市全部疊圖", () => {
  for (const region of regions) {
    assert.ok(region.systems.length >= 1);
    assert.ok(region.systems.every(system => system.id !== "all"));
    assert.ok(region.systems.some(system => system.id === region.defaultSystem));

    const memberships = new Map(region.lines.map(line => [line.id, 0]));
    for (const system of region.systems) {
      assert.ok(system.lineIds.length >= 1, `${system.label} 必須有預設單線可顯示`);
      const operators = new Set();
      for (const lineId of system.lineIds) {
        assert.ok(memberships.has(lineId), `${system.label} 含未知路線 ${lineId}`);
        memberships.set(lineId, memberships.get(lineId) + 1);
        operators.add(region.lines.find(line => line.id === lineId).operator);
      }
      assert.equal(operators.size, 1, `${system.label} 不得混合不同營運公司`);
    }
    assert.deepEqual(
      [...memberships.values()],
      Array.from({ length:region.lines.length }, () => 1),
      `${region.name} 每條路線必須恰好歸入一個營運系統`
    );
  }
});

test("同一城市內的跨線轉乘站使用相同座標，不誤合併跨城市同名站", () => {
  for (const region of regions) {
    const seen = new Map();
    for (const line of region.lines) {
      for (const station of line.stations) {
        const key = `${line.network}|${station.name}`;
        const previous = seen.get(key);
        if (previous) {
          assert.equal(
            Math.hypot(previous.x - station.x, previous.y - station.y),
            0,
            `${region.name} ${key} 的轉乘座標不一致`
          );
        } else {
          seen.set(key, station);
        }
      }
    }
  }
});

test("京都東西線完整保留兔子神社周邊的蹴上與東山站，但沒有景點圖層", () => {
  const kansai = regionById("kansai");
  const kyotoTozai = kansai.lines.find(line => line.id === "jp-kyoto-t");
  assert.ok(kyotoTozai);
  assert.ok(kyotoTozai.stations.some(station => station.code === "T09" && station.name === "蹴上"));
  assert.ok(kyotoTozai.stations.some(station => station.code === "T10" && station.name === "東山"));
  assert.equal("pois" in kansai, false);
});

test("四區在營運時段都能產生平順且有方向的班距模擬列車", () => {
  const clock = {
    serviceMinute: 12 * 60,
    serviceDayKey: "2026-07-30",
    isHoliday: false
  };
  for (const region of regions) {
    const visible = new Set(region.lines.map(line => line.id));
    const trains = activeTrains(region.lines, clock, visible);
    assert.ok(trains.length > region.lines.length, `${region.name} 沒有產生足夠列車`);
    for (const train of trains) {
      assert.ok(Number.isFinite(train.position.x));
      assert.ok(Number.isFinite(train.position.y));
      assert.notEqual(train.position.hx || train.position.hy, 0);
    }
  }
});

test("列車停站時仍預先指向下一段，不會失去方向", () => {
  const line = regionById("kanto").lines[0];
  const position = tripPosition(line, 0, line.timing.runSeconds + 1);
  assert.equal(position.atStation, true);
  assert.notEqual(position.hx || position.hy, 0);
});
