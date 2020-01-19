#!/usr/bin/env node

// ▴	9652	25B4	 	BLACK UP-POINTING SMALL TRIANGLE
// ▸	9656	25B8	 	BLACK RIGHT-POINTING SMALL TRIANGLE
// ▾	9662	25BE	 	BLACK DOWN-POINTING SMALL TRIANGLE
// ◂	9666	25C2	 	BLACK LEFT-POINTING SMALL TRIANGLE
// <p>I will display &#9666;</p>
// <p>I will display &#x25C2;</p>


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
	markdown.push("# ![](ASSETS/encapsule-holistic-48x48.png)&nbsp;" + text_);
	break;
    case 2:
	markdown.push("## ![](ASSETS/encapsule-holistic-32x32.png)&nbsp;" + text_);
	break;
    case 3:
	markdown.push("### ![](ASSETS/encapsule-holistic-24x24.png)&nbsp;" + text_);
	break;
    case 4:
	markdown.push("#### ![](ASSETS/encapsule-holistic-16x16.png)&nbsp;" + text_);
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

// ****************************************************************
// ****************************************************************
// ****************************************************************
// ****************************************************************
// ****************************************************************

// ENCAPULE PROJECT HEADING 1
markdown.push("# [![](ASSETS/blue-burst-encapsule.io-icon-72x72.png \"Encapsule Project Homepage\")](https://encapsule.io)&nbsp;Encapsule Project");

markdown.push([
    "[ [**GitHub**](https://github.com/Encapsule \"Encapsule Project GitHub...\") ] ",
    "[ [**Discussion**](https://groups.google.com/a/encapsule.io/forum/#!forum/holistic-app-platform-discussion-group \"Holistic app platform discussion group...\") ] ",
    "[ [**Homepage**](https://encapsule.io \"Encapsule Project Homepage...\") ] ",
    "[ [**Twitter**](https://twitter.com/Encapsule \"Encapsule Project Twitter...\") ]",
].join(""));

markdown.push("Encapsule Project is MIT-licensed libs & tools for building full-stack Node.js/HTML5 apps & services w/React based on System in Cloud (SiC) architecture.");

// PACKAGE HEADING 1

if (targetManifest.name === "@encapsule/holistic") {
    insertHeader(1, "Holistic App Platform");
    markdown.push("## &#x029C9; " + targetManifest.name + " v" + targetManifest.version + " " + targetManifest.codename + " &#x029C9;");
    markdown.push("[ [**appgen**](#appgen-utility) ] [ [**Holistic Platform Runtime**](#holistic-platform-runtime) ]");
} else {
    insertHeader(1, "[Holistic App Platform](../../README.md#encapsule-project \"Back to the Holistic App Platform README...\") &bull; " + packageNameTerse);
    let packageLinks = [];
    holisticPackages.forEach(function (packageName_) {
	let terseName = packageName_.split("/")[1];
	if (packageName_ === targetManifest.name) {
	    // Current package
	    packageLinks.push("**" + terseName + "**");
	} else {
	    // Another package
	    packageLinks.push("[" + terseName + "](../" + terseName + "/README.md#encapsule-project \"Jump to " + terseName + " README...\")");
	}
    });
    markdown.push("[**RTL's**](../../README.md#holistic-platform-runtime \"Jump back to the RTL index...\")**::** [ " + packageLinks.join(" &bull; ") + " ]");
    markdown.push("## &#x25F0; " + targetManifest.name + " v" + targetManifest.version + " " + targetManifest.codename + " &#x25F0;");

}

// PACKAGE METADATA PRE
if (targetManifest.name === "@encapsule/holistic") {
    markdown.push("**" + packageNameTerse + "** platform distribution package:");
} else {
    markdown.push("**" + packageNameTerse + "** runtime library (RTL) package:");
}

markdown.push("```\n" +
              "Package: " + targetManifest.name + " v" + targetManifest.version + " \"" + targetManifest.codename + "\" build ID \"" + targetManifest.buildID + "\"\n" +
              "Sources: Encapsule/holistic-master#" + targetManifest.buildSource + "\n" +
              "Purpose: " + packageData.packageType + " (" + (packageData.browserSafe?"Node.js + modern browsers (via package bundler)":"Node.js") + ")\n" +
              "Created: " + repoBuild.buildDateISO + "\n" +
              "License: " + targetManifest.license + "\n" +
              "```");


// PACKAGE DESCRIPTION HEADING 2
insertHeader(2, "Description");
markdown.push(targetManifest.description);

// PACKAGE OVERVIEW HEADING 2
if (packageData.packageReadme.overviewDescriptor) {
    insertHeader(2, "Overview");
    injectReadmeSection(packageData.packageReadme.overviewDescriptor);
}

// PACKAGE DISTRIBUTION HEADING 2
insertHeader(2, "Distribution");


