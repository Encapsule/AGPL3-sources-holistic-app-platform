// PROJECT/PLATFORM/PACKAGES/index.js
//
// Metadata declarations indexed by full package name used to build holistic platform runtime packages.

const packages = {
    "@encapsule/holarchy": require("./holarchy"),
    "@encapsule/holarchy-cm": require("./holarchy-cm"),
    "@encapsule/holism": require("./holism"),
    "@encapsule/holism-metadata": require("./holism-metadata"),
    "@encapsule/holism-services": require("./holism-services"),
    "@encapsule/holistic": require("./holistic"),
    "@encapsule/holistic-html5-service": require("./holistic-html5-service"),
    "@encapsule/holistic-nodejs-service": require("./holistic-nodejs-service"),
    "@encapsule/holistic-service-core": require("./holistic-service-core"),
    "@encapsule/holodeck": require("./holodeck"),
    "@encapsule/holodeck-assets": require("./holodeck-assets"),
    "@encapsule/hrequest": require("./hrequest"),
    "@encapsule/d2r2" : require("./d2r2"),
    "@encapsule/d2r2-components": require("./d2r2-components")
};

module.exports = packages;
