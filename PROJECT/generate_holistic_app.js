#!/usr/bin/env node

"use strict";

// Node.js runtime modules
const fs = require('fs');
const path = require("path");

const holisticMetadata = require("../HOLISTIC/holistic");

const arctoolslib = require("arctools");
const arccore = arctoolslib.arccore;
var program = arctoolslib.commander;

program.version(holisticMetadata.version).
    option("--appRepoDir <appRepoDir>", "(required) Root directory of the external git repository containing the web application to initialize and/or update.").
    option("--info", "Print information about this tool.").
    parse(process.argv);

console.log("**** generate_holistic_app ****\n");

if (program.info) {
    console.log("This script is a code generation tool used to initialize and update");
    console.log("an external git repository containing a Node.js/HTML5 application");
    console.log("derived from Facebook React and Encapsule Project holistic framework");
    console.log("libraries.\n");
    
    console.log("It is assumed that the derived application's git repository has been");
    console.log("cloned locally on the machine where you're executing this script.\n")
    
    console.log("Modifications made by this script to the target application's repository");
    console.log("should be reviewed and committed just as any other change to the application");
    console.log("would be.\n");

    console.log("The intent of this system is to provides a clean separation between project");
    console.log("setup and maintainence, dependency management, build infrastructure, core");
    console.log("runtime infrastructure and integrations, and application-layer plug-in");
    console.log("extensions, configuration metadata, and static assets.\n");
    
    console.log("Encpasule/holistic framework metadata = '" + JSON.stringify(holisticMetadata, undefined, 2) + "'\n");
    process.exit(0);

} // end if program.info

if (!program.appRepoDir) {
    program.help();
}

// Get the fully-qualified path to the target application's git repo.
const appRepoDir = path.resolve(program.appRepoDir);

// Ensure the application repo directory exists.
if (!fs.existsSync(appRepoDir)) {
    console.error("Invalid application repo directory. '" + appRepoDir + "' does not exist.");
    process.exit(1);
}

// Ensure the application repo directory is actually a directory.
const appRepoDirStats = fs.statSync(appRepoDir);
if (!appRepoDirStats.isDirectory()) {
    console.error("Invalid application repo directory. '" + appRepoDir + "' is not a directory.");
    process.exit(1);
}



console.log("Resolved directory of the target application repo is '" + appRepoRoot + "'.");



////
// INSPECT THE TARGET APPLICATION GIT REPOSITORY

// Verify the existence of a holistic application manifest in the target application repo.
// If it does not exist, create a default manifest.

// Ensure that the target application repo has no outstanding changes left uncommited.


////
// LOAD AND PARSE THE TARGET APPLICATION'S PACKAGE.JSON

////
// LOAD AND PARSE THE HOLISTIC PACKAGE'S BUILD MANIFEST

////
// GENERATE THE APPLICATION'S UPDATED PACKAGE.JSON

////
// OVERWRITE THE TARGET APPLICATION'S PACKAGE.JSON

////
// REMOVE ANY PREVIOUSLY-REGISTERED HOLISTIC RUNTIME

////
// UPDATE THE HOLISTIC RUNTIME (I.E. COPY THE RUNTIME PACKAGES)

////
// INSTALL THE UPDATED HOLISTIC RUNTIME (I.E. UPDATE yarn.lock)

////
// SYNTHESIZSE THE TARGET APPLICATION MAKEFILE

////
// SYNTHESIZE DOCUMENTATION & OTHER PERSISTENT ASSETS

////
// COMPLETE HOLISTIC APPLICATION UDPATE
