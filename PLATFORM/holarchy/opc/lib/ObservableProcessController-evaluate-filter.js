"use strict";

// Copyright (C) 2019 Christopher D. Russell
var arccore = require("@encapsule/arccore");

var SimpleStopwatch = require("./SimpleStopwatch");

var opcEvaluateRequestSpec = require("./ObservableProcessController-evaluate-filter-input-spec");

var opcEvaluateResultSpec = require("./ObservableProcessController-evaluate-filter-output-spec");

var maxEvalFrames = 64; // TODO: Migrate to constructor input w/default value.

var factoryResponse = arccore.filter.create({
  operationID: "T7PiatEGTo2dbdy8jOMHQg",
  operationName: "OPC Evaluation Filter",
  operationDescription: "Encapsulates the OPC's core OPM instance evaluation algorithm providing a detailed audit trail of the algorithm's execution.",
  inputFilterSpec: opcEvaluateRequestSpec,
  outputFilterSpec: opcEvaluateResultSpec,
  bodyFunction: function bodyFunction(opcEvaluateRequest_) {
    /*
      O       o O       o O       o
      | O   o | | O   o | | O   o |
      | | O | | | | O | | | | O | |
      | o   O | | o   O | | o   O |
      o       O o       O o       O
    */
    var response = {
      error: null,
      result: undefined
    };
    var errors = [];
    var inBreakScope = false;
    var opcRef = opcEvaluateRequest_.opcRef;
    var evalStopwatch = new SimpleStopwatch("OPC evaluation #".concat(opcRef._private.evaluationCount, " stopwatch"));
    var result = {
      evalNumber: opcRef._private.evaluationCount,
      evalFrames: [],
      summary: {
        evalStopwatch: null,
        framesEvaluated: 0,
        totalErrors: 0,
        totalTransitions: 0
      }
    }; // ****************************************************************
    // Outer loop used to aid flow of control and error reporting.

    while (!inBreakScope) {
      inBreakScope = true; // ================================================================
      // Prologue - executed before starting the outer evaluation loop.

      console.log("================================================================");
      console.log("> ObservableProcessController::_evaluate starting system evaluation ".concat(opcRef._private.evaluationCount, " ...")); // Get a reference to the entire filter spec for the controller data store.

      var filterResponse = opcRef._private.controllerData.getNamespaceSpec("~");

      if (filterResponse.error) {
        errors.push(filterResponse.error);
        break;
      }

      var controllerDataSpec = filterResponse.result; // Get a reference to the controller data.

      filterResponse = opcRef._private.controllerData.readNamespace("~");

      if (filterResponse.error) {
        errors.push(filterResponse.error);
        break;
      }

      var controllerData = filterResponse.result; // ================================================================
      // OUTER "EVALUATION FRAME" LOOP.
      // An a single call to the _evaluate method comprises a sequence of
      // one or more evaluation frames during which each bound OPM is evaluated.
      // Additional frames are added so long one or more OPM transitioned
      // between process steps. Or, until the maximum allowed frames / evaluation
      // limit is surpassed.

      while (result.evalFrames.length < maxEvalFrames) {
        evalStopwatch.mark("frame ".concat(result.evalFrames.length, " start OPM instance binding"));
        var evalFrame = {
          bindings: {},
          summary: {
            bindingCount: 0,
            transitionCount: 0,
            errorCount: 0,
            failures: {},
            transitions: {}
          }
        }; // ================================================================
        // Dynamically locate and bind ObservableProcessModel instances based
        // on analysis of the controller data's filter specification and the
        // actual controller data values. This occurs at the prologue of the
        // outer evaluation loop in order to track the addition and removal
        // of OPM-bound objects in the controller data store that may occur
        // as a side-effect of executing process model step enter and exit
        // actions.
        // Traverse the controller data filter specification and find all namespace declarations containing an OPM binding.

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
          } // Determine if the current spec namespace has an OPM binding annotation.
          // TODO: We should validate the controller data spec wrt OPM bindings to ensure the annotation is only made on appropriately-declared non-map object namespaces w/appropriate props...


          if (record.specRef.____appdsl && record.specRef.____appdsl.opm) {
            var opmID = record.specRef.____appdsl.opm;

            if (arccore.identifier.irut.isIRUT(opmID).result) {
              if (!opcRef._private.opmMap[opmID]) {
                errors.push("Controller data namespace '".concat(record.specPath, "' is declared with an unregistered ObservableProcessModel binding ID '").concat(opmID, "'."));
                break;
              } // ****************************************************************
              // ****************************************************************
              // We found an OPM-bound namespace in the controller data.


              var opmInstanceFrame = {
                evaluationContext: {
                  dataBinding: record,
                  initialStep: record.dataRef.opmStep,
                  opm: opcRef._private.opmMap[opmID]
                },
                evaluationResponse: {
                  status: "pending-eval"
                }
              };
              evalFrame.bindings[record.dataPath] = opmInstanceFrame;
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


        evalStopwatch.mark("frame ".concat(result.evalFrames.length, " end OPM instance binding / start OPM instance evaluation"));

        if (errors.length) {
          // As a matter of implementation policy, we do not further evaluation of an OPM instance
          // if any error is encountered during the evaluation of the model's transition operator
          // expression.
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


        for (var controllerDataPath in evalFrame.bindings) {
          var _opmInstanceFrame = evalFrame.bindings[controllerDataPath];
          _opmInstanceFrame.evaluationResponse.status = "evaluating";
          var opmBinding = _opmInstanceFrame.evaluationContext.opm;
          var initialStep = _opmInstanceFrame.evaluationContext.initialStep;
          var stepDescriptor = opmBinding.getStepDescriptor(initialStep);
          console.log("..... Evaluting '".concat(controllerDataPath, "' instance of ").concat(opmBinding.getID(), "::").concat(opmBinding.getName(), " ..."));
          console.log("..... ..... model instance is currently at process step '".concat(initialStep, "' stepDescriptor="));
          console.log(stepDescriptor); // ================================================================
          // Evaluate the OPM instance's step transition ruleset.

          var nextStep = null; // null (default) indicates that the OPM instance should remain in its current process step (i.e. no transition).

          for (var transitionRuleIndex = 0; transitionRuleIndex < stepDescriptor.transitions.length; transitionRuleIndex++) {
            var transitionRule = stepDescriptor.transitions[transitionRuleIndex];

            var _transitionResponse = opcRef._private.transitionDispatcher.request({
              context: {
                namespace: controllerDataPath,
                opd: opcRef._private.controllerData,
                transitionDispatcher: opcRef._private.transitionDispatcher
              },
              operator: transitionRule.transitionIf
            }); // TODO: These structures are currently ad-hoc; create a filter spec for the entire response.result of _evaluate method and nail these details down.


            if (_transitionResponse.error) {
              console.error(_transitionResponse.error);
              _opmInstanceFrame.evaluationResponse.status = "error";
              _opmInstanceFrame.evaluationResponse.error = _transitionResponse.error;
              _opmInstanceFrame.evaluationResponse.transitionIf = transitionRule.transitionIf;
              _opmInstanceFrame.evaluationResponse.finishStep = initialStep;
              break; // abort evaluation of transition rules for this OPM instance...
            }

            if (_transitionResponse.result) {
              // Setup to transition between process steps...
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
          } // for transitionRuleIndex
          // If we encountered any error during the evaluation of the model step's transition operators skip the remainder of the model evaluation and proceed to the next model in the frame.


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
            // Dispatch the action request.
            var actionRequest = stepDescriptor.actions.exit[exitActionIndex];
            var dispatcherRequest = {
              actionRequest: actionRequest,
              context: {
                dataPath: controllerDataPath,
                cds: opcRef._private.controllerData,
                act: opcRef.act
              }
            };

            var actionResponse = opcRef._private.actionDispatcher.request(dispatcherRequest);

            _opmInstanceFrame.evaluationResponse.actions.exit.push({
              actionRequest: actionRequest,
              actionResponse: actionResponse
            });

            if (actionResponse.error) {
              console.error(actionResponse.error);
              console.error(dispatcherRequest);
              _opmInstanceFrame.evaluationResponse.actions.exitErrors++;
              _opmInstanceFrame.evaluationResponse.actions.totalErrors++;
            }
          } // TODO: Consider control flow gates based on accumulated errors.
          // Dispatch the OPM instance's step enter action(s).


          _opmInstanceFrame.evaluationResponse.action = "step-enter-action-dispatch";

          for (var enterActionIndex = 0; enterActionIndex < nextStepDescriptor.actions.enter.length; enterActionIndex++) {
            var _actionRequest = nextStepDescriptor.actions.enter[enterActionIndex];
            var _dispatcherRequest = {
              actionRequest: _actionRequest,
              context: {
                dataPath: controllerDataPath,
                cds: opcRef._private.controllerData,
                act: opcRef.act
              }
            };

            var _actionResponse = opcRef._private.actionDispatcher.request(_dispatcherRequest);

            _opmInstanceFrame.evaluationResponse.actions.enter.push({
              actionRequest: _actionRequest,
              actionResponse: _actionResponse
            });

            if (_actionResponse.error) {
              console.error(_actionResponse.error);
              console.error(_dispatcherRequest);
              _opmInstanceFrame.evaluationResponse.actions.enterErrors++;
              _opmInstanceFrame.evaluationResponse.actions.totalErrors++;
            }
          } // TODO: Consider control flow gates based on accumulated errors.
          // Update the OPM instance's opmStep flag in the controller data store.


          var transitionResponse = opcRef._private.controllerData.writeNamespace("".concat(controllerDataPath, ".opmStep"), nextStep);

          _opmInstanceFrame.evaluationResponse.actions.stepTransitionResponse = transitionResponse;

          if (transitionResponse.error) {
            console.error(transitionResponse.error);
            _opmInstanceFrame.evaluationResponse.actions.totalErrors++;
          }

          _opmInstanceFrame.evaluationResponse.status = "completed";
          _opmInstanceFrame.evaluationResponse.action = "transitioned";
          _opmInstanceFrame.evaluationResponse.finishStep = nextStep;
        } // controllerDataPath in evalFrame


        evalStopwatch.mark("frame ".concat(result.evalFrames.length, " end OPM instance evaluation"));
        console.log("> ... Finish evaluation frame ".concat(opcRef._private.evaluationCount, ":").concat(result.evalFrames.length, " ..."));
        result.evalFrames.push(evalFrame); // ================================================================
        // If any of the OPM instance's in the just-completed eval frame transitioned, add another eval frame.
        // Otherwise exit the outer eval loop and conclude the OPC evaluation algorithm.
        // TODO break on out as a temporary measure until the transition operators and actions are working.

        break; // ... out of the main evaluation loop
      } // while outer frame evaluation loop;


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


    result.summary.evalStopwatch = evalStopwatch.stop();
    result.summary.framesCount = result.evalFrames.length;
    response.result = result;
    console.log("> ObservableProcessController::_evaluate  #".concat(result.evalNumber, " ").concat(response.error ? "ABORTED WITH ERROR" : "completed", "."));
    console.log("..... OPC evalution #".concat(result.evalNumber, " sequenced ").concat(result.summary.framesCount, " frame(s) in ").concat(result.summary.evalStopwatch.totalMicroseconds, " microseconds."));
    console.log(response);
    return response;
  }
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;