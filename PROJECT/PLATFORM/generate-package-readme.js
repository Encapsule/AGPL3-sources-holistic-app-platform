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
const holisticPackages = arccore.util.clone(require("../../BUILD/holistic-rtl-packages")); //why use clone here? odd -- I don't remember
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

markdown.push("> **" + [
    "[Homepage](https://encapsule.io \"Encapsule Project Homepage...\")",
    "[GitHub](https://github.com/Encapsule \"Encapsule Project GitHub...\")",
    "[Discussion](https://groups.google.com/a/encapsule.io/forum/#!forum/holistic-app-platform-discussion-group \"Holistic app platform discussion group...\")",
    "[Twitter](https://twitter.com/Encapsule \"Encapsule Project Twitter...\")",
].join(" &bull; ") + "**");

markdown.push("_Encapsule Project is a quest to define a universal protocol for domain-specific software models + infrastructure to support composition of distributed apps & services._");

// PACKAGE HEADING 1

if (targetManifest.name === "@encapsule/holistic") {
    insertHeader(1, "Holistic App Platform v" + targetManifest.version + " " + targetManifest.codename);
} else {
    insertHeader(3, "Holistic App Platform v" + targetManifest.version + " " + targetManifest.codename);

    let packageLinks = [];
    holisticPackages.forEach(function (packageName_) {
	    let terseName = packageName_.split("/")[1];
	    if (packageName_ === targetManifest.name) {
	        // Current package
	        packageLinks.push(`![](ASSETS/encapsule-holistic-16x16.png)&nbsp;**${terseName}**`);
	    } else {
	        // Another package
	        packageLinks.push("[" + terseName + "](../" + terseName + "/README.md#encapsule-project \"Jump to " + terseName + " README...\")");
	    }
    });
    markdown.push(`> **[${icons.arrows.left} Holistic App Platform](../../README.md#encapsule-project "Jump to @encapsule/holistic distribution package README...") Runtime Libraries::** ${packageLinks.join(" &bull; ")}` );

    insertHeader(1, `RTL Package: ${targetManifest.name}`);
}

// PACKAGE METADATA PRE

markdown.push("```\n" +
              "Package: " + targetManifest.name + " v" + targetManifest.version + " \"" + targetManifest.codename + "\" build ID \"" + targetManifest.buildID + "\"\n" +
              "Sources: @encapsule/holodev#" + targetManifest.buildSource + "\n" +
              "Created: " + repoBuild.buildDateISO + " Purpose: " + packageData.packageType + " (" + (packageData.browserSafe?"Node.js + modern browsers (via package bundler)":"Node.js") + ")\n" +
              "License: " + targetManifest.license + "\n" +
              "```");

if (targetManifest.name !== "@encapsule/holistic") {
    markdown.push(`_${targetManifest.description}_`);
}

// TABLE OF CONTENTS

if (targetManifest.name === "@encapsule/holistic") {

    // TOP-LEVEL TABLE OF CONTENTS

    insertHeader(2, "Contents");

    let toc = `
- [Introduction](#introduction)
- [${icons.packages.dist} @encapsule/holistic Distribution Package](#encapsuleholistic-distribution-package)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)
- [Holistic App Platform](#holistic-app-platform)
    - [Overview](#overview)
    - [appgen CLI Tool](#appgen-cli-tool)
    - [Platform Runtime Libraries](#platform-runtime-libraries)
`;

    let rtls = [];
    holisticPackages.forEach(function (packageName_) {
	    let terseName = packageName_.split("/")[1];
	    rtls.push(`        - [${icons.packages.rtl} ${terseName} ](./PACKAGES/${terseName}/README.md "Jump to ${terseName} README...")`);
    });

    toc += `${rtls.join("\n")}
- [Issues](#issues)
- [Discussion](#discussion)
`;

    markdown.push(toc);

    insertHeader(2, "Introduction");
    markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");
    injectReadmeSection(packageData.packageReadme.introduction);

    insertHeader(2, `@encapsule/holistic Distribution Package`);
    markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");

    markdown.push(`_${targetManifest.description}_`);

    insertHeader(3, "Prerequisites");
    injectReadmeSection(packageData.packageReadme.distributionPackage.prerequisites);

    insertHeader(3, "Installation");
    injectReadmeSection(packageData.packageReadme.distributionPackage.installation);

    insertHeader(3, "Usage");
    injectReadmeSection(packageData.packageReadme.distributionPackage.usage);

    insertHeader(2, "Holistic App Platform");
    markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");

    insertHeader(3, "Overview");
    injectReadmeSection(packageData.packageReadme.holisticAppPlatform.overview);

    insertHeader(3, "appgen CLI Tool");
    injectReadmeSection(packageData.packageReadme.holisticAppPlatform.appgen);

    insertHeader(3, "Platform Runtime Libraries");
    injectReadmeSection(packageData.packageReadme.holisticAppPlatform.rtls);

    markdown.push(`_All platform runtime libraries (RTLs) are distributed via the \`@encapsule/holistic\` distribution package. And are copied into, and registered for use in derived projects via [**appgen**](#appgen-cli-tool)._`);

    holisticPackages.forEach(function(packageName_) {
	    const terseName = packageName_.split("/")[1];
	    const readmeLink = "(PACKAGES/" + terseName + "/README.md \"Jump to " + terseName + " RTL package README...\")";
	    const packageData = packageDB[packageName_];

	    markdown.push("#### " + icons.packages.rtl + " [" + packageName_ + "]" + readmeLink);
	    markdown.push(packageData.packageManifestOverrides.description);
	    if (!packageData.packageReadme.overviewDescriptor) {
	        markdown.push("> TODO: **MISSING OVERVIEW**");
	    }

	    if (!packageData.packageReadme.bodySections || !packageData.packageReadme.bodySections.length) {
	        markdown.push("> TODO: **MISSING DOCUMENTATION**");
	    }
	    markdown.push("> [README " + icons.arrows.right + "]" + readmeLink);
    });

} else {

}


