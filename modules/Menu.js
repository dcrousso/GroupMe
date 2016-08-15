const electron = require("electron");
const os       = require("os");

function getWindow(callback) {
	const browser = electron.BrowserWindow.getFocusedWindow() || electron.BrowserWindow.getAllWindows()[0];
	if (!browser)
		return;

	browser.restore();
	if (typeof callback === "function")
		callback(browser);
}

function sendAction(action) {
	getWindow(browser => {
		browser.webContents.send(action);
	});
}

module.exports = electron.Menu.buildFromTemplate([
	{
		label: electron.app.getName(),
		submenu: [
			{
				label: `About ${electron.app.getName()}`,
				click() {
					electron.shell.openExternal("https://groupme.com/about");
				}
			},
			{
				type: "separator"
			},
			{
				label: "Preferences...",
				accelerator: "Cmd+,",
				click() {
					sendAction("show-preferences");
				}
			},
			{
				label: "View Profile",
				click() {
					sendAction("show-profile");
				}
			},
			{
				label: "Log Out",
				click() {
					sendAction("log-out");
				}
			},
			{
				type: "separator"
			},
			{
				label: "Services",
				role: "services",
				submenu: []
			},
			{
				type: "separator"
			},
			{
				label: `Hide ${electron.app.getName()}`,
				accelerator: "Cmd+H",
				role: "hide"
			},
			{
				label: "Hide Others",
				accelerator: "Shift+Cmd+H",
				role: "hideothers"
			},
			{
				label: "Show All",
				role: "unhide"
			},
			{
				type: "separator"
			},
			{
				label: `Quit ${electron.app.getName()}`,
				accelerator: "Cmd+Q",
				click() {
					electron.app.quit();
				}
			}
		]
	},
	{
		label: "Conversation",
		submenu: [
			{
				label: "Start Group",
				accelerator: "CmdOrCtrl+N",
				click() {
					sendAction("start-group");
				}
			},
			{
				label: "Start Direct Message",
				accelerator: "Shift+CmdOrCtrl+N",
				click() {
					sendAction("start-direct-message");
				}
			},
			{
				type: "separator"
			},
			{
				label: "Search",
				accelerator: "CmdOrCtrl+F",
				click() {
					sendAction("search-chats");
				}
			},
			{
				label: "Close",
				accelerator: "CmdOrCtrl+W",
				click() {
					sendAction("close-chat");
				}
			}
		]
	},
	{
		label: "Edit",
		submenu: [
			{
				label: "Undo",
				accelerator: "CmdOrCtrl+Z",
				role: "undo"
			},
			{
				label: "Redo",
				accelerator: "Shift+CmdOrCtrl+Z",
				role: "redo"
			},
			{
				type: "separator"
			},
			{
				label: "Copy",
				accelerator: "CmdOrCtrl+C",
				role: "copy"
			},
			{
				label: "Cut",
				accelerator: "CmdOrCtrl+X",
				role: "cut"
			},
			{
				label: "Paste",
				accelerator: "CmdOrCtrl+V",
				role: "paste"
			},
			{
				label: "Select All",
				accelerator: "CmdOrCtrl+A",
				role: "selectall"
			}
		]
	},
	{
		label: "Window",
		role: "window",
		submenu: [
			{
				label: "Minimize",
				accelerator: "CmdOrCtrl+M",
				role: "minimize"
			},
			{
				label: "Zoom",
				role: "zoom"
			},
			{
				label: "Toggle Full Screen",
				accelerator: "Ctrl+Cmd+F",
				click() {
					getWindow(browser => {
						browser.setFullScreen(!browser.isFullScreen());
					});
				}
			},
			{
				label: "Close",
				accelerator: "Shift+CmdOrCtrl+W",
				role: "close"
			},
			{
				type: "separator"
			},
			{
				label: "Bring All to Front",
				role: "front"
			}
		]
	},
	{
		label: "Help",
		role: "help",
		submenu: [
			{
				label: `${electron.app.getName()} Website`,
				click() {
					electron.shell.openExternal("https://groupme.com/");
				}
			},
			{
				label: "Report an Issue...",
				click() {
					const body = `\n\n${electron.app.getName()} ${electron.app.getVersion()}\n${process.platform} ${process.arch} ${os.release()}`;
					electron.shell.openExternal(`https://github.com/dcrousso/${electron.app.getName()}/issues/new?body=${encodeURIComponent(body)}`);
				}
			}
		]
	}
]);
