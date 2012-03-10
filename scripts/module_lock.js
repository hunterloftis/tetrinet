#!/usr/bin/env node

var fs = require('fs');

var packages = require('../package.json');

var versions = {};

for (var p in packages.dependencies) {
  var module = require('../node_modules/'+p+'/package.json');
  if (packages.dependencies[p] == 'latest') versions[p] = module.version;
  else versions[p] = packages.dependencies[p];
}

packages.dependencies = versions;

fs.writeFileSync('./package.json', JSON.stringify(packages, null, 4), 'utf-8');