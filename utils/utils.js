export function secondsToDateTimeString(seconds) {
  return new Date(seconds * 1000).toLocaleString("hu-HU", {
    timeZone: "UTC",
  });
}