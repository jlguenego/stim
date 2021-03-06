#!/usr/bin/env node
//	Create the sitemap.txt, containing all the urls of the application


String.prototype.endsWith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
var fs = require('fs');

var seoDir = __dirname + '/../app/seo_snapshots/';
var seoFile = seoDir + '/sitemap.txt';
var dataPath = __dirname + '/../app/data';
var array = [ "products", "services", "informations" ];
var sitemapJsonFile = __dirname + '/../app/sitemap.json'
var sitemapJson = {};

function main() {
	if (!fs.existsSync(seoDir)) {
		fs.mkdirSync(seoDir);
	}
	fs.writeFileSync(seoFile, '');

	// Write index.html
	writeUrl('');
	writeJson('', {path: '', title: 'Accueil', file: true}, sitemapJson);

	var homeJsonChildren = sitemapJson['Accueil'].children;

	for (var i = 0; i < array.length; i++) {
		var topJson = require(dataPath + '/' + array[i] + '.json');

		writeUrl(topJson.path);
		writeJson('', topJson, sitemapJson['Accueil'].children);

		topJson.content.forEach(function(item) {
			handleItem(topJson.path, item, homeJsonChildren[topJson.title].children);
		});

	}

	console.log('Writing JSON file...');
	fs.writeFileSync(sitemapJsonFile, JSON.stringify(sitemapJson, null, '\t'));
}

function writeUrl(path) {
	var slash = '/';
	if (process.env.baseUrlExtraction.endsWith('/') || path == '') {
		slash = '';
	}
	var url = process.env.baseUrlExtraction + slash + path;
	console.log('Writing: ' + url);
	fs.appendFileSync(seoFile, url + '\n');
}

function writeJson(prefix, item, json) {
	var path = '/' + prefix + '/' + item.path;
	if (prefix == '') {
		path = '/' + item.path;
	}

	if (!item.file && !item.content) {
		json[item.title] = path;
		return;
	}

	json[item.title] = {
		url: path,
		children: {}
	}
}

function handleItem(prefix, item, parentJson) {
	writeUrl(prefix + '/' + item.path)
	writeJson(prefix, item, parentJson);
}

main();