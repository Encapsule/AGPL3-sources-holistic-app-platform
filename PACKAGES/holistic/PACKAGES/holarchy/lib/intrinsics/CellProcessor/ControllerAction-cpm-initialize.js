"use strict";

// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-initialize.js
var ControllerAction = require("../../ControllerAction");

var controllerAction = new ControllerAction({
  id: "VNaA0AMsTXawb32xLaNGTA",
  name: "Cell Process Manager: Initialize",
  description: "Performs initialization of Cell Process Manager cell process (the root and parent process of all cell processes executing in a CellProcess runtime host instance).",
  actionRequestSpec: {
    ____types: "jsObject",
    holarchy: {
      ____types: "jsObject",
      CellProcessor: {
        ____types: "jsObject",
        initialize: {
          ____types: "jsObject",
          options: {
            ____accept: ["jsUndefined", "jsObject"]
          }
        }
      }
    }
  },
  // actionRequestSpec
  actionResultSpec: {
    ____accept: "jsUndefined"
  },
  // calling this action returns no result whatsoever
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      console.log("Cell Process Manager process initializing...");
      break;
    }

    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  } // bodyFunction

});

if (!controllerAction.isValid()) {
  throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;