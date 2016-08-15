const electron = require("electron");

function forceInteraction(selector, type = "click") {
	const element = document.querySelector(selector);
	if (!element)
		return;

	element[type in element ? type : "click"]();
}

function countBadges() {
	return Array.from(document.querySelectorAll(".badge")).reduce((total, element) => total + (parseInt(element.textContent.trim()) || 0), 0);
}

window.addEventListener("click", () => {
	electron.ipcRenderer.send("count-badges-result", countBadges());
});

electron.ipcRenderer.on("count-badges", event => {
	event.sender.send("count-badges-result", countBadges());
});

electron.ipcRenderer.on("show-preferences", () => {
	forceInteraction("body > #app > .app-sidebar > .pillar > .user-navigation > .settings");
});

electron.ipcRenderer.on("show-profile", () => {
	forceInteraction("body > #app > .app-sidebar > .pillar > .user-navigation > .profile");
});

electron.ipcRenderer.on("log-out", () => {
	window.location = "/signout";
});

electron.ipcRenderer.on("start-group", () => {
	forceInteraction("body > #app > .app-sidebar > #tray > .tray-header .actions > .new-chat [ng-click=\"newGroupDialog()\"]");
});

electron.ipcRenderer.on("start-direct-message", () => {
	forceInteraction("body > #app > .app-sidebar > #tray > .tray-header .actions > .new-chat [ng-click=\"newDMDialog()\"]");
});

electron.ipcRenderer.on("search-chats", () => {
	forceInteraction("body > #app > .app-sidebar > #tray > .list-search > [ng-model=\"search.query\"]", "focus");
});

electron.ipcRenderer.on("close-chat", () => {
	forceInteraction("body > #app > #page > #chats > .chat > .chat-header > .close-chat");
});
