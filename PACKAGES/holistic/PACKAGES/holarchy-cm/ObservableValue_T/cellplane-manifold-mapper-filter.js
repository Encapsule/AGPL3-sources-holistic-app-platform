"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// ObservableValue_T/artifact-space-mapping-filter.js
(function () {
  var arccore = require("@encapsule/arccore");

  var artifactSpaceRootLabel = "ipdXRMZHQSOO1w54nPGeZQ";
  var filterDeclaration = {
    operationID: "Z3quv46iTK6xPNwcLjAunQ",
    operationName: "ObservableValue_T Artifact Space Mapper",
    operationDescription: "Converts coordinate values germane to keeping track of different specializations of ObservableValue_T into a cellID and apmID tuple.",
    inputFilterSpec: {
      ____types: "jsObject",
      ____defaultValue: {},
      CM: {
        ____accept: ["jsUndefined", "jsString"]
      },
      APM: {
        ____accept: ["jsUndefined", "jsString"]
      },
      ACT: {
        ____accept: ["jsUndefined", "jsString"]
      },
      TOP: {
        ____accept: ["jsUndefined", "jsString"]
      }
    },
    outputFilterSpec: {
      ____label: "Artifact Space Mapping",
      ____types: "jsObject",
      CM: {
        ____accept: ["jsUndefined", "jsString"]
      },
      CMID: {
        ____accept: ["jsUndefined", "jsString"]
      },
      APM: {
        ____accept: ["jsUndefined", "jsString"]
      },
      APMID: {
        ____accept: ["jsUndefined", "jsString"]
      },
      ACT: {
        ____accept: ["jsUndefined", "jsString"]
      },
      ACTID: {
        ____accept: ["jsUndefined", "jsString"]
      },
      TOP: {
        ____accept: ["jsUndefined", "jsString"]
      },
      TOPID: {
        ____accept: ["jsUndefined", "jsString"]
      }
    },
    bodyFunction: function bodyFunction(request_) {
      return {
        error: null,
        result: _objectSpread(_objectSpread({}, request_), {}, {
          CMID: request_.CM ? arccore.identifier.irut.fromReference("".concat(artifactSpaceRootLabel, ".CellModel.").concat(request_.CM)).result : undefined,
          APMID: request_.APM ? arccore.identifier.irut.fromReference("".concat(artifactSpaceRootLabel, ".CellModel.").concat(request_.APM)).result : undefined,
          ACTID: request_.ACT ? arccore.identifier.irut.fromReference("".concat(artifactSpaceRootLabel, ".CellModel.").concat(request_.ACT)).result : undefined,
          TOPID: request_.TOP ? arccore.identifier.irut.fromReference("".concat(artifactSpaceRootLabel, ".CellModel.").concat(request_.TOP)).result : undefined
        })
      };
    }
  };
  var factoryResponse = arccore.filter.create(filterDeclaration);

  if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
  }

  module.exports = factoryResponse.result;
})();