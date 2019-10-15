"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var maxEvalFrames = 64; // TODO: Migrate to constructor input w/default value.

var arccore = require("@encapsule/arccore");

var constructorRequestFilter = require("./lib/ObservableProcessController-constructor-filter");

var ControllerDataStore = require("./ControllerDataStore");

var SimpleStopwatch = require("./lib/SimpleStopwatch");

var ObservableProcessController =
/*#__PURE__*/
function () {
  function ObservableProcessController(request_) {
    _classCallCheck(this, ObservableProcessController);

    try {
      console.log("ObservableProcessController::constructor starting..."); // Allocate private, per-class-instance state.

      this._private = {}; // ----------------------------------------------------------------
      // Normalize the incoming request descriptor object.

      var filterResponse = constructorRequestFilter.request(request_);

      if (filterResponse.error) {
        throw new Error(filterResponse.error);
      } // ----------------------------------------------------------------
      // Keep a copy of the normalized request passed to the constructor.
      // TODO: Evaluate and trim as a later optimization to reduce per-instance memory overhead.


      this._private.construction = filterResponse.result; // ----------------------------------------------------------------
      // Build a map of ObservableControllerModel instances.
      // Note that there's a 1:N relationship between an OPM declaration and an OPM runtime instance.

      this._private.opmMap = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = request_.observableProcessModelSets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var opmArray = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = opmArray[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var opm = _step2.value;
              var opmID = opm.getID();

              if (this._private.opmMap[opmID]) {
                throw new Error("Illegal duplicate ObservableProcessModel identifier '".concat(opmID, "' for model name '").concat(opm.getName(), "' with description '").concat(opm.getDescription(), "'."));
              }

              this._private.opmMap[opmID] = opm;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        } // ----------------------------------------------------------------
        // Build an arccore.discriminator filter instance to route transition
        // operatror request messages to a registered transition operator
        // filter for processing.

      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var transitionOperatorFilters = []; // Flatten the array of array of TransitionOperator classes and extract their arccore.filter references.

      request_.transitionOperatorSets.forEach(function (transitionOperatorSet_) {
        transitionOperatorSet_.forEach(function (transitionOperatorInstance_) {
          transitionOperatorFilters.push(transitionOperatorInstance_.getFilter());
        });
      });

      if (transitionOperatorFilters.length >= 2) {
        filterResponse = arccore.discriminator.create({
          options: {
            action: "routeRequest"
          },
          filters: transitionOperatorFilters
        });

        if (filterResponse.error) {
          throw new Error("Unable to construct a discriminator filter instance to route transition operator request messages. ".concat(filterResponse.error));
        }

        this._private.transitionDispatcher = filterResponse.result;
      } else {
        console.log("WARNING: No TransitionOperator class instances have been registered!");
        this._private.transitionDispatcher = {
          request: function request() {
            return {
              error: "No TransitionOperator class instances registered!"
            };
          }
        };
      } // ----------------------------------------------------------------
      // Build an arccore.discrimintor filter instance to route controller
      // action request messages to a registitered controller action filter
      // for processing.


      var controllerActionFilters = []; // Flatten the array of array of ControllerAction classes and extract their arccore.filter references.

      request_.controllerActionSets.forEach(function (controllerActionSet_) {
        controllerActionSet_.forEach(function (controllerActionInstance_) {
          controllerActionFilters.push(controllerActionInstance_.getFilter());
        });
      });

      if (controllerActionFilters.length >= 2) {
        filterResponse = arccore.discriminator.create({
          options: {
            action: "routeRequest"
          },
          filters: controllerActionFilters
        });

        if (filterResponse.error) {
          throw new Error("Unable to construct a discriminator filter instance to route controller action request messages. ".concat(filterResponse.error));
        }

        this._private.actionDispatcher = filterResponse.result;
      } else {
        console.log("WARNING: No ControllerAction class instances have been registered!");
        this._private.actionDispatcher = {
          request: function request() {
            return {
              error: "No ControllerAction class instances registered!"
            };
          }
        };
      } // Complete initialization of the instance.


      this._private.controllerData = new ControllerDataStore({
        spec: request_.controllerDataSpec,
        data: request_.controllerData
      });
      this._private.evaluationCount = 0; // Keep track of the total number of calls to ObservableProcessController::_evaluate method.

      this._private.lastEvaluation = null; // This is overwritten by calls to ObservableProcessController::_evaluate
      // ----------------------------------------------------------------
      // Bind instance methods.
      // public

      this.toJSON = this.toJSON.bind(this);
      this.act = this.act.bind(this); // private

      this._evaluate = this._evaluate.bind(this); // ----------------------------------------------------------------
      // Wake the beast up...
      // TODO: I am not 100% sure it's the best choice to perform the preliminary evaluation in the constructor.

      filterResponse = this._evaluate();

      if (filterResponse.error) {
        throw new Error(filterResponse.error);
      }
    } catch (exception_) {
      throw new Error("ObservableProcessController::constructor failed: ".concat(exception_.stack, "."));
    }

    console.log("ObservableProcessController::constructor complete.");
  } // end constructor function
  // ================================================================
  // PUBLIC API METHODS
  // All external interactions with an ObservableProcessController class instance
  // should be via public API methods. Do not dereference the _private data
  // namespace or call underscore-prefixed private class methods.


  _createClass(ObservableProcessController, [{
    key: "toJSON",
    value: function toJSON() {
      return this._private;
    } // toJSON method

  }, {
    key: "act",
    value: function act(request_) {
      request_;
    } // act method
    // ================================================================
    // PRIVATE IMPLEMENTATION METHODS
    // By convention underscore-prefixed class methods should never be called
    // outside of the implementation of public and private methods in this class.
    //

  }, {
    key: "_evaluate",
    value: function _evaluate() {
      // You are standing at the top of a double black diamond. There is 0.25-meter of fresh untouched powder. A raven watches from a tree. You are here alone...
      var response = {
        error: null,
        result: undefined
      };
      var errors = [];
      var inBreakScope = false;
      var evalStopwatch = new SimpleStopwatch("eval #".concat(this._private.evaluationCount, " stopwatch"));
      var evalFrames = [];

      while (!inBreakScope) {
        inBreakScope = true; // ================================================================
        // Prologue - executed before starting the outer evaluation loop.

        console.log("================================================================");
        console.log("> ObservableProcessController::_evaluate starting system evaluation ".concat(this._private.evaluationCount, " ...")); // Traverse the controller data filter specification and find all namespace declarations containing an OPM binding.
        // Get a reference to the entire filter spec for the controller data store.

        var filterResponse = this._private.controllerData.getNamespaceSpec("~");

        if (filterResponse.error) {
          errors.push(filterResponse.error);
          break;
        }

        var controllerDataSpec = filterResponse.result; // Get a reference to the controller data.

        filterResponse = this._private.controllerData.readNamespace("~");

        if (filterResponse.error) {
          errors.push(filterResponse.error);
          break;
        }

        var controllerData = filterResponse.result; // ================================================================
        // Outer evaluation loop.
        // An a single call to the _evaluate method comprises a sequence of
        // one or more evaluation frames during which each bound OPM is evaluated.
        // Additional frames are added so long one or more OPM transitioned
        // between process steps. Or, until the maximum allowed frames / evaluation
        // limit is surpassed.

        while (evalFrames.length < maxEvalFrames) {
          evalStopwatch.mark("frame ".concat(evalFrames.length, " start opm instance binding")); // ================================================================
          // Dynamically locate and bind ObservableProcessModel instances based
          // on analysis of the controller data's filter specification and the
          // actual controller data values. This occurs at the prologue of the
          // outer evaluation loop in order to track the addition and removal
          // of OPM-bound objects in the controller data store that may occur
          // as a side-effect of executing process model step enter and exit
          // actions.

          var evalFrame = {}; // A dictionary that maps controller data namespace declaration paths to their associated ObservableProcessModel class instances.

          var namespaceQueue = [{
            specPath: "~",
            dataPath: "~",
            specRef: controllerDataSpec,
            dataRef: controllerData
          }];

          while (namespaceQueue.length) {
            // Retrieve the next record from the queue.
            var record = namespaceQueue.shift();
            console.log("..... inspecting spec path='".concat(record.specPath, "' data path='").concat(record.dataPath, "'")); // If dataRef is undefined, then we're done traversing this branch of the filter spec descriptor tree.

            if (record.dataRef === undefined) {
              console.log("..... ..... controller data path '".concat(record.dataPath, "' is undefined; spec tree branch processing complete."));
              continue;
            } // Determine if the current spec namespace has an opm binding annotation.
            // TODO: We should validate the controller data spec wrt opm bindings to ensure the annotation is only made on appropriately-declared non-map object namespaces w/appropriate props...


            if (record.specRef.____appdsl && record.specRef.____appdsl.opm) {
              var opmID = record.specRef.____appdsl.opm;

              if (arccore.identifier.irut.isIRUT(opmID).result) {
                if (!this._private.opmMap[opmID]) {
                  errors.push("Controller data namespace '".concat(record.specPath, "' is declared with an unregistered ObservableProcessModel binding ID '").concat(opmID, "'."));
                  break;
                } // ****************************************************************
                // ****************************************************************
                // We found an OPM-bound namespace in the controller data.


                var opmInstanceFrame = {
                  evaluationContext: {
                    dataBinding: record,
                    initialStep: record.dataRef.opmStep,
                    opm: this._private.opmMap[opmID]
                  },
                  evaluationResponse: {
                    status: "pending-eval"
                  }
                };
                evalFrame[record.dataPath] = opmInstanceFrame;
                console.log("..... ..... controller data path '".concat(record.dataPath, "' bound to OPM '").concat(opmID, "'"));
                console.log(opmInstanceFrame); // ****************************************************************
                // ****************************************************************
              } else {
                errors.push("Controller data namespace '".concat(record.specPath, "' is declared with an illegal syntax ObservableProcessModel binding ID '").concat(opmID, "'."));
                break;
              }
            } // end if opm binding on current namespace?
            // Is the current namespace an array or object used as a map?


            var declaredAsArray = false;

            switch (Object.prototype.toString.call(record.specRef.____types)) {
              case "[object String]":
                if (record.specRef.____types === "jsArray") {
                  declaredAsArray = true;
                }

                break;

              case "[object Array]":
                if (record.specRef.____types.indexOf("jsArray") >= 0) {
                  declaredAsArray = true;
                }

                break;

              default:
                break;
            }

            var declaredAsMap = false;

            if (record.specRef.____asMap) {
              switch (Object.prototype.toString.call(record.specRef.____types)) {
                case "[object String]":
                  if (record.specRef.____types === "jsObject") {
                    declaredAsMap = true;
                  }

                  break;

                case "[object Array]":
                  if (record.specRef.____types.indexOf("jsObject") >= 0) {
                    declaredAsMap = true;
                  }

                  break;

                default:
                  break;
              }
            } // Evaluate the child namespaces of the current filter spec namespace.


            for (var key_ in record.specRef) {
              if (key_.startsWith("____")) {
                continue;
              }

              if (!declaredAsArray && !declaredAsMap) {
                var newRecord = arccore.util.clone(record);
                newRecord.specPath = "".concat(newRecord.specPath, ".").concat(key_);
                newRecord.dataPath = "".concat(newRecord.dataPath, ".").concat(key_);
                newRecord.specRef = record.specRef[key_];
                newRecord.dataRef = record.dataRef[key_];
                namespaceQueue.push(newRecord);
              } else {
                if (declaredAsArray) {
                  if (Object.prototype.toString.call(record.dataRef) === "[object Array]") {
                    for (var index = 0; index < record.dataRef.length; index++) {
                      var _newRecord = arccore.util.clone(record);

                      _newRecord.specPath = "".concat(_newRecord.specPath, ".").concat(key_);
                      _newRecord.dataPath = "".concat(_newRecord.dataPath, ".").concat(index);
                      _newRecord.specRef = record.specRef[key_];
                      _newRecord.dataRef = record.dataRef[index];
                      namespaceQueue.push(_newRecord);
                    }
                  }
                } else {
                  if (Object.prototype.toString.call(record.dataRef) === "[object Object]") {
                    var dataKeys = Object.keys(record.dataRef);

                    while (dataKeys.length) {
                      var dataKey = dataKeys.shift();

                      var _newRecord2 = arccore.util.clone(record);

                      _newRecord2.specPath = "".concat(_newRecord2.specPath, ".").concat(key_);
                      _newRecord2.dataPath = "".concat(_newRecord2.dataPath, ".").concat(dataKey);
                      _newRecord2.specRef = record.specRef[key_];
                      _newRecord2.dataRef = record.dataRef[dataKey];
                      namespaceQueue.push(_newRecord2);
                    }
                  }
                }
              }
            }
          } // end while(namespaceQueue.length)
          // We have completed dynamically locating all instances of OPM-bound data objects in the controller data store and the results are stored in the evalFrame.


          evalStopwatch.mark("frame ".concat(evalFrames.length, " end opm instance binding / start evaluation"));

          if (errors.length) {
            break; // from the outer evaluation loop
          } // ================================================================
          //
          // ¯\_(ツ)_/¯ - following along? Hang on for the fun part ...
          //
          // ================================================================
          // Evaluate each discovered OPM-bound object instance in the controller
          // data store. Note that we evaluate the model instances in their order
          // of discovery which is somewhat arbitrary as it depends on user-defined
          // controller data filter spec composition. Each model instance is evaluted,
          // per it's declared step-dependent transition rules. And, if the rules
          // and current data values indicate, the model is transitioned between
          // steps dispatching exit and enter actions declared optionally on the
          // step we're exiting and/or the step we're entering.


          for (var controllerDataPath in evalFrame) {
            var _opmInstanceFrame = evalFrame[controllerDataPath];
            _opmInstanceFrame.evaluationResponse.status = "evaluating";
            var opmBinding = _opmInstanceFrame.evaluationContext.opm;
            var initialStep = _opmInstanceFrame.evaluationContext.initialStep;
            var stepDescriptor = opmBinding.getStepDescriptor(initialStep);
            console.log("..... Evaluting '".concat(controllerDataPath, "' instance of ").concat(opmBinding.getID(), "::").concat(opmBinding.getName(), " ..."));
            console.log("..... ..... model instance is currently at process step '".concat(initialStep, "' stepDescriptor="));
            console.log(stepDescriptor); // ================================================================
            // Evaluate the OPM instance's step transition ruleset.

            var nextStep = null; // null (default) indicates that the OPM instance should remain in its current process step (i.e. no transition).

            for (var transitionIndex = 0; transitionIndex < stepDescriptor.transitions.length; transitionIndex++) {
              var transitionRule = stepDescriptor.transitions[transitionIndex];

              var _transitionResponse = this._private.transitionDispatcher.request(transitionRule.transitionIf);

              if (_transitionResponse.error) {
                _opmInstanceFrame.evaluationResponse.status = "error";
                _opmInstanceFrame.evaluationResponse.error = _transitionResponse.error;
                _opmInstanceFrame.evaluationResponse.transitionIf = transitionRule.transitionIf;
                _opmInstanceFrame.evaluationResponse.finishStep = initialStep;
                break; // abort evaluation of transition rules for this OPM instance...
              }

              if (_transitionResponse.result) {
                nextStep = transitionRule.nextStep; // signal a process step transition

                _opmInstanceFrame.evaluationResponse.status = "transitioning";
                _opmInstanceFrame.evaluationResponse.transitionIf = transitionRule.transitionIf;
                _opmInstanceFrame.evaluationResponse.actions = {
                  exit: [],
                  exitErrors: 0,
                  enter: [],
                  enterErrors: 0,
                  stepTransitionResponse: null,
                  totalErrors: 0
                };
                break; // skip evaluation of subsequent transition rules for this OPM instance.
              }
            } // If we encountered any error during the evaluation of the model step's transition operators skip the remainder of the model evaluation and proceed to the next model in the frame.


            if (_opmInstanceFrame.evaluationResponse.status === "error") {
              continue;
            } // If the OPM instance is stable in its current process step, continue on to evaluate the next OPM instance in the eval frame.


            if (!nextStep) {
              _opmInstanceFrame.evaluationResponse.status = "noop";
              _opmInstanceFrame.evaluationResponse.finishStep = initialStep;
              continue;
            } // Transition the OPM instance to its next process step.
            // Get the stepDescriptor for the next process step that declares the actions to take on step entry.


            var nextStepDescriptor = opmBinding.getStepDescriptor(nextStep); // Dispatch the OPM instance's step exit action(s).

            _opmInstanceFrame.evaluationResponse.action = "step-exit-action-dispatch";

            for (var exitActionIndex = 0; exitActionIndex < stepDescriptor.actions.exit.length; exitActionIndex++) {
              var actionRequest = stepDescriptor.actions.exit[exitActionIndex];

              var actionResponse = this._private.actionDispatcher.request(actionRequest);

              _opmInstanceFrame.evaluationResponse.actions.exit.push({
                actionRequest: actionRequest,
                actionResponse: actionResponse
              });

              if (actionResponse.error) {
                _opmInstanceFrame.evaluationResponse.actions.exitErrors++;
                _opmInstanceFrame.evaluationResponse.actions.totalErrors++;
              }
            } // Dispatch the OPM instance's step enter action(s).


            _opmInstanceFrame.evaluationResponse.action = "step-enter-action-dispatch";

            for (var enterActionIndex = 0; enterActionIndex < nextStepDescriptor.actions.enter.length; enterActionIndex++) {
              var _actionRequest = nextStepDescriptor.actions.enter[enterActionIndex];

              var _actionResponse = this._private.actionDispatcher.request(_actionRequest);

              _opmInstanceFrame.evaluationResponse.actions.enter.push({
                actionRequest: _actionRequest,
                actionResponse: _actionResponse
              });

              if (_actionResponse.error) {
                _opmInstanceFrame.evaluationResponse.actions.enterErrors++;
                _opmInstanceFrame.evaluationResponse.actions.totalErrors++;
              }
            } // Update the OPM instance's opmStep flag in the controller data store.


            var transitionResponse = this._private.controllerData.writeNamespace("".concat(controllerDataPath, ".opmStep"), nextStep);

            _opmInstanceFrame.evaluationResponse.actions.stepTransitionResponse = transitionResponse;

            if (transitionResponse.error) {
              _opmInstanceFrame.evaluationResponse.actions.totalErrors++;
            }

            _opmInstanceFrame.evaluationResponse.status = "completed";
            _opmInstanceFrame.evaluationResponse.action = "transitioned";
            _opmInstanceFrame.evaluationResponse.finishStep = nextStep;
          } // controllerDataPath in evalFrame


          evalStopwatch.mark("frame ".concat(evalFrames.length, " end evaluation"));
          console.log("> ... Finish evaluation frame ".concat(this._private.evaluationCount, ":").concat(evalFrames.length, " ..."));
          evalFrames.push(evalFrame); // ================================================================
          // If any of the OPM instance's in the just-completed eval frame transitioned, add another eval frame.
          // Otherwise exit the outer eval loop and conclude the OPC evaluation algorithm.
          // TODO break on out as a temporary measure until the transition operators and actions are working.

          break; // ... out of the main evaluation loop
        } // while outer evaluation loop;


        break;
      } // while (!inBreakScope)


      if (errors.length) {
        response.error = errors.join(" "); // override response.error with a string value. by filter convention, this means that response.result is invalid.
      } // Note that in all cases the response descriptor object returned by ObservableProcessController:_evaluate is informational.
      // If !response.result (i.e. no error) then the following is true:
      // - There were no errors encountered while dynamically binding OPM instances in OPD.
      // - There were no errors encountered during OPM instance evaluation including transition evaluations, and consequent action request dispatches.
      // - This does not mean that your operator and action filters are correct.
      // - This does not mean that your OPM's encode what you think they do.


      response.result = {
        evalFrames: evalFrames,
        evalStopwatch: evalStopwatch.stop()
      };
      console.log("> ObservableProcessController::_evaluate  #".concat(this._private.evaluationCount++, " ").concat(response.error ? "ABORTED WITH ERROR" : "completed without error", "."));
      console.log(response);
      this._private.lastEvaluation = response;
      return response;
    } // _evaluate method

  }]);

  return ObservableProcessController;
}();

module.exports = ObservableProcessController;