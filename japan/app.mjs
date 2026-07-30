import { cities, cityById } from "./data/index.mjs";
import { japanNow, formatJapanClock } from "./core/clock.mjs";
import { activeTrains } from "./core/timetable.mjs";
import { boundsFor } from "./core/geometry.mjs";

const canvas = document.getElementById("japanMap");
const context = canvas.getContext("2d");
const topbar = document.querySelector(".japan-topbar");
const trainCount = document.getElementById("japanTrainCount");
const offBanner = document.getElementById("japanOffBanner");
const routeSheet = document.getElementById("japanRouteSheet");
const routeButton = document.getElementById("japanRouteButton");
const routeSummary = document.getElementById("japanRouteSummary");
const routeSubtitle = document.getElementById("japanRouteSubtitle");
const routeList = document.getElementById("japanRouteList");
const presetList = document.getElementById("japanPresets");
const poiTray = document.getElementById("japanPoiTray");
const emptyState = document.getElementById("japanEmpty");
const popup = document.getElementById("japanPopup");
const popupChip = document.getElementById("japanPopupChip");
const popupTitle = document.getElementById("japanPopupTitle");
const popupMeta = document.getElementById("japanPopupMeta");
const scrim = document.getElementById("japanScrim");

let width = 0;
let height = 0;
let pixelRatio = 1;
let currentCity = cityById("tokyo");
let selected = null;
let drawnTrains = [];
let drawnPois = [];
let drawnStations = [];
let lastClockSecond = -1;
let lastDrawSecond = -1;
let labelBoxes = [];

const view = { scale: 12, x: 0, y: 0 };
const visibility = new Map(
  cities.map(city => [city.id, new Set(city.lines.map(line => line.id))])
);
const activePreset = new Map(cities.map(city => [city.id, "all"]));
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

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

function lineLuma(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return (
    0.299 * ((value >> 16) & 255) +
    0.587 * ((value >> 8) & 255) +
    0.114 * (value & 255)
  ) / 255;
}

function visibleIds() {
  return visibility.get(currentCity.id);
}

function visibleLines() {
  const ids = visibleIds();
  return currentCity.lines.filter(line => ids.has(line.id));
}

