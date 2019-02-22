// PROJECT/PLATFORM/PACKAGES/index.js
//
// Metadata declarations indexed by full package name used to build holistic platform runtime packages.

const packages = {

    "@encapsule/holarchy": require("./holarchy"),
    "@encapsule/holism": require("./holism"),
    "@encapsule/hrequest": require("./hrequest")


};

module.exports = packages;
