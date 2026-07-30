import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const pageUrl = new URL("../japan/index.html", import.meta.url);
const execFileAsync = promisify(execFile);

test("日本子站入口與資產完整，四區切換且能回台灣版", async () => {
  const html = await readFile(pageUrl, "utf8");
  assert.match(html, /href="\.\.\/"[^>]*>← 台灣版<\/a>/);
  assert.match(html, /href="\.\/styles\.css"/);
  assert.match(html, /type="module" src="\.\/app\.mjs"/);
  for (const id of ["kanto", "tokai", "kansai", "tohoku"]) {
    assert.match(html, new RegExp(`data-region="${id}"`));
  }
  await access(new URL("../japan/styles.css", import.meta.url));
  await access(new URL("../japan/app.mjs", import.meta.url));
});

test("日本頁採台灣版編排語義，清楚揭露 36 線模擬限制", async () => {
  const html = await readFile(pageUrl, "utf8");
  for (const text of ["班距模擬 · 非 GPS", "畫面顯示", "位置推估", "選擇顯示路線", "共 36 條"]) {
    assert.match(html, new RegExp(text));
  }
  assert.match(html, /尚未逐班對齊各公司完整時刻表/);
  assert.match(html, /路網總覽/);
  assert.match(html, /單線行車圖/);
  assert.match(html, /不同公司、不同城市不會再疊在同一張圖/);
  assert.match(html, /景點本身不是地鐵站，所以不另外放進路線圖/);
  assert.doesNotMatch(html, /熱門景點|japan-poi|岡崎神社・兔子神社/);
  assert.doesNotMatch(html, />\s*LIVE\s*</i);
});

test("日本頁列出七地官方來源且不共用台灣版背景狀態", async () => {
  const html = await readFile(pageUrl, "utf8");
  for (const domain of [
    "tokyometro.jp", "kotsu.metro.tokyo.jp", "city.yokohama.lg.jp",
    "kotsu.city.nagoya.jp", "osakametro.co.jp", "city.kyoto.lg.jp",
    "kotsu.city.kobe.lg.jp", "kotsu.city.sendai.jp"
  ]) assert.match(html, new RegExp(domain.replaceAll(".", "\\.")));

  const app = await readFile(new URL("../japan/app.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(app, /\blocalStorage\b|\bserviceWorker\b|officialFeed|stationHints|\bNET\b/);
  assert.doesNotMatch(app, /\bpoi\b|drawPois|PoiTray/);
  assert.doesNotMatch(app, /關東全部|關西全部|applyPreset/);
  assert.match(app, /lineId:system\.lineIds\[0\]/);
  assert.match(app, /function showSystemOverview/);
  assert.match(app, /function selectLine/);
  assert.match(app, /overviewTrainPoints/);
  assert.match(app, /moveTo\(-5\.8, -2\.2\)/);
});

test("日本頁主程式與資料模組通過 JavaScript 語法檢查", async () => {
  const paths = [
    new URL("../japan/app.mjs", import.meta.url),
    new URL("../japan/data/index.mjs", import.meta.url)
  ];
  for (const url of paths) {
    await execFileAsync(process.execPath, ["--check", fileURLToPath(url)]);
  }
});