function stationNodes(city = currentCity) {
  const nodes = new Map();
  for (const line of city.lines) {
    for (const station of line.stations) {
      if (!nodes.has(station.name)) {
        nodes.set(station.name, {
          name: station.name,
          x: station.x,
          y: station.y,
          codes: new Set(),
          japaneseNames: new Set(),
          lines: new Set(),
          lineIds: new Set()
        });
      }
      const node = nodes.get(station.name);
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
  return {
    x: point.x * view.scale + view.x,
    y: point.y * view.scale + view.y
  };
}

function fitCity() {
  const lines = visibleLines();
  const fitItems = lines.length
    ? [...lines, { points: currentCity.pois }]
    : [...currentCity.lines, { points: currentCity.pois }];
  const bounds = boundsFor(fitItems, 1.4);
  const topbarBottom = topbar.getBoundingClientRect().bottom;
  document.documentElement.style.setProperty(
    "--jp-topbar-bottom",
    `${Math.ceil(topbarBottom)}px`
  );
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
  view.y =
    topPadding +
    usableHeight / 2 -
    ((bounds.y0 + bounds.y1) / 2) * view.scale;
}

function focusPoint(point, targetScale = Math.max(view.scale, 18)) {
  view.scale = Math.min(80, targetScale);
  view.x = width / 2 - point.x * view.scale;
  view.y = height / 2 - point.y * view.scale;
}

function trainShape(ctx, length, trainWidth) {
  const rear = -length / 2;
  const nose = length / 2;
  const radius = trainWidth / 2;
  ctx.beginPath();
  ctx.moveTo(rear + 1, -radius);
  ctx.lineTo(nose - radius * 0.7, -radius);
  ctx.quadraticCurveTo(nose, -radius * 0.78, nose, 0);
  ctx.quadraticCurveTo(nose, radius * 0.78, nose - radius * 0.7, radius);
  ctx.lineTo(rear + 1, radius);
  ctx.quadraticCurveTo(rear, radius * 0.7, rear, radius * 0.32);
  ctx.lineTo(rear, -radius * 0.32);
  ctx.quadraticCurveTo(rear, -radius * 0.7, rear + 1, -radius);
  ctx.closePath();
}

function boxesOverlap(first, second, gap = 3) {
  return !(
    first.x1 + gap < second.x0 ||
    first.x0 - gap > second.x1 ||
    first.y1 + gap < second.y0 ||
    first.y0 - gap > second.y1
  );
}

function placeLabel(text, candidates, options = {}) {
  const {
    font = "700 10px -apple-system,'PingFang TC','Noto Sans TC',sans-serif",
    color = tokens.ink,
    force = false
  } = options;
  context.font = font;
  context.textBaseline = "middle";
  const widthText = context.measureText(text).width;
  const heightText = 12;

  for (const candidate of candidates) {
    const align = candidate.align || "left";
    const x0 = align === "right" ? candidate.x - widthText : candidate.x;
    const box = {
      x0,
      x1: x0 + widthText,
      y0: candidate.y - heightText / 2,
      y1: candidate.y + heightText / 2
    };
    const inView =
      box.x1 >= 2 && box.x0 <= width - 2 &&
      box.y1 >= 2 && box.y0 <= height - 2;
    if (!inView || (!force && labelBoxes.some(existing => boxesOverlap(existing, box)))) {
      continue;
    }
    context.textAlign = align;
    context.lineWidth = 3;
    context.strokeStyle = tokens.halo;
    context.strokeText(text, candidate.x, candidate.y);
    context.fillStyle = color;
    context.fillText(text, candidate.x, candidate.y);
    labelBoxes.push(box);
    return true;
  }
  return false;
}

function drawLine(line) {
  const lineWidth = Math.max(3, Math.min(8, view.scale * 0.34));
  context.beginPath();
  line.stations.forEach((station, index) => {
    const point = mapToScreen(station);
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.strokeStyle = line.color;
  context.lineWidth = lineWidth;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.stroke();
}

function drawPoiConnectors(nodes) {
  context.save();
  context.setLineDash([4, 5]);
  context.lineWidth = 1.5;
  context.strokeStyle = tokens.muted;
  context.globalAlpha = 0.58;
  for (const poi of currentCity.pois) {
    const station = nodes.get(poi.station);
    if (!station) continue;
    const start = mapToScreen(station);
    const end = mapToScreen(poi);
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }
  context.restore();
}

function drawStations(nodes) {
  drawnStations = [];
  const ids = visibleIds();
  const poiStations = new Set(currentCity.pois.map(poi => poi.station));
  const showAll = view.scale > 19;
  const showTransfers = view.scale > 16;
  const showTerminals = view.scale > 14;
  const showTouristStations = view.scale > 12;
  const stationRadius = Math.max(2.3, Math.min(3.8, view.scale * 0.18));
  const transferRadius = Math.max(3.5, Math.min(6, view.scale * 0.28));

  for (const station of nodes.values()) {
    const visibleLineIds = [...station.lineIds].filter(id => ids.has(id));
    if (!visibleLineIds.length) continue;
    const point = mapToScreen(station);
    if (point.x < -36 || point.x > width + 36 || point.y < -36 || point.y > height + 36) {
      continue;
    }
    const isTransfer = visibleLineIds.length > 1;
    const isTerminal = currentCity.lines.some(line =>
      ids.has(line.id) &&
      (line.stations[0].name === station.name || line.stations.at(-1).name === station.name)
    );
    const isTourist = poiStations.has(station.name);
    const radius = isTransfer ? transferRadius : stationRadius;

    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fillStyle = tokens.panel;
    context.fill();
    context.lineWidth = isTransfer ? 2.4 : 1.8;
    const firstLine = currentCity.lines.find(line => line.id === visibleLineIds[0]);
    context.strokeStyle = isTransfer ? tokens.ink : firstLine.color;
    context.stroke();

    if (
      showAll ||
      (showTransfers && isTransfer) ||
      (showTerminals && isTerminal) ||
      (showTouristStations && isTourist)
    ) {
      const important = isTransfer || isTerminal || isTourist;
      const offset = radius + 4;
      placeLabel(
        station.name,
        [
          { x:point.x + offset, y:point.y - offset, align:"left" },
          { x:point.x - offset, y:point.y - offset, align:"right" },
          { x:point.x + offset, y:point.y + offset, align:"left" },
          { x:point.x - offset, y:point.y + offset, align:"right" }
        ],
        {
          font: `${important ? 700 : 500} ${showAll ? 10 : 9}px -apple-system,'PingFang TC','Noto Sans TC',sans-serif`,
          color: important ? tokens.ink : tokens.muted
        }
      );
    }

    drawnStations.push({ station, x: point.x, y: point.y });
  }
}

function drawPois() {
  drawnPois = [];
  for (const poi of currentCity.pois) {
    const point = mapToScreen(poi);
    if (point.x < -50 || point.x > width + 50 || point.y < -50 || point.y > height + 50) {
      continue;
    }
    const selectedPoi = selected?.type === "poi" && selected.item.id === poi.id;
    const radius = selectedPoi ? 12 : 10;
    context.save();
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fillStyle = poi.featured ? tokens.accent : tokens.panel;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = poi.featured ? tokens.panel : tokens.accent;
    context.stroke();
    context.fillStyle = poi.featured ? "#FFFFFF" : tokens.ink;
    context.font = poi.icon === "🐇" ? "13px sans-serif" : "800 10px sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(poi.icon, point.x, point.y + 0.5);
    context.restore();

    const offset = radius + 4;
    placeLabel(
      poi.name,
      [
        { x:point.x + offset, y:point.y, align:"left" },
        { x:point.x - offset, y:point.y, align:"right" },
        { x:point.x + offset, y:point.y - offset, align:"left" },
        { x:point.x - offset, y:point.y - offset, align:"right" }
      ],
      {
        font: `850 ${poi.featured ? 11 : 10}px -apple-system,'PingFang TC','Noto Sans TC',sans-serif`,
        color: tokens.ink,
        force: poi.featured
      }
    );
    drawnPois.push({ item: poi, x: point.x, y: point.y });
  }
}

function drawTrain(train) {
  const point = mapToScreen(train.position);
  if (point.x < -28 || point.x > width + 28 || point.y < -28 || point.y > height + 28) {
    return { ...train, x: -999, y: -999 };
  }
  const isSelected =
    selected?.type === "train" &&
    selected.line.id === train.line.id &&
    selected.direction === train.direction &&
    selected.departure === train.departure;
  const baseScale = Math.max(0.72, Math.min(1.18, view.scale / 24));
  const markerScale = isSelected ? baseScale * 1.28 : baseScale;
  const angle = Math.atan2(train.position.hy, train.position.hx);

  context.save();
  context.translate(point.x, point.y);
  context.rotate(angle);
  context.scale(markerScale, markerScale);
  trainShape(context, 17, 9.5);
  context.fillStyle = train.line.color;
  context.fill();
  context.lineWidth = 1.7;
  context.strokeStyle = "rgba(255,255,255,.96)";
  context.stroke();
  context.beginPath();
  context.arc(3.5, 0, 2.9, -Math.PI / 2, Math.PI / 2);
  context.strokeStyle =
    lineLuma(train.line.color) > 0.62
      ? "rgba(24,30,36,.68)"
      : "rgba(255,255,255,.96)";
  context.lineWidth = 1.7;
  context.stroke();
  context.restore();

  if (isSelected) {
    context.beginPath();
    context.arc(point.x, point.y, 18 * baseScale, 0, Math.PI * 2);
    context.strokeStyle = train.line.color;
    context.globalAlpha = 0.4;
    context.lineWidth = 2;
    context.stroke();
    context.globalAlpha = 1;
  }
  return { ...train, x: point.x, y: point.y };
}

function draw(clock) {
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.fillStyle = tokens.background;
  context.fillRect(0, 0, width, height);
  labelBoxes = [];

  for (const line of visibleLines()) drawLine(line);
  const nodes = stationNodes();
  drawPoiConnectors(nodes);
  drawPois();
  drawStations(nodes);

  const trains = activeTrains(currentCity.lines, clock, visibleIds());
  drawnTrains = trains.map(drawTrain);
  trainCount.textContent = String(trains.length);
  offBanner.classList.toggle(
    "show",
    visibleLines().length > 0 &&
    trains.length === 0 &&
    (clock.serviceMinute < 5 * 60 || clock.serviceMinute > 25 * 60)
  );
}

function formatEta(seconds) {
  if (seconds < 20) return "即將到站";
  if (seconds < 90) return `約 ${Math.round(seconds / 10) * 10} 秒`;
  return `約 ${Math.round(seconds / 60)} 分鐘`;
}

function setChip(text, background, color = "#FFFFFF") {
  popupChip.textContent = text;
  popupChip.style.background = background;
  popupChip.style.color = color;
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
    const chipColor = lineLuma(live.line.color) > 0.62 ? "#17222D" : "#FFFFFF";
    setChip(live.line.shortName, live.line.color, chipColor);
    popupTitle.textContent = `往 ${live.position.destination.name}`;
    popupMeta.innerHTML = live.position.atStation
      ? `推估停靠 <b>${live.position.nextStation.name}</b> 中`
      : `推估下一站 <b>${live.position.nextStation.name}</b>・${formatEta(live.position.secondsToNext)}
        <br><span>${live.line.sourceMode}・非 GPS</span>`;
  } else if (selected.type === "station") {
    const station = selected.item;
    setChip([...station.codes].join(" · "), tokens.muted);
    popupTitle.textContent = station.name;
    const japanese = [...station.japaneseNames]
      .filter(name => name && name !== station.name)
      .join("／");
    popupMeta.innerHTML = `${japanese ? `${japanese}<br>` : ""}交會路線：${[...station.lines].join("・")}`;
  } else {
    const poi = selected.item;
    setChip("熱門景點", tokens.accent);
    popupTitle.textContent = `${poi.icon} ${poi.name}`;
    popupMeta.innerHTML = `<b>最近主軸：${poi.station}</b><br>${poi.note}`;
  }
  popup.classList.add("show");
}

function selectPoi(poi, refocus = false) {
  selected = { type: "poi", item: poi };
  if (refocus) focusPoint(poi);
  updatePopup();
}

function handleTap(x, y) {
  let match = null;
  let distance = 22;
  for (const train of drawnTrains) {
    const candidate = Math.hypot(train.x - x, train.y - y);
    if (candidate < distance) {
      distance = candidate;
      match = {
        type: "train",
        line: train.line,
        direction: train.direction,
        departure: train.departure
      };
    }
  }
  if (!match) {
    for (const poi of drawnPois) {
      const candidate = Math.hypot(poi.x - x, poi.y - y);
      if (candidate < distance) {
        distance = candidate;
        match = { type: "poi", item: poi.item };
      }
    }
  }
  if (!match) {
    for (const station of drawnStations) {
      const candidate = Math.hypot(station.x - x, station.y - y);
      if (candidate < distance) {
        distance = candidate;
        match = { type: "station", item: station.station };
      }
    }
  }
  selected = match;
  updatePopup();
}

function buildPoiTray() {
  poiTray.replaceChildren();
  for (const poi of currentCity.pois) {
    const button = document.createElement("button");
    button.className = `japan-poi${poi.featured ? " featured" : ""}`;
    button.type = "button";
    button.innerHTML = `<span aria-hidden="true">${poi.icon}</span><span>${poi.name}</span>`;
    button.onclick = () => selectPoi(poi, true);
    poiTray.append(button);
  }
}

function detectPreset() {
  const visible = visibleIds();
  return currentCity.presets.find(preset =>
    preset.lineIds.length === visible.size &&
    preset.lineIds.every(id => visible.has(id))
  )?.id || "custom";
}

function syncRouteUi() {
  const visible = visibleLines();
  const presetId = detectPreset();
  activePreset.set(currentCity.id, presetId);
  const preset = currentCity.presets.find(item => item.id === presetId);
  routeSummary.textContent = visible.length === 0
    ? "未顯示路線"
    : preset
      ? `${preset.label} · ${visible.length} 條`
      : `已選 ${visible.length} / ${currentCity.lines.length} 條`;
  emptyState.hidden = visible.length !== 0;
  for (const button of routeList.querySelectorAll("[data-line-id]")) {
    button.setAttribute("aria-pressed", visibleIds().has(button.dataset.lineId));
  }
  for (const button of presetList.querySelectorAll("[data-preset-id]")) {
    const on = button.dataset.presetId === presetId;
    button.classList.toggle("on", on);
    button.setAttribute("aria-pressed", String(on));
  }
}

function applyPreset(presetId) {
  const preset =
    currentCity.presets.find(item => item.id === presetId) ||
    currentCity.presets[0];
  visibility.set(currentCity.id, new Set(preset.lineIds));
  activePreset.set(currentCity.id, preset.id);
  selected = null;
  popup.classList.remove("show");
  syncRouteUi();
  fitCity();
}

function buildRouteSheet() {
  routeSubtitle.textContent = currentCity.subtitle;
  presetList.replaceChildren();
  for (const preset of currentCity.presets) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.presetId = preset.id;
    button.textContent = preset.label;
    button.onclick = () => applyPreset(preset.id);
    presetList.append(button);
  }

  routeList.replaceChildren();
  for (const line of currentCity.lines) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "japan-route-row";
    button.dataset.lineId = line.id;
    button.style.setProperty("--route-color", line.color);
    button.innerHTML = `
      <span class="japan-route-dot" aria-hidden="true"></span>
      <span class="japan-route-copy">
        <b>${line.shortName}</b>
        <small>${line.sourceMode}</small>
      </span>
      <span class="japan-route-toggle" aria-hidden="true"></span>`;
    button.onclick = () => {
      const ids = visibleIds();
      if (ids.has(line.id)) ids.delete(line.id);
      else ids.add(line.id);
      selected = null;
      popup.classList.remove("show");
      syncRouteUi();
      fitCity();
    };
    routeList.append(button);
  }
  syncRouteUi();
}

function setCity(id) {
  currentCity = cityById(id);
  selected = null;
  popup.classList.remove("show");
  for (const tab of document.querySelectorAll("[data-city]")) {
    const on = tab.dataset.city === currentCity.id;
    tab.classList.toggle("on", on);
    tab.setAttribute("aria-selected", String(on));
    tab.tabIndex = on ? 0 : -1;
  }
  buildPoiTray();
  buildRouteSheet();
  fitCity();
}

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
  pointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY,
    startX: event.clientX,
    startY: event.clientY
  });
  if (pointers.size === 2) {
    const [first, second] = [...pointers.values()];
    pinch = {
      distance: Math.hypot(first.x - second.x, first.y - second.y),
      scale: view.scale,
      centerX: (first.x + second.x) / 2,
      centerY: (first.y + second.y) / 2,
      viewX: view.x,
      viewY: view.y
    };
  }
  canvas.classList.add("dragging");
});