if (targetManifest.name === "@encapsule/holistic") {

    // HOLISTIC DISTRIBUTION

    markdown.push("The @encapsule/holistic package (this package) is not published.");
    markdown.push("It is only available from the [@Encapsule](https://github.com/Encapsule) GitHub.");

    markdown.push("To get started you need to have a small collection of core tools installed on your host OS:");

    markdown.push("- [git](https://git-scm.com/)");
    markdown.push("- [Node.js](https://nodejs.org)");
    markdown.push("- [yarn](https://yarnpkg.com)");

    markdown.push("Presuming you already have these installed, clone the @encapsule/holistic git repo:");
    
    markdown.push("```\n" +
		  "$ cd ~/code # or, wherever...\n" +
		  "$ git clone git@github.com:Encapsule/holistic.git\n" +
		  "```");

    markdown.push("You will generally only need to clone the repo once.");
    markdown.push("Subsequently, retrieve updates via `git fetch` and `git pull`.");

} else {

    // PSEUDO-PACKAGE DISTRIBUTION

    markdown.push("The " + targetManifest.name + " package is runtime library (RTL) package bundled in the @encapsule/holistic package for distribution via the `appgen` utility.");

    markdown.push("Once you have run `appgen` on your derived app/service git repo, `" + targetManifest.name + " ` will be registered and available for [use](#usage) in your app/service implementation.");
    
    markdown.push("For more information, see: [**appgen**](../../README.md#appgen-utility)");
}

if (targetManifest.name === "@encapsule/holistic") {
    
    // PACKAGE INSTALLATION HEADING 2
    insertHeader(2, "Installation");

    markdown.push("Once you have a local clone of the @encapsule/holistic git repo, you will need to ensure you're using the latest release version, and reinstall its dependencies before using `appgen` to update your derived app/service repo's.");

    markdown.push("```\n" +
		  "$ cd ~/code/holistic\n" +
		  "$ git pull origin master\n" +
		  "$ yarn install\n" +
		  "```");

    markdown.push("By convention, the latest supported release of @encapsule/holistic is available on the #master branch.");
    markdown.push("Other topic branches are used for testing updates prior to general release.");
    markdown.push("Please be aware of the disconnect between the state of your project's `node_modules` directory which is managed by `yarn` and the state of critical `package.json` and `yarn.lock` files that is managed by `git`.");
    markdown.push("Always `yarn install` whenever you pull updates from GitHub. And, whenever switching topic branches. This is currently the only way to ensure that you have the expected/correct package dependencies installed.");


} else {

    // PACKAGE USEAGE HEADING 2
    insertHeader(2, "Usage");

    markdown.push("In the context of your derived app/service repo, `appgen` will install and register `" + targetManifest.name + "` by _directory path_ in your `package.json`.");
    markdown.push(targetManifest.name + " can then be imported/required into any module in your project as follows:");

    markdown.push("Example script, `" + packageNameTerse + "-example.js`:");
    markdown.push("```JavaScript\nconst " + packageNameTerse + " = require('" + targetManifest.name + "');\nconsole.log(JSON.stringify(" + packageNameTerse + ".__meta));\n/* ... your derived code here ... */\n```");

}

// PACKAGE DOCUMENTATION SECTION 2
if (packageData.packageReadme.bodySections && packageData.packageReadme.bodySections.length) {
    insertHeader(2, "Documentation");
    while (packageData.packageReadme.bodySections.length) {
	injectReadmeSection(packageData.packageReadme.bodySections.shift());
    }
}

if (targetManifest.name === "@encapsule/holistic") {

    insertHeader(3, "appgen Utility");
    markdown.push("This is some information about the appgen utility.");

    insertHeader(3, "Holistic Platform Runtime");
    markdown.push("The \"Holistic App Platform\" is a collection of runtime library packages that are used to build full-stack web applications and services using [Node.js](https://nodejs.org) and [React](https://react.org).");


    holisticPackages.forEach(function(packageName_) {
	const terseName = packageName_.split("/")[1];
	const readmeLink = "(PACKAGES/" + terseName + "/README.md \"Jump to " + terseName + " RTL package README...\")";
	markdown.push("#### &#x25F0; [" + packageName_ + "]" + readmeLink + " &#x25F0;");
	markdown.push(packageDB[packageName_].packageManifestOverrides.description);
	markdown.push("[README &#x25BA;]" + readmeLink);
    });

}

// PACKAGE ISSUES HEADING 2
insertHeader(2, "Issues");
markdown.push("Please post bug reports to one of the follow issue queues depending on topic:");
markdown.push("- @encapsule/holistic [GitHub Issues](https://github.com/Encapsule/holistic/issues) - Holistic platform RTL + appgen issues.");
markdown.push("- @encapsule/arccore [GitHub Issues](https://github.com/Encapsule/ARCcore/issues) - Core data RTL issues.");
markdown.push("- @encapsule/arctools [GitHub Issue](https://github.com/Encapsule/ARCtools/issues) - Core data tools and RTL issues.");

// PACKAGE DISCUSSION HEADING 2
insertHeader(2, "Discussion");
markdown.push("Join the Holistic App Platform [discussion group](https://groups.google.com/a/encapsule.io/forum/#!forum/holistic-app-platform-discussion-group \"Holistic app platform discussion group...\") to talk about the architecture, design, development, and test of full-stack interactive HTML5 applications and services implemented in JavaScript, derived from [Holistic Platform Runtime](#holistic-platform-runtime), and Facebook [React](https://reactjs.org). And, hosted on [Node.js](https://nodejs.org).");

if (targetManifest.name !== "@encapsule/holistic") {
    markdown.push("**[ [&#x025C2; Holistic App Platform](../../README.md \"Back to the main Holistic App Platform REAMDE...\") ] [ [&#x025B4; Top](#encapsule-project \"Scroll to the top of the page...\") ]**");
} else {
    markdown.push("**[ [&#x025B4; Top](#encapsule-project \"Scroll to the top of the page...\") ]**");
}

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

