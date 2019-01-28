#!/usr/bin/env node

const arctools = require('arctools');

const repoBuild = require('../BUILD/holistic');

const packageDB = require('./PACKAGES/');

const program = arctools.commander;

program
    .name('generate_package_manifest')
    .description('Generates package.json file from repo build and package DB metadata.')
    .version(repoBuild.version)
    .option('--packageName <packageName>', 'Use <packageName> to select package database entry.')
    .parse(process.argv);

if (!program.packageName) {
    console.error("Missing --packageName option value.");
    process.exit(1);
}

const packageData = packageDB[program.packageName];

if (!packageData) {
    console.error('Invalid --packageName option value \'' + program.packageName + '\'.');
    process.exit(1);
}

// ================================================================
// package.json generation

var manifest = {
    name: program.packageName,
    version: repoBuild.version,
    codename: repoBuild.codename,
    buildID: repoBuild.buildID,
    buildTime: repoBuild.buildTime,
    buildSource: repoBuild.buildSource,
    repository: {
        type: "git",
        url: "git+https://github.com/Encapsule/" + program.packageName + ".git",
    },
    author: repoBuild.author,
    contributors: repoBuild.contributors,
    license: "MIT",
    bugs: {
        url: "https://github.com/Encapsule/" + program.packageName + "/issues"
    },
    homepage: "https://github.com/Encapsule/" + program.packageName + "#readme",
};

// Set/overwrite manifest settings w/declared per-package overrides.
for (var key in packageData.packageManifestOverrides) {
    manifest[key] = packageData.packageManifestOverrides[key];
}

// Serialize the manifest to stdout.
console.log(JSON.stringify(manifest, undefined, 4));
