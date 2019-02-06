#!/usr/bin/env node

"use strict";

// Node.js runtime modules
const childProcess = require('child_process'); // Node.js
const fs = require('fs'); // Node.js
const path = require("path"); // Node.js
const mkdirp = require("mkdirp"); // as in UNIX mkdir -p
const arctoolslib = require("arctools"); // Encapsule/arctools package
const arccore = arctoolslib.arccore; // ... Encapsule/arccore is bundled with Encapsule/arctools
const handlebars = arctoolslib.handlebars; // ... handlebars template engine is bundled with Encapsule/arctools

const holisticMetadata = require("../../PLATFORM/holistic");
const holisticPlatformManifest = require("./holistic-platform-manifest");
const holisticPlatformPackagesDB = require("../PLATFORM/PACKAGES");

const holisticAppManifestFilter = require('./LIB/holistic-app-manifest-filter');
const packageMapFilter = require('./LIB/package-map-filter');

// Re-used throughout this script module...
var filterResponse;
var docTemplate;
var document;

// ================================================================
// Common functions

function syncExec(request_) {
    // request_ = { command: string, cwd: string,  }
    // https://stackoverflow.com/questions/30134236/use-child-process-execsync-but-keep-output-in-console
    // return childProcess.execSync(request_.command, { cwd: request_.cwd, stdio: [0,1,2] });
    return childProcess.execSync(request_.command, { cwd: request_.cwd }).toString('utf8').trim();
} // syncExec

function touchFile(filepath_) {
    // filepath_ = string file path (relative to platform package root. or, absolute)
    console.log("> Touch '" + filepath_ + "'");
    return syncExec({
        cwd: resourceFilePaths.holistic.packageDir,
        command: "touch " + filepath_
    });
}

function makeDirectory(directoryPath_) {
    console.log("> Create '" + directoryPath_ + "'");
    mkdirp(directoryPath_);
}

function loadDocumentTemplate(filepath_) {
    const loadResponse = arctoolslib.jsrcFileLoaderSync.request(filepath_);
    if (loadResponse.error) {
        throw new Error(loadResponse.error);
    }
    const documentTemplate = handlebars.compile(loadResponse.result.resource);
    return documentTemplate;
}

// ================================================================

var program = arctoolslib.commander; // command line argument parser framework bundled with Encapsule/arctools

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
        packageWebpackServerRc: path.join(appRepoDir, "webpack.config.app.server.js"),
        packageWebpackClientRc: path.join(appRepoDir, "webpack.config.app.client.js"),

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
const applicationPackageDeprecatedDependencies = filterResponse.result;
console.log("> Read '" + resourceFilePaths.application.packageManifest + "'.");

////
// Load the application's holistic-app.json manifest document.
//
filterResponse = arctoolslib.jsrcFileLoaderSync.request(resourceFilePaths.application.appManifest);
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
        resource: JSON.stringify(filterResponse.result, undefined, 2) + "\n",
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
    delete applicationPackageDeprecatedDependencies[key];
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
    delete applicationPackageDeprecatedDependencies[key];
    newDevDependenciesArray.push({ package: key, semver: holisticPlatformManifest.platformDependencies[key] });
}

// Any package dependency remaining is no longer needed and should be removed.
if (arccore.util.dictionaryLength(applicationPackageDeprecatedDependencies)) {
    console.log("! NOTE: Package dependencies are being removed: '" + JSON.stringify(applicationPackageDeprecatedDependencies) + "'.");
}

////
// Affect removal of deprecated top-level package dependencies from the application
// via yarn in order to force update of the application's yarn.lock (and the correct
// version of the dependency installed in the application's node_modules directory).
// Note that we perform this step prior to overwriting the application's package.json
// in order to get yarn to clean up yarn.lock (as well as removing the deprecated
// package from the application's node_modules directory).
touchFile(path.join(resourceFilePaths.application.appRepoDir, "yarn.lock")); // need this file to exist when bootstrapping new application repo.

for (key in applicationPackageDeprecatedDependencies) {
    console.log("> Removing deprecated application package '" + key + "'...");
    consoleOutput = syncExec({
        cwd: resourceFilePaths.application.appRepoDir,
        command: "yarn remove " + key + " --dev"
    });
    console.log(consoleOutput);
}

newDevDependenciesArray.sort(function(a_, b_) { return (a_.package === b_.package)?0:((a_.package < b_.package)?-1:1) });

var newDevDependencies = {};
newDevDependenciesArray.forEach(function(descriptor_) { newDevDependencies[descriptor_.package] = descriptor_.semver; });

// Set the application's development mode package dependencies.
applicationPackageManifest.devDependencies = newDevDependencies;

// Overwrite values in the application's package.json with values supplied by the
// holistic platform manifest.
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

// Merge/overwrite application's package.json script targets w/holistic platform defaults.
for (key in holisticPlatformManifest.applicationPackageManifest.scripts) {
    applicationPackageManifest.scripts[key] = holisticPlatformManifest.applicationPackageManifest.scripts[key];
}

