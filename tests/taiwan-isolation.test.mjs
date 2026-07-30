import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const TAIWAN_INDEX_WITH_APPROVED_JAPAN_ENTRY_SHA256 =
  "16558e148ac72de4ab9bd7e0387933ab9a1c69f3f96b64c8962c6ec677e0272d";

test("台灣首頁只增加核准前待審的日本入口，其餘基準鎖定", async () => {
  const source = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(source, /href="\.\/japan\/"[^>]*>日本版 →<\/a>/);
  const normalized = source.replace(/\r\n/g, "\n");
  const digest = createHash("sha256").update(normalized, "utf8").digest("hex");
  assert.equal(digest, TAIWAN_INDEX_WITH_APPROVED_JAPAN_ENTRY_SHA256);
});
