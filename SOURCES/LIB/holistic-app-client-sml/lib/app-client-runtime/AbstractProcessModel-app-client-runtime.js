// AbstractProcessModel-app-client-runtime.js

const holarchy = require("@encapsule/holarchy");
const appClientRuntimeDeclaration = require("./AbstractProcessModel-app-client-runtime-declaration");
module.exports = new holarchy.AbstractProcessModel(appClientRuntimeDeclaration);

