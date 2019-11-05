"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var arccore = require("@encapsule/arccore");

var ObservableControllerData = require("../ObservableControllerData");

var ocdRuntimeSpecAspects = require("./iospecs/ocd-runtime-spec-aspects");

var opcMethodConstructorInputSpec = require("./iospecs/opc-method-constructor-input-spec");

var opcMethodConstructorOutputSpec = require("./iospecs/opc-method-constructor-output-spec");

var factoryResponse = arccore.filter.create({
  operationID: "XXile9azSHO39alE6mMKsg",
  operationName: "OPC Constructor Request Processor",
  operationDescription: "Filter used to normalize the request descriptor object passed to ObservableProcessController constructor function.",
  inputFilterSpec: opcMethodConstructorInputSpec,
  outputFilterSpec: opcMethodConstructorOutputSpec,
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null
    };
    var errors = [];
    var inBreakScope = false;
    var filterResponse;

    var _loop = function _loop() {
      inBreakScope = true; // Note that if no failure occurs in this filter then response.result will be assigned to OPCI this._private namespace.

      var result = {
        // meta
        id: null,
        iid: null,
        name: null,
        description: null,
        opmMap: {},
        ocdTemplateSpec: null,
        ocdRuntimeSpec: {},
        opmiSpecPaths: [],
        ocdi: null,
        operatorDispatcher: null,
        actionDispatcher: null,
        evalCount: 0,
        lastEvalResponse: null,
        opcActorStack: []
      }; // Populate as we go and assign to response.result iff !response.error.
      // Before we even get started, confirm that that the ID is valid.
      // And, take care of defaulting name and description (that depends on id
      // so that's why we don't use ____defaultValue)

      if (request_.id === "demo") {
        result.id = arccore.identifier.irut.fromEther();
      } else {
        filterResponse = arccore.identifier.irut.isIRUT(request_.id);

        if (filterResponse.error) {
          errors.push(filterResponse.error);
          return "break";
        }

        if (!filterResponse.result) {
          errors.push("Please supply a valid IRUT. Or, use the special 'demo' keyword to have a one-time-use random IRUT assigned.");
          errors.push(filterResponse.guidance);
          return "break";
        }

        result.id = request_.id;
      }

      result.iid = arccore.identifier.irut.fromEther(); // Considered unlikey to fail so just returns the IRUT string.

      result.name = request_.name ? request_.name : "Unnamed OPC";
      result.description = request_.descriptor ? request_.descriptor : "Undescribed OPC"; // ================================================================
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
        return "break";
      } // Save the normalized copy of the dev-specified ocdTemplateSpec. This is useful to developers.


      result.ocdTemplateSpec = request_.ocdTemplateSpec;
      console.log("> Analyzing OCD template spec and model registrations..."); // ================================================================
      // Find all the OPM-bound namespaces in the developer-defined controller data spec
      // and synthesize the runtime filter spec to be used for OPMI data my merging the
      // OPM's template spec and the developer-defined spec.
      // Traverse the controller data filter specification and find all namespace declarations containing an OPM binding.

      var ocdRuntimeBaseSpec = _objectSpread({
        ____label: "OPC [".concat(result.id, "::").concat(result.name, "] Observable Controller Data Store"),
        ____description: "OPC [".concat(result.id, "::").concat(result.name, "] system process runtime state data managed by OPC instance.")
      }, ocdRuntimeSpecAspects.aspects.opcProcessStateRootOverlaySpec);

      var keys = Object.keys(request_.ocdTemplateSpec);

      while (keys.length) {
        var key = keys.shift();

        if (key.startsWith("____")) {
          continue;
        }

        ocdRuntimeBaseSpec[key] = request_.ocdTemplateSpec[key];
      }

      var namespaceQueue = [{
        lastSpecPath: null,
        specPath: "~",
        specRef:
        /*request_.ocdTemplateSpec*/
        ocdRuntimeBaseSpec,
        newSpecRef: result.ocdRuntimeSpec
      }];

      while (namespaceQueue.length) {
        // Retrieve the next record from the queue.
        var record = namespaceQueue.shift();
        console.log("..... inspecting spec path='".concat(record.specPath, "' ... ")); // Determine if the current spec namespace has an OPM binding annotation.
        // TODO: We should validate the controller data spec wrt OPM bindings to ensure the annotation is only made on appropriately-declared non-map object namespaces w/appropriate props...

        var provisionalSpecRef = null;

        if (record.specRef.____appdsl && record.specRef.____appdsl.opm) {
          // Extract the OPM IRUT identifer from the developer-defined OCD spec namespace descriptor ____appdsl annotation.
          var _opmID = record.specRef.____appdsl.opm; // Verify that it's actually an IRUT.

          if (arccore.identifier.irut.isIRUT(_opmID).result) {
            // Save the spec path and opmRef in an array.
            var _opm = result.opmMap[_opmID];
            result.opmiSpecPaths.push({
              specPath: record.specPath,
              opmiRef: _opm
            });
            var opcSpecOverlay = {
              ____types: "jsObject"
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

        var _keys = Object.keys(workingSpecRef);

        while (_keys.length) {
          var _key = _keys.shift();

          if (_key.startsWith("____")) {
            record.newSpecRef[_key] = workingSpecRef[_key];
          } else {
            record.newSpecRef[_key] = {};
            namespaceQueue.push({
              lastSpecPath: record.specPath,
              specPath: "".concat(record.specPath, ".").concat(_key),
              specRef: workingSpecRef[_key],
              newSpecRef: record.newSpecRef[_key]
            });
          }
        }
      } // while namespaceQueue.length


      if (errors.length) {
        errros.unshift("While synthesizing OCD runtime spec:");
        return "break";
      }

      console.log("> OCD runtime spec synthesized."); // ================================================================
      // Construct the contained Observable Controller Data that the OPC instance uses to manage the state associated with OPM instances.
      // TODO: OCD constructor function still throws. We're hiding that here. Convert it over to report construction errors on method access
      // just like OPC. In hindsight, I wanted to provide a nice ES6 class API for OPC w/out having to explain the reason why you don't
      // use operator new but instead call a createInstance factory method. With delayed report of construction error, we get the best of
      // both world's. Construct OPC correctly, it just works like a standard ES6 class instance. Construct it incorrectly, you get a stillborn
      // instance that will only give you a copy of its death certificate.

      try {
        console.log("> Initialzing OPC instance process state using OCD runtime spec and developer-defined OCD init data.");
        result.ocdi = new ObservableControllerData({
          spec: result.ocdRuntimeSpec,
          data: request_.ocdInitData
        });
      } catch (exception_) {
        errors.push("Unfortunately we could not construct the contained OCD instance due to an error.");
        errors.push("Typically you will encounter this sort of thing when you are working on your ocd template spec and/or your ocd init data and get out of sync.");
        errors.push("OCD is deliberately _very_ picky. Luckily, it's also quite specific about its objections. Sort through the following and it will lead you to your error.");
        errors.push(exception_.message);
        return "break";
      }

      console.log("> OPC instance process state initialized."); // ================================================================
      // Build an arccore.discriminator filter instance to route transition
      // operatror request messages to a registered transition operator
      // filter for processing.

      var transitionOperatorFilters = []; // Flatten the array of array of TransitionOperator classes and extract their arccore.filter references.

      console.log("> Analyzing registered TransitionOperator class instances...");
      request_.transitionOperatorSets.forEach(function (transitionOperatorSet_) {
        transitionOperatorSet_.forEach(function (transitionOperatorInstance_) {
          transitionOperatorFilters.push(transitionOperatorInstance_.getFilter());
        });
      });

      if (transitionOperatorFilters.length >= 2) {
        filterResponse = arccore.discriminator.create({
          // TODO: At some point we will probably switch this is force resolution of the target filter ID
          // add another layer of detail to the evaluation algorithm. (we would like to know the ID of the
          // transition operator filters that are called and we otherwise do not know this because it's
          // not encoded obviously in a transition operator's request.
          options: {
            action: "routeRequest"
          },
          filters: transitionOperatorFilters
        });

        if (filterResponse.error) {
          errors.push(filterRepsonse.error);
          return "break";
        }

        result.transitionDispatcher = filterResponse.result;
        console.log("> OPC instance transition operator request dispatched initialized.");
      } else {
        console.warn("WARNING: No TransitionOperator class instances have been registered!"); // Register a dummy discriminator.

        result.transitionDispatcher = {
          request: function request() {
            return {
              error: "No TransitionOperator class instances registered!"
            };
          }
        };
      } // ================================================================
      // Build an arccore.discrimintor filter instance to route controller
      // action request messages to a registitered controller action filter
      // for processing.


      var controllerActionFilters = []; // Flatten the array of array of ControllerAction classes and extract their arccore.filter references.

      console.log("> Analyzing registered ControllerAction class instances...");
      request_.controllerActionSets.forEach(function (controllerActionSet_) {
        controllerActionSet_.forEach(function (controllerActionInstance_) {
          controllerActionFilters.push(controllerActionInstance_.getFilter());
        });
      });

      if (controllerActionFilters.length >= 2) {
        filterResponse = arccore.discriminator.create({
          // TODO: At some point we will probably switch this is force resolution of the target filter ID
          // add another layer of detail to the evaluation algorithm. (we would like to know the ID of the
          // controller action filters that are called and we otherwise do not know this because it's
          // not encoded obviously in a controller action's request.
          options: {
            action: "routeRequest"
          },
          filters: controllerActionFilters
        });

        if (filterResponse.error) {
          errors.push(filterResponse.error);
          return "break";
        }

        result.actionDispatcher = filterResponse.result;
        console.log("> OPC instance controller action request dispatched initialized.");
      } else {
        console.warn("WARNING: No ControllerAction class instances have been registered!");
        result.actionDispatcher = {
          request: function request() {
            return {
              error: "No ControllerAction class instances registered!"
            };
          }
        };
      } // ================================================================
      // Finish up if no error(s).


      if (!errors.length) {
        response.result = _objectSpread({
          request_: request_
        }, result); // validated+normalized request_ overwritten with ...result
      }
    };

    while (!inBreakScope) {
      var _ret = _loop();

      if (_ret === "break") break;
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