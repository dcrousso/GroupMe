const electron   = require("electron");
const filesystem = require("fs");
const path       = require("path");
const Menu       = require("./modules/Menu");

require("electron-debug")();
require("electron-dl")();

let mainWindow = null;
let isQuitting = false;

const isAlreadyRunning = electron.app.makeSingleInstance(() => {
	if (!mainWindow)
		return;

	if (mainWindow.isMinimized())
		mainWindow.restore();

	mainWindow.show();
});

if (isAlreadyRunning)
	electron.app.quit();

function createMainWindow() {
	const browser = new electron.BrowserWindow({
		width: 900,
		height: 675,
		minWidth: 600,
		minHeight: 450,
		title: electron.app.getName(),
		show: false,
		autoHideMenuBar: true,
		titleBarStyle: "hidden-inset",
		webPreferences: {
			nodeIntegration: false,
			preload: path.join(__dirname, "inject/app.js"),
			webSecurity: false
		}
	});

	browser.on("close", event => {
		if (isQuitting)
			return;

		event.preventDefault();
		electron.app.hide();
	});

	browser.loadURL("https://web.groupme.com/signin", {userAgent: ""});

	browser.webContents.on("dom-ready", () => {
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
});

electron.app.on("before-quit", () => {
	isQuitting = true;
});
