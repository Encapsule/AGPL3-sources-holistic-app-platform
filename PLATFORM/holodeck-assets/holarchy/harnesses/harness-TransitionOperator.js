"use strict";

var holodeck = require("@encapsule/holodeck");

var holarchy = require("@encapsule/holarchy");

var factoryResponse = holodeck.harnessFactory.request({
  id: "X2q-YtvCTrWx7csHq8R8Tw",
  name: "TranisitionOperator Harness",
  description: "Constructs an instance of ES6 class TransitionOperator that is serialized and passed back as response.result.",
  // idempotent
  testVectorRequestInputSpec: {
    ____types: "jsObject",
    holistic: {
      ____types: "jsObject",
      holarchy: {
        ____types: "jsObject",
        TranistionOperator: {
          ____types: "jsObject",
          constructorRequest: {
            ____opaque: true
          }
        }
      }
    }
  },
  // testVectorRequestInputSpec
  testVectorResultOutputSpec: {
    ____accept: "jsObject" // TODO tighten this up

  },
  // testVectorResultOutputSpec
  harnessBodyFunction: function harnessBodyFunction(request_) {
    var messageBody = request_.holistic.holarchy.TransitionOperator;
    var transitionOperator = new holarchy.TransitionOperator(messageBody.constructorRequest);
    var response = {
      error: null,
      result: {
        isValid: transitionOperator.isValid(),
        toJSON: transitionOperator.toJSON()
      }
    };
    return response;
  } // harnessBodyFunction

});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;