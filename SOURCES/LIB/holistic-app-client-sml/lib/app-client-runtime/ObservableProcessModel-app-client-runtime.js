// ObservableProcessModel-app-client-runtime.js

const holarchy = require("@encapsule/holarchy");
const appClientRuntimeDeclaration = require("./ObservableProcessModel-app-client-runtime");
module.exports = new holarchy.ObservableProcessModel(appClientRuntimeDeclaration);

