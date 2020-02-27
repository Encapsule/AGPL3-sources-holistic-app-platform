// PROJECT/PLATFORM/PACKAGES/index.js
//
// Metadata declarations indexed by full package name used to build holistic platform runtime packages.

const packages = {
    "@encapsule/hash-router": require("./hash-router"),
    "@encapsule/holarchy": require("./holarchy"),
    "@encapsule/holarchy-cm": require("./holarchy-cm"),
    "@encapsule/holism": require("./holism"),
    "@encapsule/holism-metadata": require("./holism-metadata"),
    "@encapsule/holism-services": require("./holism-services"),
    "@encapsule/holistic": require("./holistic"),
    "@encapsule/holistic-app-client-cm": require("./holistic-app-client-cm"),
    "@encapsule/holistic-app-server-cm": require("./holistic-app-server-cm"),
    "@encapsule/holodeck": require("./holodeck"),
    "@encapsule/holodeck-assets": require("./holodeck-assets"),
    "@encapsule/hrequest": require("./hrequest"),
    "@encapsule/d2r2" : require("./d2r2"),
    "@encapsule/d2r2-components": require("./d2r2-components")
};

module.exports = packages;
