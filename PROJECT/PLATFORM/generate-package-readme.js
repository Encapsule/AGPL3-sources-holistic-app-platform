#!/usr/bin/env node

const icons = {
    arrows: {
	up: "&#9652;",   // ▴	9652	25B4	 	BLACK UP-POINTING SMALL TRIANGLE
	down: "&#9662;", // ▾	9662	25BE	 	BLACK DOWN-POINTING SMALL TRIANGLE
	left: "&#9666;", // ◂	9666	25C2	 	BLACK LEFT-POINTING SMALL TRIANGLE
	right: "&#9656;" // ▸	9656	25B8	 	BLACK RIGHT-POINTING SMALL TRIANGLE
    },
    packages: {
	dist: "&#x029C9;",
	rtl: "&#x25F0;"
    },
    other: {
	gear: "&#9881;"
    }
};

const arccore = require("@encapsule/arccore");
const arctools = require('@encapsule/arctools');
const path = require('path');
const fs = require('fs');

// Information about the most recent build (contains no information specific to a package).
const repoBuild = require('../../BUILD/holistic');
const holisticPackages = arccore.util.clone(require("../../BUILD/holistic-rtl-packages"));
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
	markdown.push("# ![](ASSETS/encapsule-holistic-32x32.png)&nbsp;" + text_);
	break;
    case 2:
	markdown.push("## ![](ASSETS/encapsule-holistic-24x24.png)&nbsp;" + text_);
	break;
    case 3:
	markdown.push("### ![](ASSETS/encapsule-holistic-16x16.png)&nbsp;" + text_);
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
    if (!sectionDescriptor_) {
	throw new Error("Missing section descriptor.");
    }
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

markdown.push("> " + [
    "[Homepage](https://encapsule.io \"Encapsule Project Homepage...\")",
    "[GitHub](https://github.com/Encapsule \"Encapsule Project GitHub...\")",
    "[Discussion](https://groups.google.com/a/encapsule.io/forum/#!forum/holistic-app-platform-discussion-group \"Holistic app platform discussion group...\")",
    "[Twitter](https://twitter.com/Encapsule \"Encapsule Project Twitter...\")",
].join(" &bull; "));

markdown.push("Encapsule Project is MIT-licensed libs & tools for building full-stack Node.js/HTML5 apps & services w/React based on System in Cloud (SiC) architecture.");

// PACKAGE HEADING 1

if (targetManifest.name === "@encapsule/holistic") {
    insertHeader(1, "Holistic App Platform v" + targetManifest.version + " " + targetManifest.codename);
    markdown.push("##  " + icons.packages.dist + " Distribution: " +  " " + targetManifest.name);
    markdown.push("> [appgen](#appgen-utility) &bull; [Holistic Platform Runtime](#holistic-platform-runtime)");
} else {
    insertHeader(1, "[Holistic App Platform](../../README.md#encapsule-project \"Back to the Holistic App Platform README...\") v" + targetManifest.version + " " + targetManifest.codename);
    markdown.push("## " + icons.packages.rtl + " Runtime library: " +  targetManifest.name);

    let packageLinks = [];
    holisticPackages.forEach(function (packageName_) {
	let terseName = packageName_.split("/")[1];
	if (packageName_ === targetManifest.name) {
	    // Current package
	    packageLinks.push(icons.packages.rtl + " **" + terseName + "**");
	} else {
	    // Another package
	    packageLinks.push("[" + terseName + "](../" + terseName + "/README.md#encapsule-project \"Jump to " + terseName + " README...\")");
	}
    });
    markdown.push("> [**RTL index**](../../README.md#holistic-platform-runtime \"Jump back to the RTL index...\"): " + packageLinks.join(" &bull; ") );

}

// PACKAGE METADATA PRE
markdown.push(targetManifest.description);

markdown.push("```\n" +
              "Package: " + targetManifest.name + " v" + targetManifest.version + " \"" + targetManifest.codename + "\" build ID \"" + targetManifest.buildID + "\"\n" +
              "Sources: Encapsule/holistic-master#" + targetManifest.buildSource + "\n" +
              
              "Created: " + repoBuild.buildDateISO + " Purpose: " + packageData.packageType + " (" + (packageData.browserSafe?"Node.js + modern browsers (via package bundler)":"Node.js") + ") " +
              "License: " + targetManifest.license + "\n" +
              "```");

