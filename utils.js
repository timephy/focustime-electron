const zeroPad = (num, places) => String(num).padStart(places, "0");

function secondsToStringMedium(secs) {
  const hours = parseInt(secs / 60 / 60);
  const minutes = parseInt(secs / 60) % 60;
  const seconds = secs % 60;

  const hoursStr = hours != 0 ? `${hours} h ` : "";
  const minutesStr = minutes != 0 ? `${minutes} min` : "";
  const secondsStr = seconds != 0 ? `${seconds} s` : "";

  return hoursStr + minutesStr + secondsStr;
}

function secondsToStringShort(secs, showSeconds = false) {
  const hours = parseInt(secs / 60 / 60);
  const minutes = parseInt(secs / 60) % 60;
  const seconds = secs % 60;

  const str = zeroPad(hours, 2) + ":" + zeroPad(minutes, 2);
  const secondsStr = ":" + zeroPad(seconds, 2);

  return showSeconds ? str + secondsStr : str;
}

exports.minutesToString = secondsToStringMedium;
exports.secondsToStringShort = secondsToStringShort;
