import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const pageUrl = new URL("../japan/index.html", import.meta.url);
const execFileAsync = promisify(execFile);

test("日本子站入口與資產完整，並能直接回到台灣版", async () => {
  const html = await readFile(pageUrl, "utf8");
  assert.match(html, /href="\.\.\/"[^>]*>← 台灣版<\/a>/);
  assert.match(html, /href="\.\/styles\.css"/);
  assert.match(html, /type="module" src="\.\/app\.mjs"/);
  assert.match(html, /data-city="tokyo"/);
  assert.match(html, /data-city="osaka"/);
  assert.match(html, /data-city="kyoto"/);
  await access(new URL("../japan/styles.css", import.meta.url));
  await access(new URL("../japan/app.mjs", import.meta.url));
});

test("日本頁清楚揭露模擬語義，不把兔子神社當車站或宣稱 LIVE", async () => {
  const html = await readFile(pageUrl, "utf8");
  assert.match(html, /班距模擬 · 非 GPS/);
  assert.match(html, /尚未逐班對齊官方時刻表/);
  assert.match(html, /岡崎神社・兔子神社/);
  assert.match(html, /是旅遊景點，不是地鐵站/);
  assert.match(html, /tokyometro\.jp\/tcn\/subwaymap/);
  assert.match(html, /subway-tr\.osakametro\.co\.jp/);
  assert.match(html, /city\.kyoto\.lg\.jp\/kotsu/);
  assert.doesNotMatch(html, />\s*LIVE\s*</i);
});

test("日本子站不共用台灣版狀態或背景服務", async () => {
  const app = await readFile(new URL("../japan/app.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(app, /\blocalStorage\b/);
  assert.doesNotMatch(app, /\bserviceWorker\b/);
  assert.doesNotMatch(app, /officialFeed|stationHints|REGIONS|\bNET\b/);
});

test("日本頁主程式通過 JavaScript 語法檢查", async () => {
  const appPath = fileURLToPath(new URL("../japan/app.mjs", import.meta.url));
  await execFileAsync(process.execPath, ["--check", appPath]);
});