insertHeader(2, "Overview");

// PACKAGE OVERVIEW HEADING 2
if (packageData.packageReadme.overviewDescriptor) {
    injectReadmeSection(packageData.packageReadme.overviewDescriptor);
    if (targetManifest.name === "@encapsule/holistic") {
	holisticPackages.forEach(function(packageName_) {
	    let terseName = packageName_.split("/")[1];
	    markdown.push("    - " + icons.packages.rtl + " [" + packageName_ + "](PACKAGES/" + terseName + "/README.md \"Jump to " + terseName + " RTL package README...\")");
	});
    }
} else {
    markdown.push("**MISSING OVERVIEW SECTION FOR PACKAGE!**");
}

// PACKAGE DISTRIBUTION HEADING 2
insertHeader(2, "Distribution");

if (targetManifest.name === "@encapsule/holistic") {

    // HOLISTIC DISTRIBUTION

    markdown.push("The @encapsule/holistic package is not currently published on npmjs.com or any other package registry.");
    markdown.push("Currently, you need to obtain the @encapsule/holistic package via `git clone` as below.");

    markdown.push("### Prerequisites");
    markdown.push("To get started you need a small set of core tools installed on your host OS:");

    markdown.push("- [GNU Make](https://www.gnu.org/software/make/)");
    markdown.push("- [git](https://git-scm.com/)");
    markdown.push("- [Node.js](https://nodejs.org)");
    markdown.push("- [yarn](https://yarnpkg.com) (depends on Node.js)");

    markdown.push("Most of you will likely already have all of these tool installed.");
    markdown.push("If not, then they are readily available for all major platforms at the links above.");

    markdown.push("### Clone");
    markdown.push("Execute `git clone` to obtain a copy of the @encapsule/holistic package repo from [@Encapsule](https://github.com/Encapsule) GitHub organization.");
    markdown.push("You will typically only need to clone the @encapsule/holistic package repo once.");
    markdown.push("```\n" +
		  "$ cd ~/code # or, wherever...\n" +
		  "$ git clone git@github.com:Encapsule/holistic.git\n" +
		  "```");

    markdown.push("After one-time `git clone`, follow the steps outlined in the [Installation](#installation) section below.");

} else {

    // PSEUDO-PACKAGE DISTRIBUTION

    markdown.push("The `" + targetManifest.name + "` RTL package is installed in derived app/service projects by running [appgen](../../README#appgen-utility \"Jump to appgen documentation...\").");

    
    markdown.push("#### Detail");

    markdown.push("The " + targetManifest.name + " package is a runtime library (RTL) distributed in the @encapsule/holistic package:");
    markdown.push("```\n@encapsule/holistic/PACKAGES/" + packageNameTerse + "\n```");

    markdown.push("The `appgen` utility is used to create a copy of this RTL package inside your derived app/service project...");
    markdown.push("```\n@AcmeCo/SampleApp/HOLISTIC/PACKAGES/" + packageNameTerse + "\n```");

    markdown.push("... and modify its `package.json` file to include the following package registration:");
    markdown.push("```\n\"devDependencies\": {\n    \"" + targetManifest.name + "\": \"./HOLISTIC/PACKAGES/" + packageNameTerse + "\"\n}\n```");

}

