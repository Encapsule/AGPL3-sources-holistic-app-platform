
// @encapsule/holarchy-sml package exports:

const holarchy = require("@encapsule/holarchy");
const packageMeta = require("./package.json");

module.exports = {

    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    cml: new holarchy.CellModel({
        id: "RyMcv3MpTI-Co1EyVOIvlw",
        name: "Holarchy CML",
        description: "Holarchy Cell Model Library (CML) low-level logical, memory, and cellular process primitive operations, actions, and cell models for re-use in higher-order cell models.",
        subcells: [
            require("./lib/HolarchyCore"),
            require("./lib/HolarchyBase")
        ]
    })
};
