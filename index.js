const electron   = require("electron");
const filesystem = require("fs");
const path       = require("path");
const Menu       = require("./modules/Menu");
const Storage    = require("./modules/Storage");

// require("electron-debug");
require("electron-dl")();

let mainWindow = null;
let isQuitting = false;

if (!electron.app.requestSingleInstanceLock()) {
	electron.app.quit();
	return;
}

electron.app.on("second-instance", () => {
	if (!mainWindow)
		return;

	if (mainWindow.isMinimized())
		mainWindow.restore();

	mainWindow.show();
});

electron.ipcMain.on("count-badges-result", (event, data) => {
	if (typeof electron.app.setBadgeCount === "function")
		electron.app.setBadgeCount(isNaN(data) ? 0 : data);
});

function createMainWindow() {
	const lastWindowState = Storage.get("lastWindowState") || {width: 900, height: 675};

	const browser = new electron.BrowserWindow({
		width: lastWindowState.width,
		height: lastWindowState.height,
		x: lastWindowState.x,
		y: lastWindowState.y,
		minWidth: 600,
		minHeight: 450,
		title: electron.app.getName(),
		show: false,
		autoHideMenuBar: true,
		titleBarStyle: "hiddenInset",
		webPreferences: {
			nodeIntegration: false,
			preload: path.join(__dirname, "inject/app.js")
		}
	});

	browser.on("page-title-updated", (event, title) => {
		if (!title.includes("New message"))
			return;

		browser.webContents.send("count-badges");
	});

	browser.on("close", event => {
		if (isQuitting)
			return;

		event.preventDefault();

		if (process.platform === "darwin")
			electron.app.hide();
		else
			electron.app.quit();
	});

	browser.loadURL("https://web.groupme.com/signin", {userAgent: "Chrome"});

	browser.webContents.on("dom-ready", () => {
		browser.webContents.insertCSS(filesystem.readFileSync(path.join(__dirname, "inject/app.css"), "utf8"));
		browser.show();
	});

	browser.webContents.on("new-window", (event, url) => {
		event.preventDefault();
		electron.shell.openExternal(url);
	});

	return browser;
}

electron.app.on("ready", () => {
	electron.Menu.setApplicationMenu(Menu);

	if (!mainWindow)
		mainWindow = createMainWindow();
});

electron.app.on("activate", () => {
	if (!mainWindow)
		mainWindow = createMainWindow();

	mainWindow.show();
	mainWindow.send("count-badges");
});

electron.app.on("before-quit", () => {
	isQuitting = true;

	if (mainWindow && !mainWindow.isFullScreen())
		Storage.set("lastWindowState", mainWindow.getBounds());
});
