import { pointOnSegment } from "./geometry.mjs";

export function headwayAt(schedule, minute, isHoliday) {
  if (minute >= 23 * 60) return schedule.late;
  if (isHoliday) return schedule.holiday;
  const hour = minute / 60;
  const peakWindows = schedule.peakWindows || [[7, 9.5], [17, 20]];
  return peakWindows.some(([start, end]) => hour >= start && hour < end)
    ? schedule.peak
    : schedule.offPeak;
}

export function departuresFor(line, isHoliday) {
  const departures = [];
  let minute = line.schedule.first;
  while (minute <= line.schedule.last) {
    departures.push(minute);
    minute += headwayAt(line.schedule, minute, isHoliday);
  }
  return departures;
}

export function buildTimingProfile(line) {
  const runSeconds = line.runSeconds || 85;
  const dwellSeconds = line.dwellSeconds || 25;
  const departureOffsets = [0];
  for (let index = 0; index < line.stations.length - 1; index++) {
    departureOffsets.push(
      departureOffsets[index] +
      runSeconds +
      (index === line.stations.length - 2 ? 0 : dwellSeconds)
    );
  }
  return {
    departureOffsets,
    runSeconds,
    dwellSeconds,
    durationSeconds: departureOffsets.at(-1)
  };
}

export function tripPosition(line, direction, elapsedSeconds) {
  const timing = line.timing;
  if (elapsedSeconds < 0 || elapsedSeconds > timing.durationSeconds) return null;

  const stationCount = line.stations.length;
  const segmentCount = stationCount - 1;
  let logicalSegment = 0;
  while (
    logicalSegment < segmentCount - 1 &&
    elapsedSeconds >= timing.departureOffsets[logicalSegment + 1]
  ) {
    logicalSegment++;
  }

  const forwardSegment = direction === 0
    ? logicalSegment
    : segmentCount - 1 - logicalSegment;
  const startIndex = direction === 0 ? forwardSegment : forwardSegment + 1;
  const endIndex = direction === 0 ? forwardSegment + 1 : forwardSegment;
  const inSegment = elapsedSeconds - timing.departureOffsets[logicalSegment];
  const movingRatio = Math.min(1, inSegment / timing.runSeconds);
  const atStation = inSegment >= timing.runSeconds;
  const point = pointOnSegment(
    line.stations[startIndex],
    line.stations[endIndex],
    movingRatio,
    false
  );

  if (atStation && logicalSegment < segmentCount - 1) {
    const nextForwardSegment = direction === 0
      ? forwardSegment + 1
      : forwardSegment - 1;
    const nextStart = direction === 0 ? nextForwardSegment : nextForwardSegment + 1;
    const nextEnd = direction === 0 ? nextForwardSegment + 1 : nextForwardSegment;
    point.hx = line.stations[nextEnd].x - line.stations[nextStart].x;
    point.hy = line.stations[nextEnd].y - line.stations[nextStart].y;
  }

  return {
    ...point,
    atStation,
    nextStation: line.stations[endIndex],
    destination: direction === 0 ? line.stations.at(-1) : line.stations[0],
    secondsToNext: atStation ? 0 : timing.runSeconds - inSegment
  };
}

export function activeTrains(lines, clock, visibleIds) {
  const trains = [];
  for (const line of lines) {
    if (!visibleIds.has(line.id)) continue;
    const directions = line.directions || [0, 1];
    const departures = departuresFor(line, clock.isHoliday);
    for (const direction of directions) {
      for (const departure of departures) {
        if (clock.serviceMinute < departure) break;
        const elapsed = (clock.serviceMinute - departure) * 60;
        if (elapsed > line.timing.durationSeconds) continue;
        const position = tripPosition(line, direction, elapsed);
        if (position) {
          trains.push({
            line,
            direction,
            departure,
            serviceDayKey: clock.serviceDayKey,
            position
          });
        }
      }
    }
  }
  return trains;
}
