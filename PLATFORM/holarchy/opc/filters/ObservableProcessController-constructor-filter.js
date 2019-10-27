"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var arccore = require("@encapsule/arccore");

var factoryResponse = arccore.filter.create({
  operationID: "XXile9azSHO39alE6mMKsg",
  operationName: "OPC Constructor Request Validator",
  operationDescription: "Filter used to normalize the request descriptor object passed to ObservableProcessController constructor function.",
  inputFilterSpec: {
    ____label: "OPC Constructor Request",
    ____description: "Reqeust descriptor object passed to the constructor of the ObservableProcessController class.",
    ____types: "jsObject",
    id: {
      ____label: "OPC ID",
      ____description: "An IRUT identifier assigned to this specific OPC configuration.",
      ____accept: "jsString"
    },
    name: {
      ____label: "OPC Name",
      ____description: "A short name given to this specific OCP configuration.",
      ____accept: "jsString"
    },
    description: {
      ____label: "OPC Description",
      ____description: "A short descripion of the function and/or role of this OPC configuration.",
      ____accept: "jsString"
    },
    observableControllerDataSpec: {
      ____label: "OCD Filter Spec",
      ____description: "Filter spec defining the structure and OPM binding semantics of the OPCI's shared OPDI store.",
      ____accept: "jsObject"
    },
    observableControllerData: {
      ____label: "OCD Init Data",
      ____description: "Reference to data to be used to construct the OPCI's shared OPDI store.",
      ____opaque: true
    },
    observableProcessModelSets: {
      ____label: "Observable Process Model Sets",
      ____description: "An array of arrays of unique ObservableProcessModel class instances.",
      ____types: "jsArray",
      index: {
        ____label: "Observable Process Model Set",
        ____description: "An array of unique ObservableProcessModel class instances.",
        ____types: "jsArray",
        index: {
          ____label: "ObservableProcesModel",
          ____description: "Reference to a ObservableProcessModel class instance.",
          ____accept: "jsObject"
        }
      }
    },
    // observableProcessModels
    // Transition operator filters are aggregated in an arccore.discrimintor filter for dispatch by the OPC during OPM evaluation.
    transitionOperatorSets: {
      ____label: "Transition Operator Filter Sets",
      ____description: "An array of arrays of unique TransitionOperatorFilter class instances.",
      ____types: "jsArray",
      index: {
        ____label: "Transition Operator Filter Set",
        ____description: "An an array of unique TransitionOperatorFilter class instances.",
        ____types: "jsArray",
        index: {
          ____label: "Transition Operator Filter",
          ____description: "Reference to a previously-instantiated TransitionOperatorFilter class instance.",
          ____accept: "jsObject"
        }
      }
    },
    // transitionOperatorFilters
    // Controller action filters are aggregated in an arccore.discriminator filter for dispatch by the OPC during OPM evaluation. And, in response to external events of interest to OPM's.
    controllerActionSets: {
      ____label: "Controller Action Filter Sets",
      ____description: "An array of arrays of unique ControllerActionFilter class instances.",
      ____types: "jsArray",
      index: {
        ____label: "Controller Action Filter Set",
        ____description: "An array of unique ControllerActionFilter class instances.",
        ____types: "jsArray",
        index: {
          ____label: "Controller Action Filter",
          ____description: "Reference to a previously-instantiated ControllerActionFilter class instance.",
          ____accept: "jsObject"
        }
      } // controllerActionFilters

    }
  },
  // inputFilterSpec
  outputFilterSpec: {
    ____opaque: true
  },
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true; // Note that if no failure occurs in this filter then response.result will be assigned to OPCI this._private namespace.

      var result = {
        opmMap: {},
        ocdSpec: {}
      }; // Populate as we go and assign to response.result iff !response.error.
      // ================================================================
      // Build a map of ObservableControllerModel instances.
      // Note that there's a 1:N relationship between an OPM declaration and an OPM runtime instance.
      // TODO: Confirm that arccore.discriminator correctly rejects duplicates and simplify this logic.

      for (var index0 = 0; index0 < request_.observableProcessModelSets.length; index0++) {
        var modelSet = request_.observableProcessModelSets[index0];

        for (var index1 = 0; index1 < modelSet.length; index1++) {
          var opm = modelSet[index1];
          var opmID = opm.getID();

          if (result.opmMap[opmID]) {
            errors.push("Illegal duplicate ObservableProcessModel identifier '".concat(opmID, "' for model name '").concat(opm.getName(), "' with description '").concat(opm.getDescription(), "'."));
            break;
          }

          result.opmMap[opmID] = opm;
        }

        if (errors.length) {
          break;
        }
      }

      if (errors.length) {
        break;
      }

      console.log("> Inspecting registered OPM..."); // ================================================================
      // Find all the OPM-bound namespaces in the developer-defined controller data spec
      // and synthesize the runtime filter spec to be used for OPMI data my merging the
      // OPM's template spec and the developer-defined spec.
      // Traverse the controller data filter specification and find all namespace declarations containing an OPM binding.

      var opmiSpecPaths = [];
      var namespaceQueue = [{
        lastSpecPath: null,
        specPath: "~",
        specRef: request_.observableControllerDataSpec,
        newSpecRef: result.ocdSpec
      }];

      while (namespaceQueue.length) {
        // Retrieve the next record from the queue.
        var record = namespaceQueue.shift();
        console.log("..... inspecting spec path='".concat(record.specPath, "' ... ")); // For every namespace in the developer-provided spec, create a vertex in the digraph.

        var vertexName = record.specPath; // Determine if the current spec namespace has an OPM binding annotation.
        // TODO: We should validate the controller data spec wrt OPM bindings to ensure the annotation is only made on appropriately-declared non-map object namespaces w/appropriate props...

        var provisionalSpecRef = null;

        if (record.specRef.____appdsl && record.specRef.____appdsl.opm) {
          // Extract the OPM IRUT identifer from the developer-defined OCD spec namespace descriptor ____appdsl annotation.
          var _opmID = record.specRef.____appdsl.opm; // Verify that it's actually an IRUT.

          if (arccore.identifier.irut.isIRUT(_opmID).result) {
            // Save the spec path and opmRef in an array.
            var _opm = result.opmMap[_opmID];
            opmiSpecPaths.push({
              specPath: record.specPath,
              opmRef: _opm
            });
            var opcSpecOverlay = {
              "opc_3TNZytsvQyaYrjV2-L4sLA": {
                ____types: "jsObject",
                ____defaultValue: {}
              }
            };

            var opmSpecOverlay = _opm.getDataSpec();

            provisionalSpecRef = _objectSpread({}, record.specRef, opmSpecOverlay, opcSpecOverlay);
          } // if opm binding
          else {
              console.warn("WANRING: Invalid OPM binding IRUT found while evaluating developer-defined OPC spec path \"".concat(record.specPath, "\"."));
            }
        } // if opm-bound instance
        // Use the provision sepc if defined. Otherwise, continue to process the spec from the queue record.


        var workingSpecRef = provisionalSpecRef ? provisionalSpecRef : record.specRef; // Evaluate the properties of the current namespace descriptor in the workingSpec.

        var vertexProperty = {};
        var keys = Object.keys(workingSpecRef);

        while (keys.length) {
          var key = keys.shift();

          if (key.startsWith("____")) {
            record.newSpecRef[key] = workingSpecRef[key];
          } else {
            record.newSpecRef[key] = {};
            namespaceQueue.push({
              lastSpecPath: record.specPath,
              specPath: "".concat(record.specPath, ".").concat(key),
              specRef: workingSpecRef[key],
              newSpecRef: record.newSpecRef[key]
            });
          }
        }
      } // while namespaceQueue.length
      // ================================================================
      // Finish up if no error(s).


      if (!errors.length) {
        response.result = _objectSpread({
          request_: request_
        }, result);
      }
    } // !inBreakScope


    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  } // bodyFunction
  // request descriptor object

});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;