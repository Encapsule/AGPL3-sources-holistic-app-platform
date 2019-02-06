#!/usr/bin/env node

const arctools = require('arctools');
const path = require('path');
const fs = require('fs');

const repoBuild = require('../../BUILD/holistic');

const handlebars = arctools.handlebars;
const program = arctools.commander;

program
    .name('generate_package_license')
    .description('Generates LICENSE file from repo build and package DB metadata.')
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

const licenseTemplatePath = path.resolve(__dirname, 'LICENSES', (targetManifest.license + '.hbs'));
const licenseTemplate = fs.readFileSync(licenseTemplatePath).toString('utf-8');
const compiledLicenseTemplate = handlebars.compile(licenseTemplate);

const templateData = {
    CopyrightYear: (new Date(targetManifest.buildTime * 1000).getFullYear()),
    CopyrightHolder: targetManifest.contributors[0].name
};

const licenseDocument = compiledLicenseTemplate(templateData);

const licenseDocumentPath = path.join(program.packageDir, "LICENSE");

fs.writeFileSync(licenseDocumentPath, licenseDocument);

console.log("Wrote '" + licenseDocumentPath + "'.");
