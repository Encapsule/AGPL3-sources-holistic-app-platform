"use strict";

var _CellModel;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// SOURCES/LIB/holarchy/lib/intrinsics/CellProcessProxy/index.js
var CellModel = require("../../../CellModel");

var cellModel = new CellModel((_CellModel = {
  id: "LG9CCSEmSYaU6Mp9J0wZ5g",
  name: "Holarchy Cell Process Proxy Helper Model",
  description: "Defines a helper model that functions as a proxy for action and operator calls to some (any) shared cell process."
}, _defineProperty(_CellModel, "description", ""), _defineProperty(_CellModel, "apm", {
  id: "CPPU-UPgS8eWiMap3Ixovg",
  name: "Holarchy Cell Process Proxy Helper Process",
  description: "Defines a helper process that functions as a proxy for action and operator calls to some (any) shared cell process.",
  ocdDataSpec: {
    ____types: "jsObject",
    "CPPU-UPgS8eWiMap3Ixovg_CellProcessProxy": {
      ____types: "jsObject",
      ____defaultValue: {},
      lcpBindingRequest: {
        ____types: ["jsUndefined", "jsObject"],
        apmID: {
          ____accept: "jsString"
        },
        instanceName: {
          ____accept: "jsString"
        },
        proxyOwner: {
          ____accept: "jsString"
        }
      },
      lcpBindingResponse: {
        ____types: ["jsUndefined", "jsObject"],
        error: {
          ____accept: ["jsNull", "jsString"]
        },
        result: {
          ____types: ["jsUndefined", "jsObject"],
          lcpBindingPath: {
            ____accept: "jsString"
          }
        }
      }
    }
  },
  // ocdDataSpec
  steps: {
    uninitialized: {
      description: "Default cell process step.",
      transitions: [{
        transitionIf: {
          always: true
        },
        nextStep: "ready"
      }]
    },
    ready: {
      description: "The cell process proxy helper process is constructed and ready to accept action and operator requests."
    }
  }
}), _defineProperty(_CellModel, "actions", [require("./ControllerAction-cpp-proxy-action"), require("./ControllerAction-cpp-proxy-connect"), require("./ControllerAction-cpp-proxy-disconnect")]), _defineProperty(_CellModel, "operators", [require("./TransitionOperator-cpp-proxy-operator")]), _defineProperty(_CellModel, "subcells", []), _CellModel));

if (!cellModel.isValid()) {
  throw new Error(cellModel.toJSON());
}

module.exports = cellModel;