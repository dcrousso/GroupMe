const electron   = require("electron");
const filesystem = require("fs");
const path       = require("path");

const dataPath = path.join(electron.app.getPath("userData"), "data.json");

function readData() {
	try {
		return JSON.parse(filesystem.readFileSync(dataPath, "utf8"));
	} catch (error) {
	}
	return {};
}

exports.set = (key, val) => {
	const data = readData();
	data[key] = val;
	filesystem.writeFileSync(dataPath, JSON.stringify(data));
};

exports.get = key => readData()[key];
