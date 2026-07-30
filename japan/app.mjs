import { regions, regionById } from "./data/index.mjs";
import { japanNow, formatJapanClock } from "./core/clock.mjs";
import { activeTrains } from "./core/timetable.mjs";
import { boundsFor } from "./core/geometry.mjs";

const $ = id => document.getElementById(id);
const canvas = $("japanMap");
const context = canvas.getContext("2d");
const topbar = document.querySelector(".japan-topbar");
const routeSheet = $("japanRouteSheet");
const routeButton = $("japanRouteButton");
const popup = $("japanPopup");
const scrim = $("japanScrim");

let width = 0;
let height = 0;
let pixelRatio = 1;
let currentRegion = regionById("kanto");
let selected = null;
let drawnTrains = [];
let drawnStations = [];
let labelBoxes = [];
let lastClockSecond = -1;
let lastDrawSecond = -1;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const view = { scale: 12, x: 0, y: 0 };
const visibility = new Map(regions.map(region => {
  const preset = region.presets.find(item => item.id === region.defaultPreset);
  return [region.id, new Set(preset.lineIds)];
}));

function cssTokens() {
  const style = getComputedStyle(document.documentElement);
  return {
    background: style.getPropertyValue("--jp-bg").trim(),
    panel: style.getPropertyValue("--jp-panel-solid").trim(),
    ink: style.getPropertyValue("--jp-ink").trim(),
    muted: style.getPropertyValue("--jp-muted").trim(),
    accent: style.getPropertyValue("--jp-accent").trim(),
    halo: style.getPropertyValue("--jp-halo").trim()
  };
}

let tokens = cssTokens();
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  tokens = cssTokens();
});

function visibleIds() {
  return visibility.get(currentRegion.id);
}

function visibleLines() {
  const ids = visibleIds();
  return currentRegion.lines.filter(line => ids.has(line.id));
}

function stationNodes(region = currentRegion) {
  const nodes = new Map();
  for (const line of region.lines) {
    for (const station of line.stations) {
      const key = `${line.network}|${station.name}`;
      if (!nodes.has(key)) {
        nodes.set(key, {
          key,
          network: line.network,
          name: station.name,
          x: station.x,
          y: station.y,
          codes: new Set(),
          japaneseNames: new Set(),
          lines: new Set(),
          lineIds: new Set()
        });
      }
      const node = nodes.get(key);
      node.codes.add(station.code);
      node.japaneseNames.add(station.ja);
      node.lines.add(line.shortName);
      node.lineIds.add(line.id);
    }
  }
  return nodes;
}

function resize() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

function mapToScreen(point) {
  return { x: point.x * view.scale + view.x, y: point.y * view.scale + view.y };
}

function fitRegion() {
  const lines = visibleLines().length ? visibleLines() : currentRegion.lines;
  const bounds = boundsFor(lines, 1.4);
  const topbarBottom = topbar.getBoundingClientRect().bottom;
  document.documentElement.style.setProperty("--jp-topbar-bottom", `${Math.ceil(topbarBottom)}px`);
  const sidePadding = width <= 560 ? 28 : 54;
  const topPadding = Math.ceil(topbarBottom + 12);
  const bottomPadding = width <= 560 ? 92 : 98;
  const usableHeight = Math.max(150, height - topPadding - bottomPadding);
  const scale = Math.min(
    (width - sidePadding * 2) / Math.max(1, bounds.x1 - bounds.x0),
    usableHeight / Math.max(1, bounds.y1 - bounds.y0)
  );
  view.scale = Math.max(3, Math.min(80, scale));
  view.x = width / 2 - ((bounds.x0 + bounds.x1) / 2) * view.scale;
  view.y = topPadding + usableHeight / 2 - ((bounds.y0 + bounds.y1) / 2) * view.scale;
}

function lineLuma(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return (0.299 * ((value >> 16) & 255) + 0.587 * ((value >> 8) & 255) + 0.114 * (value & 255)) / 255;
}

