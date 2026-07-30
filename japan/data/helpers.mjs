import { interpolateStations, buildPath } from "../core/geometry.mjs";
import { buildTimingProfile } from "../core/timetable.mjs";

export function station(code, name, ja = name) {
  return { code, name, ja };
}

export function line(config) {
  const stations = interpolateStations(config.stations, config.anchors);
  const prepared = {
    directions: [0, 1],
    dwellSeconds: 25,
    runSeconds: 90,
    accuracy: "estimate",
    ...config,
    stations
  };
  prepared.path = buildPath(prepared.stations);
  prepared.timing = buildTimingProfile(prepared);
  return prepared;
}

export function placeNetwork(source, network, offsetX = 0, offsetY = 0) {
  return source.lines.map(item => {
    const stations = item.stations.map(point => ({
      ...point,
      x: point.x + offsetX,
      y: point.y + offsetY
    }));
    return {
      ...item,
      network,
      stations,
      path: buildPath(stations)
    };
  });
}

export function snapNetworkTransfers(lines) {
  const transferPoints = new Map();
  const snapped = lines.map(item => {
    const stations = item.stations.map(point => {
      const key = `${item.network}|${point.name}`;
      const transfer = transferPoints.get(key);
      if (transfer) return { ...point, x: transfer.x, y: transfer.y };
      transferPoints.set(key, point);
      return { ...point };
    });
    return {
      ...item,
      stations,
      path: buildPath(stations)
    };
  });
  return snapped;
}

export const standardSchedule = Object.freeze({
  first: 5 * 60,
  last: 24 * 60 + 15,
  peak: 4,
  offPeak: 6,
  holiday: 6,
  late: 9
});

export function schedule(overrides = {}) {
  return { ...standardSchedule, ...overrides };
}
