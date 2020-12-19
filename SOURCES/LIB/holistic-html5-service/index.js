// @encapsule/holistic-app-client/index.js

const packageMeta = require("./package.json");
const holarchy = require("@encapsule/holarchy");

module.exports = {
    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    // v0.0.48-spectrolite
    HolisticHTML5Service: require("./HolisticAppClient"), // New ES6 class

    // App-level service logic may (e.g.) call this function upon receipt of 'error' lifecycle action request from the tab service kernel.
    displayServiceException: require("./lib/holistic-tab-service-exception-display")

};


