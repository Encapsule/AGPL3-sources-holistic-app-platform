"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// cmt-method-constructor-filter.js
(function () {
  var arccore = require("@encapsule/arccore");

  var holarchy = require("@encapsule/holarchy");

  var cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");

  var factoryResponse = arccore.filter.create({
    operationID: cmasHolarchyCMPackage.mapLabels({
      OTHER: "CellModelTemplate::constructor Filter"
    }).result.OTHERID,
    operationName: "CellModelTemplate::constructor Filter",
    operationDescription: "Processes the request value passed to CellModelTemplate::constructor function.",
    inputFilterSpec: require("./iospecs/cmt-method-constructor-input-spec"),
    outputFilterSpec: {
      // WIP
      ____types: "jsObject",
      spaceLabel: {
        ____accept: "jsString"
      },
      cellModelGeneratorFilter: {
        ____accept: "jsObject"
      } // This will be an @encapsule/arccore.filter object.

    },
    bodyFunction: function bodyFunction(templateConstructorRequest_) {
      var response = {
        error: null
      };
      var errors = [];
      var inBreakScope = false;

      while (!inBreakScope) {
        inBreakScope = true;
        var cmasBaseScope = templateConstructorRequest_.cmasBaseScope instanceof holarchy.CellModelArtifactSpace ? templateConstructorRequest_.cmasBaseScope : new holarchy.CellModelArtifactSpace(templateConstructorRequest_.cmasBaseScope);

        if (!cmasBaseScope.isValid()) {
          errors.push(cmasBaseScope.toJSON());
          break;
        }

        var cmasInstanceScope = cmasBaseScope.makeSubspaceInstance({
          spaceLabel: templateConstructorRequest_.templateLabel
        });

        if (!cmasInstanceScope.isValid()) {
          errors.push(cmasInstanceScope.toJSON());
          break;
        }

        var templateLabel = "CellModelTemplate<".concat(templateConstructorRequest_.templateLabel, ">");
        var cellModelTemplateSynthMethodLabel = "".concat(templateLabel, "::synthesizeCellModel");
        var cellModelGeneratorFilterLabel = "".concat(templateLabel, "::cellModelGeneratorFilter");
        var factoryResponse2 = arccore.filter.create({
          operationID: cmasHolarchyCMPackage.mapLabels({
            OTHER: cellModelGeneratorFilterLabel
          }).result.OTHERID,
          operationName: cellModelGeneratorFilterLabel,
          operationDescription: "Processes the request value passed from ".concat(cellModelTemplateSynthMethodLabel, " method."),
          inputFilterSpec: {
            ____label: "".concat(cellModelGeneratorFilterLabel, " Request"),
            ____description: "A request descriptor object specifying the CellModelTemplate-instance-specific specializations to be used to synthesize a new CellModel.",
            ____types: "jsObject",
            cmtInstance: {
              ____label: "".concat(templateLabel, " Instance Reference"),
              ____accept: "jsObject" // This will be a pointer to CellModelTemplate::synthesizeCellModel method's this

            },
            cellModelLabel: {
              ____label: "".concat(templateLabel, " Instance Label"),
              ____description: "A unique and stable label (no spaces, legal JavaScript variable name token) that refers to specialization of of CellModel to be synthesized via this call to CellModelTemplate::synthesizeCellModel method.",
              ____accept: "jsString" // Note that cellModelLabel is used to call CellModelTemplate.mapLabels method (inherited from CellModelArtifactSpace) and is used e.g. as the value passed { CM: cellModelLabel, APM: cellModelLabel ... }

            },
            generatorRequest: _objectSpread(_objectSpread({}, templateConstructorRequest_.generateCellModelFilterInputSpec), {}, {
              ____label: "".concat(templateLabel, " Generator Request"),
              ____description: "Specific instructions to ".concat(cellModelGeneratorFilterLabel, " about how to build a new CellModel instance.")
            })
          },
          outputFilterSpec: _objectSpread(_objectSpread({}, holarchy.appTypes.CellModel.constructorRequest), {}, {
            ____label: "CellModelTemplate::synthesizeCellModel Result",
            ____description: "A @encapsule/holarchy CellModel::constructor request descriptor object synthesized by this filter."
          }),
          bodyFunction: function bodyFunction(generateCellModelRequest_) {
            var response = {
              error: null
            };
            var errors = [];
            var inBreakScope = false;

            while (!inBreakScope) {
              inBreakScope = true;

              try {
                var innerResponse = templateConstructorRequest_.generateCellModelFilterBodyFunction(generateCellModelRequest_);

                if (innerResponse.error) {
                  errors.push(innerResponse.error);
                  break;
                }

                response.result = innerResponse.result;
              } catch (exception_) {
                errors.push(exception_.message);
                break;
              }

              break;
            }

            if (errors.length) {
              response.error = errors.join(" ");
            }

            return response;
          }
        });

        if (factoryResponse2.error) {
          errors.push(factoryResponse2.error);
          break;
        }

        var cellModelGeneratorFilter = factoryResponse2.result;
        response.result = {
          spaceLabel: cmasInstanceScope.getArtifactSpaceLabel(),
          cellModelGeneratorFilter: cellModelGeneratorFilter
        };
        break;
      }

      if (errors.length) {
        response.error = errors.join(" ");
      }

      return response;
    }
  });

  if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
  }

  module.exports = factoryResponse.result;
})();