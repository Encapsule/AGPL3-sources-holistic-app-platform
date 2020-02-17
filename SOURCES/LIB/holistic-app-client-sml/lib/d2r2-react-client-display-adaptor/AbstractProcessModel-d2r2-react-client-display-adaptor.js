// opm-d2r2-react-processor.js

const holarchy = require("@encapsule/holarchy");
const d2r2ReactClientDisplayAdaptorDeclaration = require("./AbstractProcessModel-d2r2-react-client-display-adaptor-declaration");
module.exports = new holarchy.AbstractProcessModel(d2r2ReactClientDisplayAdaptorDeclaration);

