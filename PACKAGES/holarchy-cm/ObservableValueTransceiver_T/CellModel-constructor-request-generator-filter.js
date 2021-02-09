"use strict";

// ObservableValueTransceiver_T/CellModel-constructor-request-generator-filter.js
(function () {
  var arccore = require("@encapsule/arccore");

  var filterDeclaration = {
    operationID: "LIDRqMqRRh6UTAV10uz3Xw",
    operationName: "ObservableValueTransceiver CellModel Factory",
    operationDescription: "A filter than manufactures an ObservableValueTransciever CellModel class instance specialized to a specific value type.",
    inputFilterSpec: {
      ____label: "ObservableValueTransceiver_T::constructor Request",
      ____description: "Specialization options for value type this ObservableValueTransceiver CellModel should be specialized for."
    },
    outputFilterSpec: {
      ____accept: "jsObject" // This is an @encapsule/holarchy CellModel declaration descriptor object.

    },
    bodyFunction: function bodyFunction(request_) {
      var response = {
        error: null
      };
      var errors = [];
      var inBreakScope = false;

      while (!inBreakScope) {
        inBreakScope = true;
        break;
      }

      if (errors.length) {
        response.error = errors.push(" ");
      }

      return response;
    }
  };
  var factoryResponse = arccore.filter.create(filterDeclaration);

  if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
  }

  module.exports = factoryResponse.result;
})();