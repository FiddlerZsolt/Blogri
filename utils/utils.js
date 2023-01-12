export function secondsToDateTimeString(seconds) {
  return new Date(seconds * 1000).toLocaleString("hu-HU", {
    timeZone: "UTC",
  });
}

export function isValidJSON(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}