canvas.addEventListener("pointermove", event => {
  const pointer = pointers.get(event.pointerId);
  if (!pointer) return;
  const deltaX = event.clientX - pointer.x;
  const deltaY = event.clientY - pointer.y;
  pointer.x = event.clientX;
  pointer.y = event.clientY;

  if (pointers.size === 1) {
    view.x += deltaX;
    view.y += deltaY;
  } else if (pointers.size === 2 && pinch) {
    const [first, second] = [...pointers.values()];
    const distance = Math.hypot(first.x - second.x, first.y - second.y);
    const next = Math.max(3, Math.min(80, pinch.scale * distance / pinch.distance));
    const ratio = next / pinch.scale;
    const centerX = (first.x + second.x) / 2;
    const centerY = (first.y + second.y) / 2;
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
  if (
    pointer &&
    Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) < 6
  ) {
    handleTap(event.clientX, event.clientY);
  }
}

canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", event => {
  pointers.delete(event.pointerId);
  pinch = null;
  if (pointers.size === 0) canvas.classList.remove("dragging");
});
canvas.addEventListener("wheel", event => {
  event.preventDefault();
  const next = Math.max(3, Math.min(80, view.scale * Math.exp(-event.deltaY * 0.0015)));
  const ratio = next / view.scale;
  view.x = event.clientX - (event.clientX - view.x) * ratio;
  view.y = event.clientY - (event.clientY - view.y) * ratio;
  view.scale = next;
}, { passive: false });

