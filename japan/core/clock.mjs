export const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
export const SERVICE_DAY_CUTOFF_MIN = 3 * 60;

function serviceDayKey(date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}

export function japanNow(nowMs = Date.now()) {
  const shifted = nowMs + JST_OFFSET_MS;
  const date = new Date(shifted);
  const minuteOfDay =
    date.getUTCHours() * 60 +
    date.getUTCMinutes() +
    date.getUTCSeconds() / 60 +
    date.getUTCMilliseconds() / 60000;

  let serviceMinute = minuteOfDay;
  let serviceDow = date.getUTCDay();
  let serviceDate = date;
  if (minuteOfDay < SERVICE_DAY_CUTOFF_MIN) {
    serviceMinute += 1440;
    serviceDow = (serviceDow + 6) % 7;
    serviceDate = new Date(shifted - 86400000);
  }

  return {
    minuteOfDay,
    serviceMinute,
    serviceDayKey: serviceDayKey(serviceDate),
    isHoliday: serviceDow === 0 || serviceDow === 6,
    hh: date.getUTCHours(),
    mm: date.getUTCMinutes(),
    ss: date.getUTCSeconds(),
    dateText: `${date.getUTCMonth() + 1}/${date.getUTCDate()}`,
    dowText: "日一二三四五六"[date.getUTCDay()]
  };
}

export function formatJapanClock(clock) {
  return [clock.hh, clock.mm, clock.ss]
    .map(value => String(value).padStart(2, "0"))
    .join(":");
}
