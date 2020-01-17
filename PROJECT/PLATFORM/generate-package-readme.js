#!/usr/bin/env node

const arctools = require('@encapsule/arctools');
const path = require('path');
const fs = require('fs');

// Information about the most recent build (contains no information specific to a package).
const repoBuild = require('../../BUILD/holistic');
const holisticPackages = require("../../BUILD/holistic-rtl-packages");
const packageDB = require('./PACKAGES/');

const program = arctools.commander;

program
    .name('generate-package-readme')
    .description('Generates README.md file from repo build and package DB metadata.')
    .version(repoBuild.version)
    .option('--packageDir <packageDir>', 'Use <packageDir> as root directory of package.')
    .parse(process.argv);

if (!program.packageDir) {
    console.error("Missing --packageDir option value.");
    process.exit(1);
}

if (!fs.existsSync(program.packageDir)) {
    console.error("Invalid --packageDir option value. Directory '" + program.packageDir + "' does not exist.");
    process.exit(1);
}

const targetManifestPath = path.join(program.packageDir, "package.json");
const targetReadmePath = path.join(program.packageDir, "README.md");

if (!fs.existsSync(targetManifestPath)) {
    console.error("Cannot locate target package.json at path '" + targetManifestPath + "'.");
    process.exit(1);
}

const targetManifestJSON = fs.readFileSync(targetManifestPath).toString('utf-8');

var targetManifest = {};

try {
    targetManifest = JSON.parse(targetManifestJSON);
} catch (exception_) {
    console.error("Unable to deserialize target manifest JSON: " + exception_.stack);
    console.error("JSON string obtained from file '" + targetManifestPath + "'.");
    process.exit(1);
}

const copyright = targetManifest.contributors[0];
copyright.year = new Date(targetManifest.buildTime * 1000).getFullYear();

// We're interested in the README.md content declared in the package database.
const packageData = packageDB[targetManifest.name];
if (!packageData) {
    console.error("The package '" + targetManifest.name + "' is not registered in the package DB.");
    process.exit(1);
}

const packageNameSplit = targetManifest.name.split("/");
const packageOrg = packageNameSplit[0];
const packageNameTerse = packageNameSplit[1];

function insertHeader(level_, text_) {
    switch (level_) {
    case 1:
	markdown.push("# ![@encapsule/holistic](ASSETS/encapsule-holistic-48x48.png \"@encapsule/holistic\") " + text_);
	break;
    case 2:
	markdown.push("## ![@encapsule/holistic](ASSETS/encapsule-holistic-32x32.png \"@encapsule/holistic\") " + text_);
	break;
    case 3:
	markdown.push("### ![@encapsule/holistic](ASSETS/encapsule-holistic-24x24.png \"@encapsule/holistic\") " + text_);
	break;
    case 4:
	markdown.push("#### ![@encapsule/holistic](ASSETS/encapsule-holistic-16x16.png \"@encapsule/holistic\") " + text_);
	break;
    default:
	throw new Error("Unrecognized header level " + level_);
    }
}

// ----------------------------------------------------------------

// the injectReadmeSection function processes sectionDescriptor objects w/heading markdown string & markdown array properties.
function injectReadmeSection(sectionDescriptor_) {
    if (sectionDescriptor_.heading) {
        markdown.push(sectionDescriptor_.heading);
    }
    if (sectionDescriptor_.markdown.length) {
        for (var i = 0 ; i < sectionDescriptor_.markdown.length ; i++) {
            markdown.push(sectionDescriptor_.markdown[i]);
        }
    }
    return;
} // function injectReadmeSection

// Start of the markdown document...
// https://github.com/Encapsule/holistic/tree/v0.0.32-jeunelanding
var markdown = [];

// ENCAPULE PROJECT HEADING 1
markdown.push("# [![Encapsule Project](ASSETS/blue-burst-encapsule.io-icon-72x72.png \"Encapsule Project\")](https://encapsule.io) Encapsule Project");

markdown.push([
    "**",
    "[ [Homepage](https://encapsule.io \"Encapsule Project Homepage...\") ] ",
    "[ [GitHub](https://github.com/Encapsule \"Encapsule Project GitHub...\") ] ",
    "[ [Twitter](https://twitter.com/Encapsule \"Encapsule Project Twitter...\") ] ",
    "[ [Discussion](https://groups.google.com/a/encapsule.io/forum/#!forum/holistic-app-platform-discussion-group \"Holistic app platform discussion group...\") ]",
    "**"
].join(""));

// PACKAGE HEADING 1
insertHeader(1, targetManifest.name + " v" + targetManifest.version + " " + targetManifest.codename);

// PACKAGE METADATA PRE
markdown.push("```\n" +
              "Package: " + targetManifest.name + " v" + targetManifest.version + " \"" + targetManifest.codename + "\" build ID \"" + targetManifest.buildID + "\"\n" +
              "Sources: Encapsule/holistic-master#" + targetManifest.buildSource + "\n" +
              "Purpose: " + packageData.packageType + " (" + (packageData.browserSafe?"Node.js + modern browsers (via package bundler)":"Node.js") + ")\n" +
              "Created: " + repoBuild.buildDateISO + "\n" +
              "License: " + targetManifest.license + "\n" +
              "```");

