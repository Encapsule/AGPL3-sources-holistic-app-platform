"use strict";

// ControllerAction-set-boolean-flag.js
var holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.ControllerAction({
  id: "5rFEDGLYRSiZCeChMnkCHQ",
  name: "Set Boolean Flag",
  description: "Sets a Boolean flag in the OCD.",
  actionRequestSpec: {
    ____types: "jsObject",
    holarchy: {
      ____types: "jsObject",
      sml: {
        ____types: "jsObject",
        action: {
          ____types: "jsObject",
          ocd: {
            ____types: "jsObject",
            setBooleanFlag: {
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
  actionResultSpec: {
    ____accept: "jsUndefined"
  },
  // no result
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var message = request_.actionRequest.holarchy.sml.action.ocd.setBooleanFlag;
      var fqpath = null; // TODO: Move this to a library function and do a better job.

      if (message.path.startsWith("#")) {
        fqpath = "".concat(request_.context.dataPath).concat(message.path.slice(1));
      } else {
        fqpath = message.path;
      }

      var ocdResponse = request_.context.ocdi.writeNamespace(fqpath, true);

      if (ocdResponse.error) {
        errors.push(ocdResponse.error);
      }

      break;
    }

    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  } // end bodyFunction

});