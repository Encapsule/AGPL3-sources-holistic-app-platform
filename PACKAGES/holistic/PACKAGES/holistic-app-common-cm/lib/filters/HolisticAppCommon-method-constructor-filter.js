"use strict";

// HolonServiceCore-method-constructor-filter.js
var arccore = require("@encapsule/arccore");

(function () {
  var factoryResponse = arccore.filter.create({
    operationID: "P9-aWxR5Ts6AhYSQ7Ymgbg",
    operationName: "HolisticAppCommon::constructor Filter",
    operationDescription: "Validates/normalizes a HolisticAppCommon::constructor function request object and returns the new instance's private state data.",
    inputFilterSpec: require("./iospecs/HolisticAppCommon-method-constructor-filter-input-spec"),
    // This is what you need to pass to new @encapsule/holon-core/HolonCore
    outputFilterSpec: require("./iospecs/HolisticAppCommon-method-constructor-filter-output-spec"),
    // This is the _private instance state of a HolonCore class instance
    bodyFunction: function bodyFunction(request_) {
      return {
        error: null,
        result: {
          test: "fake result"
        }
      };
    }
  });

  if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
  }

  module.exports = factoryResponse.result;
})();