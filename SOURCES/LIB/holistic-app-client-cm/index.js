// @encapsule/holistic-app-client/index.js

const packageMeta = require("./package.json");
const holarchy = require("@encapsule/holarchy");

const HolisticAppClientService = require("./HolisticAppClientService");

module.exports = {
    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    // v0.0.48-kyanite
    HolisticAppClientService, // New ES6 class


    appClientCellModelFactory: require("./holistic-app-client-cellmodel-factory-filter"),

    cml: require("./HolisticAppClientKernel")
};


