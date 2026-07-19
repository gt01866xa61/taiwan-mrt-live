# HANDOFF.md

本 repo 是「台灣捷運動態圖」的獨立專案：

- Repository：`gt01866xa61/taiwan-mrt-live`
- 公開網站：<https://gt01866xa61.github.io/taiwan-mrt-live/>
- 主程式：根目錄 `index.html`
- 技術：單一 HTML／CSS／JavaScript，無建置工具、無外部套件

## 開工前

1. 讀 `README.md`。
2. 跑 `git status` 與 `git log --oneline -10`。
3. 確認 `main` 已與 `origin/main` 對齊。
4. 先用手機尺寸預覽目前版本，避免破壞已完成的互動與視覺。

## 必須保留

- 捷運官方路網圖式的 45°／90° 示意布局，不追求真實地理投影。
- 列車標記要美觀且能辨識行進方向。
- 北北桃、台中、高雄三區與現有 18 線／258 站。
- 台北時間同步的班距模擬。
- 「非逐車 GPS，而是依公開班距推算」的明確揭露。
- 手機拖曳、雙指縮放、路線開關、列車／車站資訊。

## 變更與部署

- 一般修正與增量改善可在本 repo 內完成、驗證並部署。
- 若變更可能刪除既有路線／車站、改變模擬語義、取代整體視覺方向，
  或影響公開網址可用性，先交給使用者審核。
- push 到 `main` 後，`.github/workflows/pages.yml` 會部署 GitHub Pages。
- 部署後實際開啟公開網址，不能只以 workflow 綠燈作為完成證據。

