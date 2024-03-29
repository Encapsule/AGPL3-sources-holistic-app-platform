#!/usr/bin/env node

const arctools = require("@encapsule/arctools");
const repoBuild = require("../../BUILD/holistic");
const packageDB = require("./PACKAGES/");

const holisticPlatformManifest = require("../GENERATOR/holistic-platform-manifest");

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

const packageNameSplit = program.packageName.split("/");
const packageOrg = packageNameSplit[0];
const packageNameTerse = packageNameSplit[1];

function sortObjectKeys(input_) {
    let result = {};
    Object.keys(input_).sort().forEach(function(key_) {
	result[key_] = input_[key_];
    });
    return result;
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
    engines: holisticPlatformManifest.engines,

    repository: {
        type: "git",
        url: "git+https://github.com/Encapsule/holistic.git"
    },
    author: repoBuild.author,
    contributors: repoBuild.contributors,
    license: "MIT",
    bugs: {
        url: "https://github.com/Encapsule/holistic/issues"
    },
    homepage: "https://github.com/Encapsule"
};

// Set/overwrite manifest settings w/declared per-package overrides.
for (var key in packageData.packageManifestOverrides) {
    manifest[key] = packageData.packageManifestOverrides[key];
}

// Serialize the manifest to stdout.
console.log(JSON.stringify(sortObjectKeys(manifest), undefined, 4));
