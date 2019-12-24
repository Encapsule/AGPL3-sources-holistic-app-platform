"use strict";

// opm-d2r2-react-processor.js
var holarchy = require("@encapsule/holarchy");

var d2r2ReactClientOutputProcessorDeclaration = require("./opm-d2r2-react-client-output-processor-declaration");

module.exports = new holarchy.ObservableProcessModel(d2r2ReactClientOutputProcessorDeclaration);