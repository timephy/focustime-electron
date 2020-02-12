const Store = require("electron-store");
const store = new Store();

// Times

function getCustomTimes() {
  return store.get("customTimes", []);
}

function addCustomTime(time) {
  const customTimes = getCustomTimes();
  if (!customTimes.includes(time)) {
    customTimes.push(time);
  }
  store.set("customTimes", customTimes);
}

function clearCustomTimes() {
  store.delete("customTimes");
}

// Settings

function getSettings() {
  return {
    // defaults
    showTime: true,
    showSeconds: false,
    acousticFeedback: false,
    startTimerWithLeftClick: false,
    // update object with loaded values
    ...store.get("settings", {})
  };
}

function setSetting(key, val) {
  const settings = getSettings();
  settings[key] = val;
  store.set("settings", settings);
}

function toggleSetting(key) {
  setSetting(key, !getSettings()[key]);
}

exports.getCustomTimes = getCustomTimes;
exports.addCustomTime = addCustomTime;
exports.clearCustomTimes = clearCustomTimes;
exports.getSettings = getSettings;
exports.setSetting = setSetting;
exports.toggleSetting = toggleSetting;
