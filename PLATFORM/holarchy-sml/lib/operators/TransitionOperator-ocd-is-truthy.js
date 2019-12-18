"use strict";

var holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.TransitionOperator({
  id: "kD1PcgqYQlm7fJatNG2ZsA",
  name: "OCD Namespace Is Truthy",
  description: "Returns Boolean true iff the indicated OCD namespace is truthy.",
  operatorRequestSpec: {
    ____types: "jsObject",
    holarchy: {
      ____types: "jsObject",
      sml: {
        ____types: "jsObject",
        operators: {
          ____types: "jsObject",
          ocd: {
            ____types: "jsObject",
            isNamespaceTruthy: {
              ____types: "jsObject",
              path: {
                ____accept: "jsString"
              }
            }
          }
        }
      }
    }
  },
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      result: false
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var message = request_.actionRequest.holarchy.sml.operators.ocd.isNamespaceTruthy;
      var fqpath = null;

      if (message.path.startsWith("#")) {
        fqpath = "".concat(request_.context.dataPath).concat(message.path.slice(1));
      } else {
        fqpath = message.path;
      }

      var filterResponse = request_.context.ocdi.readNamespace(fqpath);

      if (filterResponse.error) {
        errors.push(filterRepsonse.error);
        break;
      }

      response.result = filterResponse.result ? true : false;
      break;
    }

    if (errors.length) response.error = errors.join(" ");
    return response;
  }
});