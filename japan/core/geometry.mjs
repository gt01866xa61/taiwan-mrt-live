export function interpolateStations(stations, anchors) {
  const anchored = [];
  for (let index = 0; index < stations.length; index++) {
    const point = anchors[stations[index].code];
    if (point) anchored.push({ index, x: point[0], y: point[1] });
  }
  if (!anchored.length || anchored[0].index !== 0 || anchored.at(-1).index !== stations.length - 1) {
    throw new Error("Each line needs anchors for its first and final station");
  }

  const positioned = stations.map(station => ({ ...station, x: 0, y: 0 }));
  for (let segment = 0; segment < anchored.length - 1; segment++) {
    const start = anchored[segment];
    const end = anchored[segment + 1];
    const span = end.index - start.index;
    for (let index = start.index; index <= end.index; index++) {
      const ratio = span ? (index - start.index) / span : 0;
      positioned[index].x = start.x + (end.x - start.x) * ratio;
      positioned[index].y = start.y + (end.y - start.y) * ratio;
    }
  }
  return positioned;
}

export function buildPath(stations) {
  const segments = [];
  let totalLength = 0;
  for (let index = 0; index < stations.length - 1; index++) {
    const start = stations[index];
    const end = stations[index + 1];
    const length = Math.hypot(end.x - start.x, end.y - start.y) || 1e-9;
    segments.push({ start, end, length, offset: totalLength });
    totalLength += length;
  }
  return { segments, totalLength };
}

export function pointOnSegment(start, end, ratio, backward = false) {
  const clamped = Math.max(0, Math.min(1, ratio));
  let hx = end.x - start.x;
  let hy = end.y - start.y;
  if (backward) {
    hx *= -1;
    hy *= -1;
  }
  return {
    x: start.x + (end.x - start.x) * clamped,
    y: start.y + (end.y - start.y) * clamped,
    hx,
    hy
  };
}

export function boundsFor(items, padding = 1) {
  const points = items.flatMap(item => item.stations || item.points || []);
  const xValues = points.map(point => point.x);
  const yValues = points.map(point => point.y);
  return {
    x0: Math.min(...xValues) - padding,
    x1: Math.max(...xValues) + padding,
    y0: Math.min(...yValues) - padding,
    y1: Math.max(...yValues) + padding
  };
}