function trainBodyPath(ctx, length, trainWidth) {
  const rear = -length / 2;
  const nose = length / 2;
  const radius = trainWidth / 2;
  ctx.beginPath();
  ctx.moveTo(rear + 1.2, -radius);
  ctx.lineTo(nose - radius * 0.72, -radius);
  ctx.quadraticCurveTo(nose, -radius * 0.78, nose, 0);
  ctx.quadraticCurveTo(nose, radius * 0.78, nose - radius * 0.72, radius);
  ctx.lineTo(rear + 1.2, radius);
  ctx.quadraticCurveTo(rear, radius * 0.7, rear, radius * 0.36);
  ctx.lineTo(rear, -radius * 0.36);
  ctx.quadraticCurveTo(rear, -radius * 0.7, rear + 1.2, -radius);
  ctx.closePath();
}

function boxesOverlap(a, b, gap = 3) {
  return !(a.x1 + gap < b.x0 || a.x0 - gap > b.x1 || a.y1 + gap < b.y0 || a.y0 - gap > b.y1);
}

function placeLabel(text, candidates, important) {
  const fontSize = important ? 10 : 9;
  context.font = `${important ? 700 : 500} ${fontSize}px -apple-system,'PingFang TC','Noto Sans TC',sans-serif`;
  context.textBaseline = "middle";
  const textWidth = context.measureText(text).width;
  for (const candidate of candidates) {
    const x0 = candidate.align === "right" ? candidate.x - textWidth : candidate.x;
    const box = { x0, x1:x0 + textWidth, y0:candidate.y - 6, y1:candidate.y + 6 };
    if (box.x1 < 2 || box.x0 > width - 2 || box.y1 < 2 || box.y0 > height - 2) continue;
    if (labelBoxes.some(existing => boxesOverlap(existing, box))) continue;
    context.textAlign = candidate.align;
    context.lineWidth = 3;
    context.strokeStyle = tokens.halo;
    context.strokeText(text, candidate.x, candidate.y);
    context.fillStyle = important ? tokens.ink : tokens.muted;
    context.fillText(text, candidate.x, candidate.y);
    labelBoxes.push(box);
    return;
  }
}

