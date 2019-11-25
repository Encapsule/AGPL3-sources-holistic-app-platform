// PROJECT/PLATFORM/PACKAGES/index.js
//
// Metadata declarations indexed by full package name used to build holistic platform runtime packages.

const packages = {
    "@encapsule/hash-router": require("./hash-router"),
    "@encapsule/holarchy": require("./holarchy"),
    "@encapsule/holarchy-sml": require("./holarchy-sml"),
    "@encapsule/holism": require("./holism"),
    "@encapsule/holism-metadata": require("./holism-metadata"),
    "@encapsule/holism-services": require("./holism-services"),
    "@encapsule/holodeck": require("./holodeck"),
    "@encapsule/holodeck-assets": require("./holodeck-assets"),
    "@encapsule/hrequest": require("./hrequest"),
    "@encapsule/d2r2" : require("./d2r2"),
    "@encapsule/d2r2-components": require("./d2r2-components")
};

module.exports = packages;
