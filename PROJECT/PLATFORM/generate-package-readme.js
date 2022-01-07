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

const platformNameVersion =  `Holistic App Platform v${targetManifest.version}-${targetManifest.codename}`;

if (targetManifest.name === "@encapsule/holistic") {
    insertHeader(1, platformNameVersion);
} else {
    insertHeader(2, `[${platformNameVersion}](../../README.md)`);

    let packageLinks = [];
    holisticPackages.forEach(function (packageName_) {
	    let terseName = packageName_.split("/")[1];
	    if (packageName_ === targetManifest.name) {
	        // Current package
	        packageLinks.push(`![](ASSETS/encapsule-holistic-16x16.png)&nbsp;**${terseName}**&nbsp;![](ASSETS/encapsule-holistic-16x16.png)`);
	    } else {
	        // Another package
	        packageLinks.push("[" + terseName + "](../" + terseName + "/README.md#encapsule-project \"Jump to " + terseName + " README...\")");
	    }
    });

    markdown.push(`> **[${icons.arrows.left} Holistic App Platform](../../README.md#encapsule-project "Jump to @encapsule/holistic distribution package README...") Runtime Libraries::** ${packageLinks.join(" &bull; ")}` );

    insertHeader(1, targetManifest.name);
}

// PACKAGE METADATA PRE

let environments = [];
if (packageData.packageEnvironments.indexOf("node") > -1) {
    environments.push("Node.js");
}

if (packageData.packageEnvironments.indexOf("browser") > -1) {
    environments.push("Browser/HTML5");
}

environments = environments.join(" and ");

markdown.push([
    "```",
    `Package: ${targetManifest.name} v${targetManifest.version}-${targetManifest.codename} buildID "${targetManifest.buildID}"`,
    `Sources: @encapsule/holodev#${targetManifest.buildSource}`,
    `Created: ${repoBuild.buildDateISO} // License: ${targetManifest.license}`,
    `Purpose: ${packageData.packageType} // Environment: ${environments}`,
    "```"
].join("\n"));

markdown.push(`_${targetManifest.description}_`);

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

    insertHeader(2, "@encapsule/holistic");
    injectReadmeSection(packageData.packageReadme.introduction);

    insertHeader(3, "Prerequisites");
    markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");
    injectReadmeSection(packageData.packageReadme.distributionPackage.prerequisites);

    insertHeader(3, "Installation");
    markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");
    injectReadmeSection(packageData.packageReadme.distributionPackage.installation);

    insertHeader(3, "Usage");
    markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");
    injectReadmeSection(packageData.packageReadme.distributionPackage.usage);

    insertHeader(2, "Holistic App Platform");
    markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");

    insertHeader(3, "Overview");
    markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");
    injectReadmeSection(packageData.packageReadme.holisticAppPlatform.overview);

    insertHeader(3, "appgen CLI Tool");
    markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");
    injectReadmeSection(packageData.packageReadme.holisticAppPlatform.appgen);

    insertHeader(3, "Platform Runtime Libraries");
    markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");

    markdown.push("All platform runtime libraries (RTLs) are distributed via the \`@encapsule/holistic\` distribution package. And are copied into, and registered for use in derived projects via [**appgen**](#appgen-cli-tool).");

    holisticPackages.forEach(function(packageName_) {
	    const terseName = packageName_.split("/")[1];
	    const readmeLink = "(PACKAGES/" + terseName + "/README.md \"Jump to " + terseName + " RTL package README...\")";
	    const packageData = packageDB[packageName_];

        insertHeader(4, `[${packageName_}]${readmeLink}`);

	    markdown.push(icons.packages.rtl + " " + packageData.packageManifestOverrides.description);

	    if (!packageData.packageReadme.bodySections || !packageData.packageReadme.bodySections.length) {
	        markdown.push("> TODO: **MISSING DOCUMENTATION**");
	    }

    });

} else {

    insertHeader(2, "Package Distribution & Use");

    markdown.push([
        `The \`${targetManifest.name}\` runtime library package is included in the \`@encapsule/holistic\` platform package, and is `,
        "installed and registered in every derived application service project created/maintained the [**appgen**](../../README.md#appgen-cli-tool) command line utility.",
    ].join("\n"));


    markdown.push(`From within your application service project, any module that requires access to \`${targetManifest.name}\` package API can simpy require/import the module:`);

    markdown.push([
        "```",
        `const ${packageNameTerse} = require("${targetManifest.name}");`,
        `// ${packageNameTerse} is a reference to an object that define the runtime library's API.`,
        "// ... your code here",
        "```"
    ].join("\n"));

    insertHeader(2, "API Documentation");
    markdown.push("> [" + icons.arrows.up + " Top](#encapsule-project \"Scroll to the top of the page...\")");

    if (packageData.packageReadme) {
        if (packageData.packageReadme.bodySections) {
            for (let i = 0 ; i < packageData.packageReadme.bodySections.length ; i++) {

                injectReadmeSection(packageData.packageReadme.bodySections[i]);
            }
        } else {
            markdown.push(`# MISSING \`PROJECT/PLATFORM/PACKAGES/${targetManifest.name}.js\` packageReadme.objectSections array.`);
        }
    } else {
        markdown.push(`# MISSING \`PROJECT/PLATFORM/PACKAGES/${targetManifest.name}.js\` packageReadme object.`);
    }

}


/*

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
markdown.push("Join the [Holistic App Platform Discussion](https://groups.google.com/a/encapsule.io/forum/#!forum/holistic-app-platform-discussion-group \"Google Group for Holistic App Platform topics...\") (Google Group) -- A group for discussion of Holistic App Platform runtime libraries, tools, design patterns, service architecture, and related topics.");

if (targetManifest.name !== "@encapsule/holistic") {
    markdown.push(`> [**${icons.arrows.left} Holistic App Platform**](../../README.md#encapsule-project "Back to the main Holistic App Platform REAMDE...")`);
}

// PAGE FOOTER SECTION
markdown.push("<hr>");
markdown.push("[![Encapsule Project](ASSETS/blue-burst-encapsule.io-icon-72x72.png \"Encapsule Project\")](https://encapsule.io)");
markdown.push("Copyright &copy; " + copyright.year + " [" + copyright.name + "](" + copyright.url + ") Seattle, Washington USA");
markdown.push("Published under [" + targetManifest.license + "](LICENSE) license by [Encapsule Project](https://encapsule.io)");
markdown.push("Please follow [@Encapsule](https://twitter.com/encapsule) on Twitter for news and updates.");


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
