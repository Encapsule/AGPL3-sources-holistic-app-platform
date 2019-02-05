#!/usr/bin/env node

"use strict";

// Node.js runtime modules
const childProcess = require('child_process'); // Node.js
const fs = require('fs'); // Node.js
const path = require("path"); // Node.js
const mkdirp = require("mkdirp"); // as in UNIX mkdir -p
const arctoolslib = require("arctools"); // Encapsule/arctools package
const arccore = arctoolslib.arccore; // ... Encapsule/arccore is bundled with Encapsule/arctools
var program = arctoolslib.commander; // command line argument parser framework bundled with Encapsule/arctools

const holisticMetadata = require("../../PLATFORM/holistic");
const holisticPlatformManifest = require("./holistic-platform-manifest");

const holisticAppManifestFilter = require('./LIB/holistic-app-manifest-filter');
const packageMapFilter = require('./LIB/package-map-filter');

function syncExec(request_) { // request_ = { command: string, cwd: string,  }
    // https://stackoverflow.com/questions/30134236/use-child-process-execsync-but-keep-output-in-console
    // return childProcess.execSync(request_.command, { cwd: request_.cwd, stdio: [0,1,2] });
    return childProcess.execSync(request_.command, { cwd: request_.cwd }).toString('utf8').trim();
} // ruxExec

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

// Get the fully-qualified path to the target application's git repository.
const appRepoDir = path.resolve(program.appRepoDir);
console.log("> Open '" + appRepoDir + "' ...");

// Get the full-qualified path of the Encapsule/holistic package root directory.
const holisticPackageDir = path.resolve(path.join(__dirname, "../.."));


