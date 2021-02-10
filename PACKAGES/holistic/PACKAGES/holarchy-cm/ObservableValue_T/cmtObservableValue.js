"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// cmtObservableValue.js
(function () {
  var CellModelTemplate = require("../CellModelTemplate");

  var cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");

  var cellLib = require("./celllib");

  var templateLabel = "ObservableValue";
  var cmtObservableValue = new CellModelTemplate({
    cmasBaseScope: cmasHolarchyCMPackage,
    templateLabel: templateLabel,
    generateCellModelFilterInputSpec: {
      ____label: "".concat(templateLabel, "<X> Specialization Request"),
      ____types: "jsObject",
      valueTypeDescription: {
        ____accept: "jsString"
      },
      valueTypeSpec: {
        ____label: "Value Data Specification",
        ____description: "An @encapsule/arccore.filter specification for the value type to be made observable.",
        ____accept: "jsObject" // This is an @encapsule/arccore.filter specification declaration.

      }
    },
    generateCellModelFilterBodyFunction: function generateCellModelFilterBodyFunction(request_) {
      var response = {
        error: null
      };
      var errors = [];
      var inBreakScope = false;

      while (!inBreakScope) {
        inBreakScope = true;
        var cellMemorySpec = {
          ____types: "jsObject",
          ____defaultValue: {},
          value: _objectSpread({}, request_.generatorRequest.valueTypeSpec),
          revision: {
            ____types: "jsNumber",
            ____defaultValue: -1
          }
        };
        response.result = {
          id: request_.cmtInstance.mapLabels({
            CM: request_.cellModelLabel
          }).result.CMID,
          name: "".concat(templateLabel, "<").concat(request_.cellModelLabel, ">"),
          description: "CellModelTemplate<".concat(templateLabel, "> specialization for CellModel label \"").concat(request_.cellModelLabel, "\"."),
          apm: {
            id: request_.cmtInstance.mapLabels({
              APM: request_.cellModelLabel
            }).result.APMID,
            name: "".concat(templateLabel, "<").concat(request_.cellModelLabel, ">"),
            description: "CellModelTemplate<".concat(templateLabel, "> specialization for CellModel label \"").concat(request_.cellModelLabel, "\"."),
            ocdDataSpec: cellMemorySpec,
            steps: {
              "uninitialized": {
                description: "Default starting process step.",
                transitions: [{
                  transitionIf: {
                    always: true
                  },
                  nextStep: "observable-value-initialize"
                }]
              },
              "observable-value-initialize": {
                description: "ObservableValue is initializing.",
                transitions: [{
                  transitionIf: {
                    holarchy: {
                      cm: {
                        operators: {
                          ocd: {
                            compare: {
                              values: {
                                a: {
                                  value: -1
                                },
                                operator: "<",
                                b: {
                                  path: "#.revision"
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  nextStep: "observable-value-ready"
                }, {
                  transitionIf: {
                    always: true
                  },
                  nextStep: "observable-value-reset"
                }]
              },
              "observable-value-reset": {
                description: "ObservableValue has not yet been written and is in reset process step."
              },
              "observable-value-ready": {
                description: "ObservableValue is ready and processing write action(s)."
              }
            }
          }
        };
        break;
      }

      if (errors.length) {
        response.error = errors.join(" ");
      }

      return response;
    }
  });

  if (!cmtObservableValue.isValid()) {
    throw new Error(cmtObservableValue.toJSON());
  }

  module.exports = cmtObservableValue;
})();