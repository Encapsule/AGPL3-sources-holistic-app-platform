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

    appClientCellModelFactory: require("./holistic-app-client-factory-filter"),

    cml: require("./HolisticAppClientKernel")
};


