const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  Notification,
  dialog
} = require("electron");
const path = require("path");
const utils = require(path.resolve(__dirname, "./utils.js"));
const store = require(path.resolve(__dirname, "./store.js"));

const print = console.log;

// Hide app from dock
app.dock.hide();

// SETTINGS

const times = [5, 10, 15, 20, 30, 45, 60].map(s => s * 60);

let tray = null;
// let aboutWin = null;

let state = "idle";
let stateTime = null;
let stateTimeout = null;
let stateInterval = null;

// DISPLAY

function setMenuTitle(title) {
  if (title) {
    title = " " + title;
  }
  tray.setTitle(title);
}

function updateMenuTitle() {
  if (state == "idle") {
    tray.setImage(path.join(__dirname, "images/symbolTemplate.png"));
    setMenuTitle("");
  } else if (state == "run") {
    tray.setImage(path.join(__dirname, "images/symbol-playTemplate.png"));
    setMenuTitle(
      utils.secondsToStringShort(
        parseInt((stateTime - new Date().getTime()) / 1000 + 1),
        store.getSettings().showSeconds
      )
    );
  } else if (state == "pause") {
    tray.setImage(path.join(__dirname, "images/symbol-pauseTemplate.png"));
    setMenuTitle(
      utils.secondsToStringShort(
        parseInt(stateTime / 1000),
        store.getSettings().showSeconds
      )
    );
  }
}

const seperator = { type: "separator" };
function updateMenu() {
  const customTimes = store.getCustomTimes();
  const settings = store.getSettings();

  const contextMenu = Menu.buildFromTemplate([
    {
      label: state == "pause" ? "Resume" : "Pause",
      enabled: state != "idle",
      click: state == "pause" ? resume : pause
    },
    { label: "Cancel", enabled: state != "idle", click: cancel },
    seperator,
    ...times.map(t => ({
      label: utils.minutesToString(t),

      click: () => clickStart(t)
    })),
    // seperator,
    // {
    //   label: "Custom Times",
    //   visible: customTimes.length != 0,
    //   enabled: false
    // },
    // ...customTimes.map(t => ({
    //   label: utils.minutesToString(t),
    //   click: () => clickStart(t)
    // })),
    // seperator,
    // { label: "Add Time", click: clickCustomTime },
    // {
    //   label: "Clear Custom Times",
    //   enabled: customTimes.length != 0,
    //   click: clickClearCustomTimes
    // },
    seperator,
    {
      label: "Preferences",
      submenu: [
        // {
        //   label: "Show Time in System Tray",
        //   type: "checkbox",
        //   checked: settings.showTime,
        //   click: () => toggleSetting("showTime")
        // },
        {
          label: "Show Seconds in System Tray",
          type: "checkbox",
          checked: settings.showSeconds,
          click: () => toggleSetting("showSeconds")
        }
        // seperator,
        // {
        //   label: "Acoustic feedback",
        //   type: "checkbox",
        //   checked: settings.acousticFeedback,
        //   click: () => toggleSetting("acousticFeedback")
        // }
        // {
        //   label: "Start timer with left-click",
        //   type: "checkbox",
        //   checked: settings.startWithLeftClick,
        //   click: () => toggleSetting("startWithLeftClick")
        // }
      ]
    },
    { label: "About", click: clickAbout },
    seperator,
    // { role: "close" },
    { label: "Quit", click: app.quit }
  ]);

  tray.setContextMenu(contextMenu);
}

function confirmCancel() {
  const res = dialog.showMessageBoxSync(null, {
    type: "question",
    buttons: ["Yes", "No"],
    defaultId: 0,
    title: "Question",
    message: "Cancel running timer",
    detail: "Do you want to cancel the current timer and start a new one?"
  });
  return res == 0;
}

function toggleSetting(key) {
  store.toggleSetting(key);
  updateMenu();
  updateMenuTitle();
}

function clickAbout() {
  print("clickAbout");
  // aboutWin.show();
  const aboutWin = new BrowserWindow({
    width: 400,
    height: 500,
    // webPreferences: {
    //   nodeIntegration: true
    // },
    titleBarStyle: "hiddenInset",
    show: false,
    minimizable: false,
    maximizable: false,
    backgroundColor: "#3c3c3c"
    // frame: false
  });
  aboutWin.loadFile("about.html");
  aboutWin.once("ready-to-show", () => {
    aboutWin.show();
  });
}

function clickCustomTime() {
  print("clickCustomTime");
  store.addCustomTime(5);
  store.addCustomTime(10);
  store.addCustomTime(30);
  store.addCustomTime(45);
  updateMenu();
}

function clickClearCustomTimes() {
  print("clickClearCustomTimes");
  store.clearCustomTimes();
  updateMenu();
}

function clickStart(seconds) {
  if (state != "idle") {
    if (confirmCancel()) cancel();
    else return;
  }
  start(seconds * 1000);
}

function start(ms) {
  print("start", ms);

  state = "run";
  stateTime = ms + new Date().getTime();

  stateInterval = setInterval(() => {
    // updateMenu();
    updateMenuTitle();
  }, 1000);
  stateTimeout = setTimeout(() => {
    let myNotification = new Notification({
      title: "Time's up!",
      body: "Take a short break, then get back to work."
    });
    myNotification.show();
    cancel();
  }, ms);

  updateMenu();
  updateMenuTitle();
}

function resume() {
  print("resume");

  start(stateTime);
}

function pause() {
  print("pause");

  state = "pause";
  stateTime -= new Date().getTime();
  clearTimeout(stateTimeout);
  stateTimeout = null;
  clearInterval(stateInterval);
  stateInterval = null;

  updateMenu();
  updateMenuTitle();
}

function cancel() {
  print("cancel");

  clearTimeout(stateTimeout);
  stateTimeout = null;
  clearInterval(stateInterval);
  stateInterval = null;

  state = "idle";

  updateMenu();
  updateMenuTitle();
}

app.on("ready", () => {
  tray = new Tray(path.join(__dirname, "images/symbolTemplate.png"));
  tray.setToolTip("Focustime");

  updateMenu();
  updateMenuTitle();
});

app.on("window-all-closed", () => {
  print("window-all-closed");
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== "darwin") {
  // app.quit();
  // }
});
