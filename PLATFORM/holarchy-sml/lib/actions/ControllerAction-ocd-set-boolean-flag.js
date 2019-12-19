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
        actions: {
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
      var message = request_.actionRequest.holarchy.sml.actions.ocd.setBooleanFlag;
      var rpResponse = holarchy.ObservableControllerData.dataPathResolve({
        opmBindingPath: request_.context.dataPath,
        dataPath: message.path
      });

      if (rpResponse.error) {
        errors.push(rpResponse.error);
        break;
      }

      var ocdResponse = request_.context.ocdi.writeNamespace(rpResponse.result, true);

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