if (targetManifest.name === "@encapsule/holistic") {
    
    // PACKAGE INSTALLATION HEADING 2
    insertHeader(2, "Installation");

    markdown.push("Installation of the @encapsule/holistic package from git repo source is a per-version process that should be re-executed every time you update your local clone of the repo. This includes changing branches.");

    markdown.push("- Ensure you have the latest version of @encapsule/holistic repo.");
    markdown.push("- Update your local `node_modules` directory. **IMPORTANT**");

    markdown.push("```\n" +
		  "$ cd ~/code/holistic\n" +
		  "$ git pull origin master\n" +
		  "$ yarn install\n" +
		  "```");

    markdown.push("> Be aware of the disconnect between what is present in your `node_modules` directory (managed by `yarn`). And, the state of critical `package.json` and `yarn.lock` files (managed by `git`).");

    markdown.push("- Latest supported version is available on #master branch.");
    markdown.push("- Other topic branches are used for testing features prior to release.");

    markdown.push("After you have executed `yarn install`, the [appgen](#appgen-utility) utility is ready to use.");

} else {

    // PACKAGE USEAGE HEADING 2
    insertHeader(2, "Usage");

    markdown.push("In your derived app/service implementation code:");

    markdown.push("Example script, `" + packageNameTerse + "-example.js`:");
    markdown.push("```JavaScript\nconst " + packageNameTerse + " = require('" + targetManifest.name + "');\nconsole.log(JSON.stringify(" + packageNameTerse + ".__meta));\n/* ... your derived code here ... */\n```");

    markdown.push("Authoring `/* ... your derived code ... */` is discussed in the next section.");
}

// PACKAGE DOCUMENTATION SECTION 2
insertHeader(1, "Documentation");

if (targetManifest.name === "@encapsule/holistic") {
    if (packageData.packageReadme.holisticAppSections && packageData.packageReadme.holisticAppSections.length) {
	while (packageData.packageReadme.holisticAppSections.length) {
	    injectReadmeSection(packageData.packageReadme.holisticAppSections.shift());
	}
    } else {
	markdown.push("**MISSING HOLISTIC APP DOCUMENTATION!**");
    }
} else {
    if (packageData.packageReadme.bodySections && packageData.packageReadme.bodySections.length) {
	while (packageData.packageReadme.bodySections.length) {
	    injectReadmeSection(packageData.packageReadme.bodySections.shift());
	}
    } else {
	markdown.push("**MISSING PACKAGE DOCUMENTATION!**");
    }
}

if (targetManifest.name === "@encapsule/holistic") {

    insertHeader(2, "appgen Utility");

    if (packageData.packageReadme.appgenSections && packageData.packageReadme.appgenSections.length) {
	while (packageData.packageReadme.appgenSections.length) {
	    injectReadmeSection(packageData.packageReadme.appgenSections.shift());
	}
    } else {
	markdown.push("**MISSING APPGEN DOCUMENTATION!**");
    }

    insertHeader(2, "Holistic Platform Runtime");
    markdown.push("The \"Holistic App Platform\" is a collection of runtime library packages that are used to build full-stack web applications and services using [Node.js](https://nodejs.org) and [React](https://react.org).");

    holisticPackages.forEach(function(packageName_) {
	const terseName = packageName_.split("/")[1];
	const readmeLink = "(PACKAGES/" + terseName + "/README.md \"Jump to " + terseName + " RTL package README...\")";
	const packageData = packageDB[packageName_];
	
	markdown.push("### " + icons.packages.rtl + " [" + packageName_ + "]" + readmeLink);
	markdown.push(packageData.packageManifestOverrides.description);
	if (!packageData.packageReadme.overviewDescriptor) {
	    markdown.push("> TODO: **MISSING OVERVIEW**");
	}

	if (!packageData.packageReadme.bodySections || !packageData.packageReadme.bodySections.length) {
	    markdown.push("> TODO: **MISSING DOCUMENTATION**");
	}
	markdown.push("> [README " + icons.arrows.right + "]" + readmeLink);
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
    markdown.push("> [" + icons.arrows.left + " Holistic App Platform](../../README.md \"Back to the main Holistic App Platform REAMDE...\") &bull; [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");
} else {
    markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");
}

// PAGE FOOTER SECTION
markdown.push("<hr>");
markdown.push("[![Encapsule Project](ASSETS/blue-burst-encapsule.io-icon-72x72.png \"Encapsule Project\")](https://encapsule.io)");
markdown.push("Copyright &copy; " + copyright.year + " [" + copyright.name + "](" + copyright.url + ") Seattle, Washington USA");
markdown.push("Published under [" + targetManifest.license + "](LICENSE) license by [Encapsule Project](https://encapsule.io)");
markdown.push("Please follow [@Encapsule](https://twitter.com/encapsule) on Twitter for news and updates.");
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