////
// Overwrite the application's package.json document with the updated version.
filterResponse = arctoolslib.stringToFileSync.request({
    resource: JSON.stringify(applicationPackageManifest, undefined, 2) + "\n",
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
makeDirectory(resourceFilePaths.application.platformSourcesDir);
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
// Affect an upgrade of Encapsule Project packages infused (copied into the versioned sources of the target application).
for (key in holisticPlatformPackagesDB) {
    console.log("> Updgrading single package holistic platform dependency '" + key + "'...");
    consoleOutput = syncExec({
        cwd: resourceFilePaths.application.appRepoDir,
        command: "yarn remove " + key + " --dev"
    });
    console.log(consoleOutput);
    consoleOutput = syncExec({
        cwd: resourceFilePaths.application.appRepoDir,
        command: "yarn add " + "./HOLISTIC/" + key + " --dev"
    });
    console.log(consoleOutput);
} // end for

////
// Create application .gitignore
docTemplate = loadDocumentTemplate(path.resolve(__dirname, "TEMPLATES", "gitignore-template.hbs"));
document = docTemplate(/*context*/);
filterResponse = arctoolslib.stringToFileSync.request({
    path: resourceFilePaths.application.packageGitIgnore,
    resource: document
});
if (filterResponse.error) {
    throw new Error(filterResponse.error);
}
console.log("> Write '" + resourceFilePaths.application.packageGitIgnore + "'.");

////
// Create application .babelrc
docTemplate = loadDocumentTemplate(path.resolve(__dirname, "TEMPLATES", "babelrc-template.hbs"));
document = docTemplate(/*context*/);
filterResponse = arctoolslib.stringToFileSync.request({
    path: resourceFilePaths.application.packageBabelRc,
    resource: document
});
if (filterResponse.error) {
    throw new Error(filterResponse.error);
}
console.log("> Write '" + resourceFilePaths.application.packageBabelRc + "'.");

////
// Create application .eslintrc.js
docTemplate = loadDocumentTemplate(path.resolve(__dirname, "TEMPLATES", "eslintrc-template.hbs"));
document = docTemplate(/*context*/);
filterResponse = arctoolslib.stringToFileSync.request({
    path: resourceFilePaths.application.packageEslintRc,
    resource: document
});
if (filterResponse.error) {
    throw new Error(filterResponse.error);
}
console.log("> Write '" + resourceFilePaths.application.packageEslintRc + "'.");

////
// Create application webpack.config for server.
docTemplate = loadDocumentTemplate(path.resolve(__dirname, "TEMPLATES", "webpack.config.app.server.hbs"));
document = docTemplate(/*context*/);
filterResponse = arctoolslib.stringToFileSync.request({
    path: resourceFilePaths.application.packageWebpackServerRc,
    resource: document
});
if (filterResponse.error) {
    throw new Error(filterResponse.error);
}
console.log("> Write '" + resourceFilePaths.application.packageWebpackServerRc + "'.");

////
// Create application webpackage.config for client.
docTemplate = loadDocumentTemplate(path.resolve(__dirname, "TEMPLATES", "webpack.config.app.client.hbs"));
document = docTemplate(/*context*/);
filterResponse = arctoolslib.stringToFileSync.request({
    path: resourceFilePaths.application.packageWebpackClientRc,
    resource: document
});
if (filterResponse.error) {
    throw new Error(filterResponse.error);
}
console.log("> Write '" + resourceFilePaths.application.packageWebpackClientRc + "'.");

////
// Create application Makefile
docTemplate = loadDocumentTemplate(path.resolve(__dirname, "TEMPLATES", "Makefile-template.hbs"));
document = docTemplate(/*context = {...}*/);
filterResponse = arctoolslib.stringToFileSync.request({
    path: resourceFilePaths.application.packageMakefile,
    resource: document
});
if (filterResponse.error) {
    throw new Error(filterResponse.error);
}
console.log("> Write '" + resourceFilePaths.application.packageMakefile + "'.");


makeDirectory(resourceFilePaths.application.appSourcesDir);
touchFile(path.join(resourceFilePaths.application.appSourcesDir, ".gitkeep"));
makeDirectory(resourceFilePaths.application.appAssetSourcesDir);
touchFile(path.join(resourceFilePaths.application.appAssetSourcesDir, ".gitkeep"));
makeDirectory(resourceFilePaths.application.appCommonSourcesDir);
touchFile(path.join(resourceFilePaths.application.appCommonSourcesDir, ".gitkeep"));
makeDirectory(resourceFilePaths.application.appClientSourcesDir);
touchFile(path.join(resourceFilePaths.application.appClientSourcesDir, ".gitkeep"));
makeDirectory(resourceFilePaths.application.appServerSourcesDir);
touchFile(path.join(resourceFilePaths.application.appServerSourcesDir, ".gitkeep"));

////
// Determine the count of files in the target application repo that are in the
// modified, deleted, or untracked state after the code generation algorithm has
// completed its work.

const modifiedFilesResponse = syncExec({
    cwd: resourceFilePaths.application.appRepoDir,
    command: "git ls-files --modified --deleted --others --exclude-standard"
});

const modifiedFiles = modifiedFilesResponse?modifiedFilesResponse.trim().split("\n"):[];

console.log("\nDone processing application repository '" + resourceFilePaths.application.appRepoDir + "'.\n");

if (!modifiedFiles.length) {
    console.log("YOUR APPLICATION IS ALREADY UP-TO-DATE.\nNO UNCOMMITTED APPLICATION CHANGES.");
} else {
    console.log(modifiedFiles.length + " APPLICATION SOURCE FILES MODIFIED (modified + deleted + untracked).");
}

