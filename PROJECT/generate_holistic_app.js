#!/usr/bin/env node

"use strict";

// Node.js runtime modules
const fs = require('fs');
const path = require("path");

const holisticMetadata = require("../HOLISTIC/holistic");
const holisticFrameworkManifest = require("./holistic-platform-manifest");

const arctoolslib = require("arctools");
const arccore = arctoolslib.arccore;

const holisticAppManifestFilter = require('./holistic-app-manifest-filter');

var program = arctoolslib.commander;

program.version(holisticMetadata.version).
    option("--appRepoDir <appRepoDir>", "(required) Root directory of the external git repository containing the web application to initialize and/or update.").
    option("--info", "Print information about this tool.").
    parse(process.argv);

console.log("**** generate_holistic_app v" + holisticMetadata.version + " \"" + holisticMetadata.codename + "\" ****\n");

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
console.log("> Inspecting local application git repo directory: '" + appRepoDir + "' ...");

const resourceFilePaths = {

    application: {
	appRepoDir: appRepoDir,
	appRepoGitDir: path.join(appRepoDir, ".git"),
	packageManifest: path.join(appRepoDir, "package.json"),
	packageReadme: path.join(appRepoDir, "README.md"),
	packageLicense: path.join(appRepoDir, "LICENSE"),
	packageMakefile: path.join(appRepoDir, "Makefile"),
	appManifest: path.join(appRepoDir, "holistic-app.json"),
    },

    holistic: {
    }

};

// Ensure the application repo directory exists.
if (!fs.existsSync(appRepoDir)) {
    console.error("ERROR: Invalid application repo directory. '" + appRepoDir + "' does not exist.");
    process.exit(1);
}

// Ensure the application repo directory is actually a directory.
var fsStat = fs.statSync(appRepoDir);
if (!fsStat.isDirectory()) {
    console.error("ERROR: Invalid application repo directory. '" + appRepoDir + "' is not a directory.");
    process.exit(1);
}

if (!fs.existsSync(resourceFilePaths.application.appRepoGitDir)) {
    console.error("ERROR: Invalid application repo directory. '" + appRepoDir + "' does not appear to be a git repository. Have you executed `git init`?");
    process.exit(1);
}

fsStat = fs.statSync(resourceFilePaths.application.appRepoGitDir);
if (!fsStat.isDirectory()) {
    console.error("ERROR: Invalid application repo directory. '" + appRepoDir + "' does not appear to be a git repository. Have you executed `git init`?");
    process.exit(1);
}

console.log("... Target application directory '" + appRepoDir + "' exists and appears to be a git repository.");

filterResponse = arctoolslib.jsrcFileLoaderSync.request(resourceFilePaths.application.packageManifest);
if (filterResponse.error) {
    console.error("ERROR: Cannot load the target application's  manifest (package.json).");
    console.error(filterResponse.error);
    process.exit(1);
}

// The applicationPackageManifest is taken as specified by the developer and used as the basis for deriving
// a new package.json for the application formed by extending/overwriting developer-specified information
// with the latest holistic application package settings. Note that the intent is that developers primarily
// maintain their holistic-app.json file and extend their package.json only as required to affect additional
// application-specific integrations (e.g. with test / deployment infrastructure) that are not directly
// coupled to the build and packaging of the holistic application (and thus are not represented in
// the developer-specified holistic-app.json manifest).

const applicationPackageManifest = filterResponse.result.resource; // ... as specified by developer(s) and this script.

var filterResponse = arctoolslib.jsrcFileLoaderSync.request(resourceFilePaths.application.appManifest);
if (filterResponse.error) {
    console.error("ERROR: Unable to read the application's holistic application manifest file (holistic-app.json).");
    console.error(filterResponse.error);
    process.exit(1);
}

const holisticAppManifestData = filterResponse.result.resource; // ... as specified by a developer

filterResponse = holisticAppManifestFilter.request(holisticAppManifestData);
if (filterResponse.error) {
    console.error("ERROR: Invalid holistic application manifest document '" + resourceFilePaths.application.appManifest + "'.");
    console.error(filterResponse.error);
    process.exit(1);
}

const holisticAppManifest = filterResponse.result;







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
