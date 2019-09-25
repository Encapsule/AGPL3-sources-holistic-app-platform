// PROJECT/PLATFORM/PACKAGES/index.js
//
// Metadata declarations indexed by full package name used to build holistic platform runtime packages.

const packages = {

    "@encapsule/holarchy": require("./holarchy"),
    "@encapsule/holism": require("./holism"),
    "@encapsule/holism-services": require("./holism-services"),
    "@encapsule/hrequest": require("./hrequest"),
    "@encapsule/d2r2" : require("./d2r2"),
    "@encapsule/d2r2-components": require("./d2r2-components")

};

module.exports = packages;
