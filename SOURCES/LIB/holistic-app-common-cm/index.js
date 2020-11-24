// @encapsule/holistic-app-common-cm/index.js

const packageMeta = require("./package.json");
const holarchy = require("@encapsule/holarchy");

const HolisticAppCommonService = require("./HolisticAppCommonService");


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
    HolisticAppCommonService, // New ES6 class



    appCommonKernelCellModelFactory: require("./holistic-app-common-cellmodel-factory-filter"),

    // CellModel Library (cml)
    cml: require("./HolisticAppCommonKernel")

};


