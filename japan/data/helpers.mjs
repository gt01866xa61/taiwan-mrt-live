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