const resourceFilePaths = {
    application: {
	    appRepoDir: appRepoDir,
	    appRepoGitDir: path.join(appRepoDir, ".git"),
	    appManifest: path.join(appRepoDir, "holistic-app.json"),

        appSourcesDir: path.join(appRepoDir, "SOURCES"),
        appAssetSourcesDir: path.join(appRepoDir, "SOURCES/ASSETS"),
        appClientSourcesDir: path.join(appRepoDir, "SOURCES/CLIENT"),
        appCommonSourcesDir: path.join(appRepoDir, "SOURCES/COMMON"),
        appServerSourcesDir: path.join(appRepoDir, "SOURCES/SERVER"),

	    packageManifest: path.join(appRepoDir, "package.json"),
	    packageReadme: path.join(appRepoDir, "README.md"),
	    packageLicense: path.join(appRepoDir, "LICENSE"),
	    packageMakefile: path.join(appRepoDir, "Makefile"),
        packageGitIgnore: path.join(appRepoDir, ".gitignore"),
        packageBabelRc: path.join(appRepoDir, ".babelrc"),
        packageEslintRc: path.join(appRepoDir, ".eslintrc.js"),
        packageWebpackServerRc: path.join(appRepoDir, "webpack.config.app.server"),
        packageWebpackClientRc: path.join(appRepoDir, "webpack.config.app.client"),



        platformSourcesDir: path.join(appRepoDir, "HOLISTIC")
    },
    holistic: {
        packageDir: holisticPackageDir,
        platformSourcesDir: path.join(holisticPackageDir, "PLATFORM"),
        platformGitIgnore: path.join(holisticPackageDir, ".gitignore"),
        platformBabelRc: path.join(holisticPackageDir, ".babelrc"),
        platformEslintRc: path.join(holisticPackageDir, ".eslintrc.js"),
        platformWebpackServerRc: path.join(holisticPackageDir, "PROJECT/GENERATOR/TEMPLATES/webpack.config.app.server"),
        platformWebpackClientRc: path.join(holisticPackageDir, "PROJECT/GENERATOR/TEMPLATES/webpack.config.app.client")
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
// Filter the package map.
filterResponse = packageMapFilter.request(applicationPackageManifest.devDependencies);
if (filterResponse.error) {
    console.error("ERROR: Cannot access application package.json devDependencies map.");
    console.error(filterResponse.error);
    process.exit(1);
}
const applicationPackageDevDependencies = filterResponse.result;
console.log("> Read '" + resourceFilePaths.application.packageManifest + "'.");

////
// Load the application's holistic-app.json manifest document.
//
var filterResponse = arctoolslib.jsrcFileLoaderSync.request(resourceFilePaths.application.appManifest);
var holisticAppManifest = null;
if (filterResponse.error) {
    // Assume that the file doesn't exist. Construct a default manifest w/the filter. And then serialize it.
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
    // Use the newly-created holistic application manifest.
    holisticAppManifest = filterResponse.result;
    // Write the new holistic application manifest to the application repository.
    filterResponse = arctoolslib.stringToFileSync.request({
        resource: JSON.stringify(filterResponse.result, undefined, 2),
        path: resourceFilePaths.application.appManifest
    });
    if (filterResponse.error) {
        console.error("ERROR: Unable to write a default holistic application manifest to the application repo!");
        console.error(filterRepsonse.error);
        process.exit(1);
    }
    console.log("> Write '" + resourceFilePaths.application.appManifest + "'.");
} else {
    const holisticAppManifestData = filterResponse.result.resource; // ... as specified by a developer
    // Filter the holistic application manifest read from the application repository.
    filterResponse = holisticAppManifestFilter.request(holisticAppManifestData);
    if (filterResponse.error) {
        console.error("ERROR: Invalid holistic application manifest document '" + resourceFilePaths.application.appManifest + "'.");
        console.error(filterResponse.error);
        process.exit(1);
    }
    // Use the filtered holistic application manifest data read from the application repository.
    holisticAppManifest = filterResponse.result;
    console.log("> Read '" + resourceFilePaths.application.appManifest + "'.");
} // else we read the holistic application manifest from the application repository

////
// Ensure the application does not declare duplicate/conflicting package dependencies.
//
var newDevDependenciesArray = [];
var conflictingAppDependencies = [];

for (var key in holisticAppManifest.applicationDependencies) {
    // If the application layer package dependency is already satisfied by the platform layer.
    if (holisticPlatformManifest.platformDependencies[key]) {
	    conflictingAppDependencies.push(key);
    }
    // Remove the values we know will be present in the resynthesized devDependencies.
    delete applicationPackageDevDependencies[key];
    newDevDependenciesArray.push({ package: key, semver: holisticAppManifest.applicationDependencies[key] });
} // end for

// Fail on duplicate/conflicting package dependency declarations in the holistic application manifest (holistic-app.json).
if (conflictingAppDependencies.length) {
    console.error("ERROR: Holistic application manifest '" + resourceFilePaths.application.appManifest + "' declares one or more conflicting package dependencies.");
    console.error("The following packages are already specified as Encapsule/holistic platform dependencies and should be removed from your application manifest:");
    console.error(conflictingAppDependencies.join(", "));
    process.exit(1);
} // end if

// Remove the values we know will be present in the resynthesized devDependencies.
for (key in holisticPlatformManifest.platformDependencies) {
    delete applicationPackageDevDependencies[key];
    newDevDependenciesArray.push({ package: key, semver: holisticPlatformManifest.platformDependencies[key] });
}

// Any package dependency remaining is no longer needed and should be removed.
if (arccore.util.dictionaryLength(applicationPackageDevDependencies)) {
    console.log("! NOTE: Package dependencies are being removed: '" + JSON.stringify(applicationPackageDevDependencies) + "'.");
}

newDevDependenciesArray.sort(function(a_, b_) { return (a_.package === b_.package)?0:((a_.package < b_.package)?-1:1) });

var newDevDependencies = {};
newDevDependenciesArray.forEach(function(descriptor_) { newDevDependencies[descriptor_.package] = descriptor_.semver; });

// Set the application's development mode package dependencies.
applicationPackageManifest.devDependencies = newDevDependencies;

const holisticAppManifestSpec = holisticAppManifestFilter.filterDescriptor.inputFilterSpec;
for (key in holisticAppManifestSpec) {
    const namespaceDescriptor = holisticAppManifestSpec[key];
    if (namespaceDescriptor.____appdsl && namespaceDescriptor.____appdsl.copyValue) {
        applicationPackageManifest[key] = holisticAppManifest[key];
    }
}

if (!applicationPackageManifest.scripts) {
    applicationPackageManifest.scripts = {};
}

for (key in holisticPlatformManifest.applicationPackageManifest.scripts) {
    applicationPackageManifest.scripts[key] = holisticPlatformManifest.applicationPackageManifest.scripts[key];
}

////
// Overwrite the application's package.json document with the updated version.
filterResponse = arctoolslib.stringToFileSync.request({
    resource: JSON.stringify(applicationPackageManifest, undefined, 2),
    path: resourceFilePaths.application.packageManifest
});
if (filterResponse.error) {
    console.log("ERROR: Failed to write the applicaiton's package.json document.");
    consoel.log(filterResponse.error);
    process.exit(1);
}
console.log("> Write '" + resourceFilePaths.application.packageManifest + "'.");

////
// Remove existing copy of the holistic platform sources from the application.
var consoleOutput = syncExec({
    cwd: resourceFilePaths.application.appRepoDir,
    command: ("rm -rfv " + resourceFilePaths.application.platformSourcesDir)
});
console.log("> Remove '" + resourceFilePaths.application.platformSourcesDir + "'.");

////
// Copy the latest version of the holistic platform sources into the application.
mkdirp(resourceFilePaths.application.platformSourcesDir);
var command =  [
    "cp -Rpv",
    path.join(resourceFilePaths.holistic.platformSourcesDir, "*"),
    (resourceFilePaths.application.platformSourcesDir + "/")
].join(" ");
var consoleOutput = syncExec({
    cwd: resourceFilePaths.holistic.packageDir,
    command: command
});
console.log("> Create '" + resourceFilePaths.application.platformSourcesDir + "'.");

////
// Create application .gitignore
// TODO: Convert to handlebars template.
command = [
    "cp -pv",
    resourceFilePaths.holistic.platformGitIgnore,
    resourceFilePaths.application.packageGitIgnore
].join(" ");
consoleOutput = syncExec({
    cwd: resourceFilePaths.holistic.packageDir,
    command: command
});
console.log("> Write '" + resourceFilePaths.application.packageGitIgnore + "'.");

////
// Create application .babelrc
// TODO: Convert to handlebars template.
command = [
    "cp -pv",
    resourceFilePaths.holistic.platformBabelRc,
    resourceFilePaths.application.packageBabelRc
].join(" ");
consoleOutput = syncExec({
    cwd: resourceFilePaths.holistic.packageDir,
    command: command
});
console.log("> Write '" + resourceFilePaths.application.packageBabelRc + "'.");

////
// Create application .eslintrc.js
// TODO: Convert to handlebars template.
command = [
    "cp -pv",
    resourceFilePaths.holistic.platformEslintRc,
    resourceFilePaths.application.packageEslintRc
].join(" ");
consoleOutput = syncExec({
    cwd: resourceFilePaths.holistic.packageDir,
    command: command
});
console.log("> Write '" + resourceFilePaths.application.packageEslintRc + "'.");

////
// Create application webpack.config for server.
// TODO: Convert to handlebars template.
command = [
    "cp -pv",
    resourceFilePaths.holistic.platformWebpackServerRc,
    resourceFilePaths.application.packageWebpackServerRc
].join(" ");
consoleOutput = syncExec({
    cwd: resourceFilePaths.holistic.packageDir,
    command: command
});
console.log("> Write '" + resourceFilePaths.application.packageWebpackServerRc + "'.");

////
// Create application webpackage.config for client.
// TODO: Convert to handlebars template.
command = [
    "cp -pv",
    resourceFilePaths.holistic.platformWebpackClientRc,
    resourceFilePaths.application.packageWebpackClientRc
].join(" ");
consoleOutput = syncExec({
    cwd: resourceFilePaths.holistic.packageDir,
    command: command
});
console.log("> Write '" + resourceFilePaths.application.packageWebpackClientRc + "'.");

////
// Create application Makefile
// TODO: Convert to handlebars template.
command = [
    "touch",
    resourceFilePaths.application.packageMakefile
].join(" ");
consoleOutput = syncExec({
    cwd: resourceFilePaths.holistic.packageDir,
    command: command
});
console.log("> Touch '" + resourceFilePaths.application.packageMakefile + "'.");

mkdirp(resourceFilePaths.application.appSourcesDir);
mkdirp(resourceFilePaths.application.appAssetSourcesDir);
mkdirp(resourceFilePaths.application.appCommonSourcesDir);
mkdirp(resourceFilePaths.application.appClientSourcesDir);
mkdirp(resourceFilePaths.application.appServerSourcesDir);

////
// Determine the count of files in the target application repo that are in the
// modified, deleted, or untracked state after the code generation algorithm has
// completed its work.

const modifiedFilesResponse = syncExec({
    cwd: resourceFilePaths.application.appRepoDir,
    command: "git ls-files --modified --deleted --others --exclude-standard"
});

const modifiedFiles = modifiedFilesResponse?modifiedFilesResponse.trim().split("\n"):[];

console.log("\nCode generation complete.\n");

if (!modifiedFiles.length) {
    console.log("No uncommitted application source changes.");
} else {
    console.log(modifiedFiles.length + " application source files modified (modified + deleted + untracked).");
}
