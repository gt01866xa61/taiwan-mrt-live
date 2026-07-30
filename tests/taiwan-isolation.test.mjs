import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const TAIWAN_INDEX_NORMALIZED_SHA256 =
  "11b3b883f91f0066310e7f84554f8d2841b655c1e25dbbf834345cd26dc36b07";

test("日本子站不得改動台灣首頁任何內容", async () => {
  const source = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const normalized = source.replace(/\r\n/g, "\n");
  const digest = createHash("sha256").update(normalized, "utf8").digest("hex");
  assert.equal(digest, TAIWAN_INDEX_NORMALIZED_SHA256);
});
