import assert from "node:assert/strict";
import test from "node:test";

import { japanNow } from "../japan/core/clock.mjs";
import { activeTrains, tripPosition } from "../japan/core/timetable.mjs";
import { cities, cityById } from "../japan/data/index.mjs";

test("日本時間固定使用 UTC+9，凌晨三點前歸前一營運日", () => {
  const morning = japanNow(Date.UTC(2026, 6, 30, 0, 0, 0));
  assert.equal(morning.hh, 9);
  assert.equal(morning.mm, 0);
  assert.equal(morning.serviceDayKey, "2026-07-30");

  const beforeCutoff = japanNow(Date.UTC(2026, 6, 29, 17, 30, 0));
  assert.equal(beforeCutoff.hh, 2);
  assert.equal(beforeCutoff.serviceMinute, 26.5 * 60);
  assert.equal(beforeCutoff.serviceDayKey, "2026-07-29");
});

test("首版只包含東京六線、大阪五線、京都兩線，代號與台灣完全隔離", () => {
  assert.deepEqual(cities.map(city => city.id), ["tokyo", "osaka", "kyoto"]);
  assert.deepEqual(cities.map(city => city.lines.length), [6, 5, 2]);
  for (const city of cities) {
    for (const line of city.lines) {
      assert.match(line.id, /^jp-(tokyo|osaka|kyoto)-/);
      assert.ok(line.stations.length >= 10);
      assert.ok(line.timing.durationSeconds > 0);
    }
  }
});

test("跨線轉乘站在示意圖上使用完全相同座標", () => {
  for (const city of cities) {
    const seen = new Map();
    for (const line of city.lines) {
      for (const station of line.stations) {
        const previous = seen.get(station.name);
        if (previous) {
          assert.equal(
            Math.hypot(previous.x - station.x, previous.y - station.y),
            0,
            `${city.name} ${station.name} 的轉乘座標不一致`
          );
        } else {
          seen.set(station.name, station);
        }
      }
    }
  }
});

test("京都岡崎神社是景點而非偽裝成地鐵站", () => {
  const kyoto = cityById("kyoto");
  const rabbit = kyoto.pois.find(poi => poi.id === "kyoto-okazaki");
  assert.ok(rabbit);
  assert.equal(rabbit.featured, true);
  assert.equal(rabbit.station, "蹴上");
  assert.match(rabbit.note, /32／93／203／204/);
  assert.equal(
    kyoto.lines.some(line => line.stations.some(station => station.name.includes("岡崎神社"))),
    false
  );
});

test("東京、大阪、京都在營運時段都能產生平順班距模擬列車", () => {
  const clock = {
    serviceMinute: 12 * 60,
    serviceDayKey: "2026-07-30",
    isHoliday: false
  };
  for (const city of cities) {
    const visible = new Set(city.lines.map(line => line.id));
    const trains = activeTrains(city.lines, clock, visible);
    assert.ok(trains.length > city.lines.length, `${city.name} 沒有產生足夠列車`);
    for (const train of trains) {
      assert.ok(Number.isFinite(train.position.x));
      assert.ok(Number.isFinite(train.position.y));
      assert.notEqual(train.position.hx || train.position.hy, 0);
    }
  }
});

test("列車在停站時仍預先指向下一段，不會失去方向", () => {
  const line = cityById("tokyo").lines[0];
  const elapsed = line.timing.runSeconds + 1;
  const position = tripPosition(line, 0, elapsed);
  assert.equal(position.atStation, true);
  assert.notEqual(position.hx || position.hy, 0);
});
