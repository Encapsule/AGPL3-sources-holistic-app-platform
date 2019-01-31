#!/usr/bin/env node

"use strict";

// Node.js runtime modules
const fs = require('fs');
const path = require("path");

const holisticMetadata = require("../HOLISTIC/holistic");
const holisticPlatformManifest = require("./holistic-platform-manifest");

const arctoolslib = require("arctools");
const arccore = arctoolslib.arccore;

const holisticAppManifestFilter = require('./holistic-app-manifest-filter');
const devDependenciesFilter = require('./dev-dependencies-filter');

var program = arctoolslib.commander;

program.version(holisticMetadata.version).
    option("--appRepoDir <appRepoDir>", "(required) Root directory of the external git repository containing the web application to initialize and/or update.").
    option("--info", "Print information about this tool.").
    parse(process.argv);

console.log("================================================================");
console.log("generate_holistic_app :: Encapsule/holistic v" + holisticMetadata.version + " \"" + holisticMetadata.codename + "\"\n");

if (program.info) {
    console.log("This script is a code generation tool used to initialize and update");
    console.log("an external git repository containing a Node.js/HTML5 application");
    console.log("derived from Facebook React and Encapsule Project holistic platform");
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

    console.log("Encpasule/holistic platform metadata = '" + JSON.stringify(holisticMetadata, undefined, 2) + "'\n");
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

////
// Load the application's package.json document. Note that we clone this document and overwrite specific name/value pairs
// with values calculated here retaining all the non-conflicting, application-specific information that developers often
// add to their package.json.
//
filterResponse = arctoolslib.jsrcFileLoaderSync.request(resourceFilePaths.application.packageManifest);
if (filterResponse.error) {
    console.error("ERROR: Cannot load the target application's  manifest (package.json).");
    console.error(filterResponse.error);
    process.exit(1);
}
var applicationPackageManifest = filterResponse.result.resource; // ... as specified by developer(s) and this script.
// Run the devDependencies through a filter.
filterResponse = devDependenciesFilter.request(applicationPackageManifest.devDependencies);
if (filterResponse.error) {
    console.error("ERROR: Cannot access application package.json devDependencies map.");
    console.error(filterResponse.error);
    process.exit(1);
}
const applicationPackageDevDependencies = filterResponse.result;

////
// Load the application's holistic-app.json manifest document.
//
var filterResponse = arctoolslib.jsrcFileLoaderSync.request(resourceFilePaths.application.appManifest);
var holisticAppManifestData = null;
if (filterResponse.error) {
    // Assume that the file doesn't exist. Construct a default manifest w/the filter. And then serialize it.
    console.log("WARNING: The target application does not contain a holistic application manifest. Generating a new default manifest...");
    filterResponse = holisticAppManifestFilter.request({
        name: applicationPackageManifest.name,
        description: applicationPackageManifest.description,
        version: applicationPackageManifest.version,
        codename: applicationPackageManifest.codename
    });
    if (filterResponse.error) {
        console.error("ERROR: Could not initialize a default holistic application manifest!");
        console.error(filterResponse.error);
        process.exit(1);
    }
    holisticAppManifestData = filterResponse.result;
    filterResponse = arctoolslib.stringToFileSync.request({
        resource: JSON.stringify(filterResponse.result, undefined, 2),
        path: resourceFilePaths.application.appManifest
    });
    if (filterResponse.error) {
        console.error("ERROR: Unable to write a default holistic application manifest to the application repo!");
        console.error(filterRepsonse.error);
        process.exit(1);
    }
    console.log("... Holistic application manifest created '" + resourceFilePaths.application.appManifest + "'.");
} else {
    holisticAppManifestData = filterResponse.result.resource; // ... as specified by a developer
}
// Run the deserialized JSON through a filter.
filterResponse = holisticAppManifestFilter.request(holisticAppManifestData);
if (filterResponse.error) {
    console.error("ERROR: Invalid holistic application manifest document '" + resourceFilePaths.application.appManifest + "'.");
    console.error(filterResponse.error);
    process.exit(1);
}
const holisticAppManifest = filterResponse.result;

////
// Ensure the application does not declare duplicate/conflicting package dependencies.
//
var newDevDependenciesArray = [];
var conflictingAppDependencies = [];
for (var key in holisticAppManifest.devDependencies) {
    // If the application layer package dependency is already satisfied by the platform layer.
    if (holisticPlatformManifest.devDependencies[key]) {
	conflictingAppDependencies.push(key);
    }
    // Remove the values we know will be present in the resynthesized devDependencies.
    delete applicationPackageDevDependencies[key];
    newDevDependenciesArray.push({ package: key, semver: holisticAppManifest.devDependencies[key] });
} // end for

// Fail on duplicate/conflicting package dependency declarations in the holistic application manifest (holistic-app.json).
if (conflictingAppDependencies.length) {
    console.error("ERROR: Holistic application manifest '" + resourceFilePaths.application.appManifest + "' declares one or more conflicting package dependencies.");
    console.error("The following packages are already specified as Encapsule/holistic platform dependencies and should be removed from your application manifest:");
    console.error(conflictingAppDependencies.join(", "));
    process.exit(1);
} // end if

// Remove the values we know will be present in the resynthesized devDependencies.
for (key in holisticPlatformManifest.devDependencies) {
    delete applicationPackageDevDependencies[key];
    newDevDependenciesArray.push({ package: key, semver: holisticPlatformManifest.devDependencies[key] });
}

// Any package dependency remaining is no longer needed and should be removed.
if (arccore.util.dictionaryLength(applicationPackageDevDependencies)) {
    console.log("The following package dependencies declared in the application package.json will be removed: " + JSON.stringify(applicationPackageDevDependencies));
}

newDevDependenciesArray.sort(function(a_, b_) { return (a_.package === b_.package)?0:((a_.package < b_.package)?-1:1) });

var newDevDependencies = {};
newDevDependenciesArray.forEach(function(descriptor_) { newDevDependencies[descriptor_.package] = descriptor_.semver; });

// Create the 
applicationPackageManifest.devDependencies = newDevDependencies;

filterResponse = arctoolslib.stringToFileSync.request({
    resource: JSON.stringify(applicationPackageManifest, undefined, 2),
    path: resourceFilePaths.application.packageManifest
});
if (filterResponse.error) {
    console.log("ERROR: Failed to write the applicaiton's package.json document.");
    consoel.log(filterResponse.error);
    process.exit(1);
}


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
