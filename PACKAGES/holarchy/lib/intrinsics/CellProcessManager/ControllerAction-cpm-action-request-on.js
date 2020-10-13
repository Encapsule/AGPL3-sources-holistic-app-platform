"use strict";

// ControllerAction-cpm-aciton-request-on.js
var ControllerAction = require("../../../ControllerAction");

var ObservableControllerData = require("../../../lib/ObservableControllerData");

var cpmLib = require("./lib");

var controllerAction = new ControllerAction({
  id: "wB5QKMYtS7yY2-v7Y3tGWA",
  name: "Cell Process Manager: ControllerAction Request On Cell (actOn)",
  description: "Generically re-routes the ControllerAction request specified by actRequest to the active cell specified by apmBindingPath + path, or path (iff path is fully-qualified).",
  actionRequestSpec: {
    ____types: "jsObject",
    holarchy: {
      ____types: "jsObject",
      CellProcessor: {
        ____types: "jsObject",
        actOn: {
          ____types: "jsObject",
          cellPath: {
            ____accept: "jsString",
            ____defaultValue: "#"
          },
          cellProcessCoordinates: {
            ____types: ["jsUndefined", "jsObject"],
            apmID: {
              ____accept: "jsString"
            },
            instanceName: {
              ____accept: "jsString",
              ____defaultValue: "singleton"
            }
          },
          cellProcessID: {
            ____accept: ["jsUndefined", "jsString"]
          },
          actionRequest: {
            ____accept: "jsObject"
          }
        }
      }
    }
  },
  actionResultSpec: {
    ____opaque: true // The response.result returned by the ControllerAction that processed the re-routed actRequest is returned w/out inspection.

  },
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var messageBody = request_.actionRequest.holarchy.CellProcessor.actOn;
      var targetCellPath = messageBody.cellPath;

      if (messageBody.cellProcessCoordinates && messageBody.cellProcessID) {
        errors.push("Please specify either cellProcessCoordinates or cellProcessID (both are set indicating a problem).");
        break;
      }

      if (messageBody.cellProcessCoordinates) {
        var cpmLibResponse = cpmLib.resolveCellProcessCoordinates.request({
          cellProcessCoordinates: messageBody.cellProcessCoordinates,
          ocdi: request_.context.ocdi
        });

        if (cpmLibResponse.error) {
          errors.push(cpmResponse.error);
          break;
        }

        targetCellPath = cpmLibResponse.result.cellProcessPath;
      } else if (messageBody.cellID) {
        errors.push("NOT SUPPORTED YET!");
        break;
      }

      var ocdResponse = ObservableControllerData.dataPathResolve({
        dataPath: targetCellPath,
        apmBindingPath: request_.context.apmBindingPath
      });

      if (ocdResponse.error) {
        errors.push(ocdResponse.error);
        break;
      }

      targetCellPath = ocdResponse.result;
      var actResponse = request_.context.act({
        actorName: "Cell Process Manager: actOn",
        actorTaskDescription: "Delegating ControllerAction request to cell at path '".concat(targetCellPath, "'."),
        actionRequest: messageBody.actionRequest,
        apmBindingPath: targetCellPath
      });

      if (actResponse.error) {
        errors.push("We were not able to delegate your ControllerAction request due to error:");
        errors.push(actResponse.error);
        break;
      }

      response.result = actResponse.result.actionResult;
      break;
    }

    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  }
});

if (!controllerAction.isValid()) {
  throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;