let fs = require("fs");

let node_modules = "./node_modules";
let removeFiles = [node_modules, "./package.json", "./package-lock.json"];
let oldPaths = [node_modules + "/css-selector-generator/build/index.js", node_modules + "/css-selector-generator/build/index.js.map"];
let newPaths = ["./content/css-selector-generator.js", "./content/css-selector-generator.js.map"];
function start() {
	try {
		for (let i = 0; i < oldPaths.length; i++) {
			if (fs.existsSync(newPaths[i])) {
				fs.unlinkSync(newPaths[i]);
			}
			fs.renameSync(oldPaths[i], newPaths[i]);
		}
	} catch (e) {
		console.log("something went wrong, error:", e);
	}
	removeFiles.forEach((file) => {
		fs.rmSync(file, { recursive: true, force: true });
	});
}
start();
