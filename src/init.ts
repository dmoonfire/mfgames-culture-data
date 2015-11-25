/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/strip-json-comments/strip-json-comments.d.ts"/>
/// <reference path="../typings/fs-walk/fs-walk.d.ts"/>
/// <reference path="../typings/fs-extra/fs-extra.d.ts"/>
import * as path from "path";
import stripJsonComments = require("strip-json-comments");
import * as walk from "fs-walk";
import * as fs from "fs-extra";

// Figure out the paths we need to process.
var rootDirectory = path.join(__dirname, "..");
var dataDirectory = path.join(rootDirectory, "data");
var distDirectory = path.join(rootDirectory, "dist");

console.log("root: " + rootDirectory);

// Completely clear out the old dist directory.
if (fs.existsSync(distDirectory)) {
	fs.removeSync(distDirectory);
}

fs.mkdirSync(distDirectory);

// Walk through the input files in the dirctory and copy them over while
// stripping out the comments. We match the directory structure of the input
// files in the dist files.
walk.dirsSync(dataDirectory, function(dir: string, file: string, stat: any) {
	// Combine them together into the directories.
	var distDir = dir.replace(dataDirectory, distDirectory);
	var distDataDir = path.join(distDir, file);

	// Create the directory if it doesn't exist.
	if (!fs.existsSync(distDataDir)) {
		fs.mkdirSync(distDataDir);
	}
});

// Now that we have the directory structure, copy the files over. At the same
// time, we build up a hash of all the entries to create a combined file.
var combined = {};
var index = {};

walk.filesSync(dataDirectory, function(dir: string, file: string, stat: any) {
	// If the file isn't a JSON, skip it.
	if (!file.match(/\.json$/)) { return; }

	// Combine them together into the relevant filenames.
	var distDir = dir.replace(dataDirectory, distDirectory);
	var dataFilename = path.join(dir, file);
	var distFilename = path.join(distDir, file);

	console.log("file", distFilename.replace(distDirectory, "").substr(1));

	// Load the file into memory.
	var fileData = fs.readFileSync(dataFilename).toString();
	var stripData = stripJsonComments(fileData, {whitespace: true});
	var data = JSON.parse(stripData);
	var minData = JSON.stringify(data, null, 0);

	// Write out the two versions.
	fs.writeFileSync(distFilename, stripData);
	fs.writeFileSync(distFilename.replace(".json", ".min.json"), minData);

	// Add the full object to the combined list.
	combined[data.id] = data;

	// Create an index-only version.
	index[data.id] = {
		id: data.id,
		type: data.type,
		version: data.version
	};

	if (data.description) { index[data.id].description = data.description; }
});

// Write out the final files.
var combinedFilename = path.join(distDirectory, "combined.json");
var minCombinedFilename = path.join(distDirectory, "combined.min.json");
var indexFilename = path.join(distDirectory, "index.json");
var minIndexFilename = path.join(distDirectory, "index.min.json");

fs.writeFileSync(combinedFilename, JSON.stringify(combined, null, "\t"));
fs.writeFileSync(minCombinedFilename, JSON.stringify(combined, null, 0));
fs.writeFileSync(indexFilename, JSON.stringify(index, null, "\t"));
fs.writeFileSync(minIndexFilename, JSON.stringify(index, null, 0));
