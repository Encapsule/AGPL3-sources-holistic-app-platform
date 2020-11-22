// @encapsule/holistic-app-common-cm/index.js

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

    // CellModel Library (cml)
    cml: require("./HolisticAppCommonKernel")

};