function drawLine(line) {
  context.beginPath();
  line.stations.forEach((station, index) => {
    const point = mapToScreen(station);
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.strokeStyle = line.color;
  context.lineWidth = Math.max(3, Math.min(8, view.scale * 0.34));
  context.lineJoin = "round";
  context.lineCap = "round";
  context.stroke();
}

function drawStations() {
  drawnStations = [];
  const ids = visibleIds();
  const showAll = view.scale > 30;
  const showTransfers = view.scale > 16;
  const radiusNormal = Math.max(2.2, Math.min(3.6, view.scale * 0.17));
  const radiusTransfer = Math.max(3.4, Math.min(6, view.scale * 0.28));

  for (const station of stationNodes().values()) {
    const activeLineIds = [...station.lineIds].filter(id => ids.has(id));
    if (!activeLineIds.length) continue;
    const point = mapToScreen(station);
    if (point.x < -36 || point.x > width + 36 || point.y < -36 || point.y > height + 36) continue;
    const isTransfer = activeLineIds.length > 1;
    const isTerminal = currentRegion.lines.some(line =>
      line.network === station.network &&
      ids.has(line.id) &&
      (line.stations[0].name === station.name || line.stations.at(-1).name === station.name)
    );
    const radius = isTransfer ? radiusTransfer : radiusNormal;
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fillStyle = tokens.panel;
    context.fill();
    context.lineWidth = isTransfer ? 2.4 : 1.8;
    context.strokeStyle = isTransfer
      ? tokens.ink
      : currentRegion.lines.find(line => line.id === activeLineIds[0]).color;
    context.stroke();

    if (showAll || (showTransfers && (isTransfer || isTerminal)) || (!showTransfers && isTerminal)) {
      const offset = radius + 4;
      placeLabel(station.name, [
        { x:point.x + offset, y:point.y - offset, align:"left" },
        { x:point.x - offset, y:point.y - offset, align:"right" },
        { x:point.x + offset, y:point.y + offset, align:"left" },
        { x:point.x - offset, y:point.y + offset, align:"right" }
      ], isTransfer || isTerminal);
    }
    drawnStations.push({ station, x:point.x, y:point.y });
  }
}

function drawTrain(train) {
  const point = mapToScreen(train.position);
  if (point.x < -28 || point.x > width + 28 || point.y < -28 || point.y > height + 28) {
    return { ...train, x:-999, y:-999 };
  }
  const isSelected = selected?.type === "train" &&
    selected.line.id === train.line.id &&
    selected.direction === train.direction &&
    selected.departure === train.departure;
  const baseScale = Math.max(0.72, Math.min(1.2, view.scale / 24));
  const markerScale = isSelected ? baseScale * 1.3 : baseScale;
  context.save();
  context.translate(point.x, point.y);
  context.rotate(Math.atan2(train.position.hy, train.position.hx));
  context.scale(markerScale, markerScale);
  trainBodyPath(context, 17, 9.5);
  context.fillStyle = train.line.color;
  context.fill();
  context.lineWidth = 1.7;
  context.strokeStyle = "rgba(255,255,255,.95)";
  context.stroke();
  context.beginPath();
  context.arc(3.5, 0, 2.9, -Math.PI / 2, Math.PI / 2);
  context.lineWidth = 1.8;
  context.lineCap = "round";
  context.strokeStyle = lineLuma(train.line.color) > 0.62 ? "rgba(30,30,30,.65)" : "rgba(255,255,255,.95)";
  context.stroke();
  context.beginPath();
  context.moveTo(-5.8, -2.2);
  context.lineTo(-5.8, 2.2);
  context.lineWidth = 1.25;
  context.globalAlpha = 0.62;
  context.stroke();
  context.restore();
  return { ...train, x:point.x, y:point.y };
}

function draw(clock) {
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.fillStyle = tokens.background;
  context.fillRect(0, 0, width, height);
  labelBoxes = [];
  visibleLines().forEach(drawLine);
  drawStations();
  const trains = activeTrains(currentRegion.lines, clock, visibleIds());
  drawnTrains = trains.map(drawTrain);
  $("japanTrainCount").textContent = String(trains.length);
  $("japanOffBanner").classList.toggle(
    "show",
    visibleLines().length > 0 && trains.length === 0 &&
    (clock.serviceMinute < 5 * 60 || clock.serviceMinute > 25 * 60)
  );
}

function formatEta(seconds) {
  if (seconds < 20) return "即將到站";
  if (seconds < 90) return `約 ${Math.round(seconds / 10) * 10} 秒`;
  return `約 ${Math.round(seconds / 60)} 分鐘`;
}

function setChip(text, background, color = "#FFFFFF") {
  $("japanPopupChip").textContent = text;
  $("japanPopupChip").style.background = background;
  $("japanPopupChip").style.color = color;
}

function updatePopup() {
  if (!selected) {
    popup.classList.remove("show");
    return;
  }
  if (selected.type === "train") {
    const live = drawnTrains.find(train =>
      train.line.id === selected.line.id &&
      train.direction === selected.direction &&
      train.departure === selected.departure
    );
    if (!live || live.x === -999) {
      selected = null;
      popup.classList.remove("show");
      return;
    }
    setChip(live.line.shortName, live.line.color, lineLuma(live.line.color) > 0.62 ? "#17222D" : "#FFFFFF");
    $("japanPopupTitle").textContent = `往 ${live.position.destination.name}`;
    $("japanPopupMeta").innerHTML = live.position.atStation
      ? `停靠 <b>${live.position.nextStation.name}</b> 中`
      : `行駛中・下一站 <b>${live.position.nextStation.name}</b>・${formatEta(live.position.secondsToNext)}
        <br><span>${live.line.sourceMode}，非 GPS</span>`;
  } else {
    const station = selected.item;
    setChip([...station.codes].join("・"), tokens.muted);
    $("japanPopupTitle").textContent = station.name;
    const japanese = [...station.japaneseNames].filter(name => name && name !== station.name).join("／");
    $("japanPopupMeta").innerHTML =
      `${japanese ? `${japanese}<br>` : ""}行經路線：${[...station.lines].join("、")}`;
  }
  popup.classList.add("show");
}

function handleTap(x, y) {
  let match = null;
  let distance = 22;
  for (const train of drawnTrains) {
    const candidate = Math.hypot(train.x - x, train.y - y);
    if (candidate < distance) {
      distance = candidate;
      match = { type:"train", line:train.line, direction:train.direction, departure:train.departure };
    }
  }
  if (!match) {
    for (const station of drawnStations) {
      const candidate = Math.hypot(station.x - x, station.y - y);
      if (candidate < distance) {
        distance = candidate;
        match = { type:"station", item:station.station };
      }
    }
  }
  selected = match;
  updatePopup();
}

function detectPreset() {
  const ids = visibleIds();
  return currentRegion.presets.find(preset =>
    preset.lineIds.length === ids.size && preset.lineIds.every(id => ids.has(id))
  )?.id || "custom";
}

function syncRouteUi() {
  const lines = visibleLines();
  const presetId = detectPreset();
  const preset = currentRegion.presets.find(item => item.id === presetId);
  $("japanRouteSummary").textContent = lines.length === 0
    ? "尚未顯示路線"
    : preset ? `${preset.label}・${lines.length} 條` : `自訂 ${lines.length} / ${currentRegion.lines.length} 條`;
  $("japanEmpty").hidden = lines.length !== 0;
  for (const button of document.querySelectorAll("[data-line-id]")) {
    button.setAttribute("aria-pressed", String(visibleIds().has(button.dataset.lineId)));
  }
  for (const button of document.querySelectorAll("[data-preset-id]")) {
    const on = button.dataset.presetId === presetId;
    button.classList.toggle("on", on);
    button.setAttribute("aria-pressed", String(on));
  }
}

function applyPreset(presetId) {
  const preset = currentRegion.presets.find(item => item.id === presetId) || currentRegion.presets[0];
  visibility.set(currentRegion.id, new Set(preset.lineIds));
  selected = null;
  popup.classList.remove("show");
  syncRouteUi();
  fitRegion();
}

function buildRouteSheet() {
  $("japanRouteSubtitle").textContent = `${currentRegion.subtitle}；可依城市／系統快速聚焦`;
  $("japanPresets").replaceChildren(...currentRegion.presets.map(preset => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.presetId = preset.id;
    button.textContent = preset.label;
    button.onclick = () => applyPreset(preset.id);
    return button;
  }));
  $("japanRouteList").replaceChildren(...currentRegion.lines.map(line => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "japan-route-row";
    button.dataset.lineId = line.id;
    button.style.setProperty("--route-color", line.color);
    button.innerHTML = `
      <span class="japan-route-dot" aria-hidden="true"></span>
      <span class="japan-route-copy"><b>${line.shortName}</b><small>${line.operator}</small></span>
      <span class="japan-route-toggle" aria-hidden="true"></span>`;
    button.onclick = () => {
      const ids = visibleIds();
      if (ids.has(line.id)) ids.delete(line.id);
      else ids.add(line.id);
      selected = null;
      popup.classList.remove("show");
      syncRouteUi();
      fitRegion();
    };
    return button;
  }));
  syncRouteUi();
}

