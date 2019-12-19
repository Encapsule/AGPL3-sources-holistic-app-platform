"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var arccore = require("@encapsule/arccore");

var holodeck = require("@encapsule/holodeck");

var holodeckPackageHarnesses = require("../holodeck/harnesses");

var holodeckPackageVectorSets = require("./holodeck-package-tests/vector-sets");

var holarchyPackageHarnesses = require("../holarchy/harnesses");

var holarchyPackageVectorSets = require("./holarchy-package-tests/vector-sets");

var factoryResponse = arccore.filter.create({
  operationID: "Ga_AZ-2HSHuB0uJ9l6n3Uw",
  operationName: "Holistic Test Runner Generator",
  operationDescription: "Filter that accepts config options and returns an @encapsule/holodeck runner filter instance.",
  inputFilterSpec: {
    ____label: "Holistic Test Runner Generator Request",
    ____description: "A request descriptor object containing config options.",
    ____types: "jsObject",
    logsDirectory: {
      ____label: "Holodeck Logs Directory",
      ____description: "Fully-qualified local filesystem path of the holodeck eval logs directory.",
      ____accept: "jsString"
    }
  },
  outputFilterSpec: {
    ____label: "Holistic Platform Holodeck Runner Filter",
    ____accept: "jsObject"
  },
  bodyFunction: function bodyFunction(request_) {
    // HOLODECK TEST RUNNER DEFINITION
    var runnerResponse = holodeck.runnerFilter.request({
      id: "TxK2RjDjS2mQLkm_N8b6_Q",
      name: "Holistic Platform Test Vectors",
      description: "A suite of test vectors for exploring and confirming the behaviors of Encapsule Project holistic app platform libraries.",
      logsRootDir: request_.logsDirectory,
      testHarnessFilters: [].concat(_toConsumableArray(holodeckPackageHarnesses), _toConsumableArray(holarchyPackageHarnesses)),
      testRequestSets: [].concat(_toConsumableArray(holodeckPackageVectorSets), _toConsumableArray(holarchyPackageVectorSets))
    });

    if (runnerResponse.error) {
      console.error("! Test runner returned an error: '".concat(runnerResponse.error, "'"));
    } else {
      console.log("Complete.");
    }
  }
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;