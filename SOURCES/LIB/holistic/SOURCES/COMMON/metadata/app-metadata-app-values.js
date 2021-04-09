// app-metadata-app-values.js

const appBuildManifest = require("../../app-build");

module.exports = {
    name: appBuildManifest.app.name,
    description: appBuildManifest.app.description,
    build: appBuildManifest
};