function setRegion(id) {
  currentRegion = regionById(id);
  selected = null;
  popup.classList.remove("show");
  for (const tab of document.querySelectorAll("[data-region]")) {
    const on = tab.dataset.region === currentRegion.id;
    tab.classList.toggle("on", on);
    tab.setAttribute("aria-selected", String(on));
    tab.tabIndex = on ? 0 : -1;
  }
  buildRouteSheet();
  fitRegion();
}

function zoomBy(multiplier) {
  const next = Math.max(3, Math.min(80, view.scale * multiplier));
  const ratio = next / view.scale;
  view.x = width / 2 - (width / 2 - view.x) * ratio;
  view.y = height / 2 - (height / 2 - view.y) * ratio;
  view.scale = next;
}

const pointers = new Map();
let pinch = null;
canvas.addEventListener("pointerdown", event => {
  canvas.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x:event.clientX, y:event.clientY, startX:event.clientX, startY:event.clientY });
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinch = {
      distance:Math.hypot(a.x - b.x, a.y - b.y),
      scale:view.scale,
      centerX:(a.x + b.x) / 2,
      centerY:(a.y + b.y) / 2,
      viewX:view.x,
      viewY:view.y
    };
  }
  canvas.classList.add("dragging");
});
canvas.addEventListener("pointermove", event => {
  const pointer = pointers.get(event.pointerId);
  if (!pointer) return;
  const dx = event.clientX - pointer.x;
  const dy = event.clientY - pointer.y;
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  if (pointers.size === 1) {
    view.x += dx;
    view.y += dy;
  } else if (pointers.size === 2 && pinch) {
    const [a, b] = [...pointers.values()];
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    const next = Math.max(3, Math.min(80, pinch.scale * distance / pinch.distance));
    const ratio = next / pinch.scale;
    const centerX = (a.x + b.x) / 2;
    const centerY = (a.y + b.y) / 2;
    view.scale = next;
    view.x = pinch.centerX - (pinch.centerX - pinch.viewX) * ratio + centerX - pinch.centerX;
    view.y = pinch.centerY - (pinch.centerY - pinch.viewY) * ratio + centerY - pinch.centerY;
  }
});
function endPointer(event) {
  const pointer = pointers.get(event.pointerId);
  pointers.delete(event.pointerId);
  if (pointers.size < 2) pinch = null;
  if (pointers.size === 0) canvas.classList.remove("dragging");
  if (pointer && Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) < 6) {
    handleTap(event.clientX, event.clientY);
  }
}
canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", endPointer);
canvas.addEventListener("wheel", event => {
  event.preventDefault();
  const next = Math.max(3, Math.min(80, view.scale * Math.exp(-event.deltaY * 0.0015)));
  const ratio = next / view.scale;
  view.x = event.clientX - (event.clientX - view.x) * ratio;
  view.y = event.clientY - (event.clientY - view.y) * ratio;
  view.scale = next;
}, { passive:false });

