// opm-d2r2-react-processor.js

const holarchy = require("@encapsule/holarchy");
const d2r2ReactClientOutputProcessorDeclaration = require("./opm-d2r2-react-client-output-processor-declaration");
module.exports = new holarchy.ObservableProcessModel(d2r2ReactClientOutputProcessorDeclaration);