document.getElementById("japanZoomIn").onclick = () => zoomBy(1.5);
document.getElementById("japanZoomOut").onclick = () => zoomBy(1 / 1.5);
document.getElementById("japanFit").onclick = fitCity;
document.getElementById("japanInfo").onclick = () => scrim.classList.add("show");
document.getElementById("japanInfoClose").onclick = () => scrim.classList.remove("show");
document.getElementById("japanPopupClose").onclick = () => {
  selected = null;
  popup.classList.remove("show");
};
document.getElementById("japanRestore").onclick = () => applyPreset("all");
document.getElementById("japanShowAll").onclick = () => applyPreset("all");
document.getElementById("japanRouteClose").onclick = closeSheet;
routeButton.onclick = openSheet;
routeSheet.addEventListener("close", () => routeButton.setAttribute("aria-expanded", "false"));
routeSheet.addEventListener("click", event => {
  if (event.target === routeSheet) closeSheet();
});
scrim.addEventListener("click", event => {
  if (event.target === scrim) scrim.classList.remove("show");
});
for (const tab of document.querySelectorAll("[data-city]")) {
  tab.onclick = () => setCity(tab.dataset.city);
}

window.addEventListener("resize", () => {
  const oldWidth = width;
  const oldHeight = height;
  resize();
  const orientationChanged = (oldWidth > oldHeight) !== (width > height);
  if (orientationChanged || Math.abs(width - oldWidth) > 80) fitCity();
});

function frame() {
  const clock = japanNow();
  if (clock.ss !== lastClockSecond) {
    lastClockSecond = clock.ss;
    document.getElementById("japanClock").textContent = formatJapanClock(clock);
    document.getElementById("japanClockSub").textContent =
      `日本時間 ${clock.dateText}（${clock.dowText}）`;
  }
  if (!reducedMotion || clock.ss !== lastDrawSecond) {
    draw(clock);
    lastDrawSecond = clock.ss;
  }
  updatePopup();
  requestAnimationFrame(frame);
}

resize();
setCity("tokyo");
requestAnimationFrame(frame);

window.__JAPAN_METRO_TEST__ = Object.freeze({
  cities,
  stationNodes,
  visibility,
  setCity,
  fitCity
});