function openSheet() {
  routeButton.setAttribute("aria-expanded", "true");
  if (typeof routeSheet.showModal === "function") routeSheet.showModal();
  else routeSheet.setAttribute("open", "");
}
function closeSheet() {
  routeButton.setAttribute("aria-expanded", "false");
  if (routeSheet.open && typeof routeSheet.close === "function") routeSheet.close();
  else routeSheet.removeAttribute("open");
}

$("japanZoomIn").onclick = () => zoomBy(1.5);
$("japanZoomOut").onclick = () => zoomBy(1 / 1.5);
$("japanFit").onclick = fitRegion;
$("japanInfo").onclick = () => scrim.classList.add("show");
$("japanInfoClose").onclick = () => scrim.classList.remove("show");
$("japanPopupClose").onclick = () => {
  selected = null;
  popup.classList.remove("show");
};
$("japanRestore").onclick = () => applyPreset("all");
$("japanShowAll").onclick = () => applyPreset("all");
$("japanRouteClose").onclick = closeSheet;
routeButton.onclick = openSheet;
routeSheet.addEventListener("close", () => routeButton.setAttribute("aria-expanded", "false"));
routeSheet.addEventListener("click", event => {
  if (event.target === routeSheet) closeSheet();
});
scrim.addEventListener("click", event => {
  if (event.target === scrim) scrim.classList.remove("show");
});
for (const tab of document.querySelectorAll("[data-region]")) {
  tab.onclick = () => setRegion(tab.dataset.region);
}
window.addEventListener("resize", () => {
  const oldWidth = width;
  const oldHeight = height;
  resize();
  if ((oldWidth > oldHeight) !== (width > height) || Math.abs(width - oldWidth) > 80) fitRegion();
});

function frame() {
  const clock = japanNow();
  if (clock.ss !== lastClockSecond) {
    lastClockSecond = clock.ss;
    $("japanClock").textContent = formatJapanClock(clock);
    $("japanClockSub").textContent = `日本時間 ${clock.dateText}（${clock.dowText}）`;
  }
  if (!reducedMotion || clock.ss !== lastDrawSecond) {
    draw(clock);
    lastDrawSecond = clock.ss;
  }
  updatePopup();
  requestAnimationFrame(frame);
}

resize();
setRegion("kanto");
requestAnimationFrame(frame);

window.__JAPAN_METRO_TEST__ = Object.freeze({
  regions,
  stationNodes,
  visibility,
  setRegion,
  fitRegion
});