/*

insertHeader(2, "Overview");

// PACKAGE OVERVIEW HEADING 2
if (packageData.packageReadme.overviewDescriptor) {

    // KILL THIS
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
    markdown.push("- [npm](https://www.npmjs.com) (bundled w/Node.js)");

    markdown.push("**IMPORTANT**");
    markdown.push("Once you have configured these baseline tools dependencies, then all other concerns related to tools and libraries dependencies are managed directly or indirectly under developer control via `appgen`.");

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
    markdown.push("```\n\"devDependencies\": {\n    \"" + targetManifest.name + "\": \"file:./HOLISTIC/PACKAGES/" + packageNameTerse + "\"\n}\n```");

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
		          "$ npm install\n" +
		          "```");

    markdown.push("> Be aware of the disconnect between what is present in your `node_modules` directory (managed by `npm`). And, the state of critical `package.json` and `package-lock.json` files (managed by `git`).");

    markdown.push("- Latest supported version is available on #master branch.");
    markdown.push("- Other topic branches are used for testing features prior to release.");

    markdown.push("After you have executed `npm install`, the [appgen](#appgen-utility) utility is ready to use.");

} else {

    // PACKAGE USEAGE HEADING 2
    insertHeader(2, "Usage");

    markdown.push("In your derived app/service implementation code:");

    markdown.push("Example script, `" + packageNameTerse + "-example.js`:");
    markdown.push("```JavaScript\nconst " + packageNameTerse + " = require('" + targetManifest.name + "');\nconsole.log(JSON.stringify(" + packageNameTerse + ".__meta));\n```");

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

    insertHeader(2, "Holistic Platform Runtime Libraries");
    markdown.push("The \"Holistic App Platform\" is a collection of runtime library packages that are used to build full-stack web applications and services in JavaScript.");

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

*/


// PACKAGE ISSUES HEADING 2
insertHeader(2, "Issues");
markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");
markdown.push("Please post bug reports to one of the follow issue queues depending on topic:");
markdown.push("- @encapsule/holistic [GitHub Issues](https://github.com/Encapsule/holistic/issues) - Holistic platform RTL + appgen issues.");
markdown.push("- @encapsule/arccore [GitHub Issues](https://github.com/Encapsule/ARCcore/issues) - Core data RTL issues.");
markdown.push("- @encapsule/arctools [GitHub Issue](https://github.com/Encapsule/ARCtools/issues) - Core data tools and RTL issues.");

// PACKAGE DISCUSSION HEADING 2
insertHeader(2, "Discussion");
markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");
markdown.push("Join the [**Holistic App Platform Discussion**](https://groups.google.com/a/encapsule.io/forum/#!forum/holistic-app-platform-discussion-group \"Google Group for Holistic App Platform topics...\") (Google Group) -- A group for discussion of Holistic App Platform runtime libraries, tools, design patterns, service architecture, and related topics.");

markdown.push(`> [**${icons.arrows.left} Holistic App Platform**](../../README.md#encapsule-project "Back to the main Holistic App Platform REAMDE...")`);

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
