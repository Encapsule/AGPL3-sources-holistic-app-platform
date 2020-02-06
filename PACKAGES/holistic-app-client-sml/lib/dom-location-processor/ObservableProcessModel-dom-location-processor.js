"use strict";

// ObservableProcessModel-dom-location-processor.js
var holarchy = require("@encapsule/holarchy");

var domLocationProcessorDeclaration = require("./ObservableProcessController-dom-location-processor-declaration");

module.exports = new holarchy.ObservableProcessModel(domLocationProcessorDeclaration);