// PACKAGE OVERVIEW HEADING 2
insertHeader(2, "Overview");
// markdown.push("## [![@encapsule/holistic](ASSETS/encapsule-holistic-48x48.png \"@encapsule/holistic\")](https://encapsule.io/docs/holistic) Overview");
markdown.push(targetManifest.description);
if (packageData.packageReadme.overviewDescriptor) {
    injectReadmeSection(packageData.packageReadme.overviewDescriptor);
}

// PACKAGE DISTRIBUTION HEADING 2
insertHeader(2, "Distribution");
if (targetManifest.name !== "@encapsule/holistic") {
    markdown.push("This package is an unpublished _pseudo-package_ that is included in the @encapsule/holistic v" + targetManifest.version + " " + targetManifest.codename + " package for distribution via the `appgen` utility.");
} else {
    markdown.push("This package is not currently published to npmjs.com and is only available from [@Encapsule](https://github.com/Encapsule) on GitHub.");
    markdown.push("```\n" +
		  "$ cd ~/Downloads\n" +
		  "$ git clone git@github.com:Encapsule/holistic.git\n" +
		  "```");
}

// PACKAGE INSTALLATION HEADING 2
insertHeader(2, "Installation");
switch (packageData.packageType) {
case 'library':
    injectReadmeSection({
        // heading: "## Installation",
        markdown: [
            "This package's contained library functionality is intended for use in derived projects.",
            "For example:",
            "1. Create simple test project, declare a dependency and install `" + targetManifest.name + "` package:",
            "```\n$ mkdir testProject && cd testProject\n$ yarn init\n$ yarn add " + targetManifest.name + " --dev\n```",
            "2. Create a simple script `index.js`:",
            "```JavaScript\nconst " + packageNameTerse + " = require('" + targetManifest.name + "');\nconsole.log(JSON.stringify(" + packageNameTerse + ".__meta));\n/* ... your derived code here ... */\n```"
        ]
    });
    break;
case 'tools':
    injectReadmeSection({
        // heading: "## Installation",
        markdown: [
            "The `" + targetManifest.name + "` "  + packageData.packageType + " package is typically installed globally.",
            "```\n$ npm install --global " + targetManifest.name + "\n```"
        ]
    });
    break;
default:
    throw new Error("Unknown packageType declaration value '" + packageData.packageType + "'!");
}

if (packageData.packageReadme.usageDescriptor) {
    injectReadmeSection(packageData.packageReadme.usageDescriptor);
}



// PACKAGE DOCUMENTATION SECTION 2
if (packageData.packageReadme.bodySections && packageData.packageReadme.bodySections.length) {
    insertHeader(2, "Documentation");
    while (packageData.packageReadme.bodySections.length) {
	injectReadmeSection(packageData.packageReadme.bodySections.shift());
    }
}


if (targetManifest.name === "@encapsule/holistic") {

    insertHeader(3, "Holistic Platform RTL's");
    markdown.push("The \"Holistic App Platform\" is a collection of runtime library packages that are used to build full-stack web applications and services using [Node.js](https://nodejs.org) and [React](https://react.org).");


    holisticPackages.forEach(function(packageName_) {
	insertHeader(4, packageName_);
	markdown.push(packageDB[packageName_].packageManifestOverrides.description);
	markdown.push("[README](PACKAGES/" + packageName_.split("/")[1] + "/README.md)");
    });

}

// PACKAGE ISSUES HEADING 2
insertHeader(2, "Issues");
markdown.push("Please post bug reports to one of the follow issue queues depending on topic:");
markdown.push("- @encapsule/holistic [GitHub Issues](https://github.com/Encapsule/holistic/issues) - Holistic platform RTL + appgen issues.");
markdown.push("- @encapsule/arccore [GitHub Issues](https://github.com/Encapsule/ARCcore/issues) - Core data RTL issues.");
markdown.push("- @encapsule/arctools [GitHub Issue](https://github.com/Encapsule/ARCtools/issues) - Core data tools and RTL issues.");

// PAGE FOOTER SECTION
markdown.push("<hr>");
markdown.push("[![Encapsule Project](ASSETS/blue-burst-encapsule.io-icon-72x72.png \"Encapsule Project\")](https://encapsule.io)");
markdown.push("Published under [" + targetManifest.license + "](LICENSE) license by [Encapsule Project](https://encapsule.io)");
markdown.push("Please follow [@Encapsule](https://twitter.com/encapsule) on Twitter for news and updates.");
markdown.push("Copyright &copy; " + copyright.year + " [" + copyright.name + "](" + copyright.url + ") Seattle, Washington USA");
markdown.push("<hr>");

////
// Final doc preparation
//
const mddoc = markdown.join('\n\n');

////
// Write the README.md document to filesystem.
//
const packageReadmeFilename = path.join(program.packageDir, 'README.md');
fs.writeFileSync(targetReadmePath, mddoc);
console.log("Wrote '" + targetReadmePath + "':");

process.exit(0);

