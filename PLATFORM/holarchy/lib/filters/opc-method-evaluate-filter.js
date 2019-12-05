"use strict";

// Copyright (C) 2019 Christopher D. Russell
var arccore = require("@encapsule/arccore");

var SimpleStopwatch = require("../util/SimpleStopwatch");

var opcMethodEvaluateInputSpec = require("./iospecs/opc-method-evaluate-input-spec");

var opcMethodEvaluateOutputSpec = require("./iospecs/opc-method-evaluate-output-spec");

var maxEvalFrames = 10; // TODO: Migrate to constructor input w/default value.

var factoryResponse = arccore.filter.create({
  operationID: "T7PiatEGTo2dbdy8jOMHQg",
  operationName: "OPC Evaluation Filter",
  operationDescription: "Encapsulates the OPC's core OPM instance evaluation algorithm providing a detailed audit trail of the algorithm's execution.",
  inputFilterSpec: opcMethodEvaluateInputSpec,
  outputFilterSpec: opcMethodEvaluateOutputSpec,
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
    var evalStopwatch = new SimpleStopwatch("OPC evaluation #".concat(opcRef._private.evalCount, " stopwatch"));
    var result = {
      evalNumber: opcRef._private.evalCount,
      summary: {
        evalStopwatch: null,
        counts: {
          frames: 0,
          errors: 0,
          transitions: 0
        }
      },
      evalFrames: [] // <- each iteration of the outer "frames" loop pushes an evalFrame descriptor

    }; // OUTER LOOP (CONTROL FLOW AND ERROR REPORTING)
    //    MIDDLE LOOP (OPCI EVALUATION FRAME)
    //        INNER LOOP (OPMI EVALUATION FRAME)
    // ****************************************************************
    // Outer loop used to aid flow of control and error reporting.

    while (!inBreakScope) {
      inBreakScope = true; // ================================================================
      // Prologue - executed before starting the outer evaluation loop.

      console.log("================================================================");
      console.log("> ObservableProcessController::_evaluate starting system evaluation ".concat(opcRef._private.evalCount, " ...")); // Get a reference to the entire filter spec for the controller data store.

      var filterResponse = opcRef._private.ocdi.getNamespaceSpec("~");

      if (filterResponse.error) {
        errors.push(filterResponse.error);
        break;
      }

      var controllerDataSpec = filterResponse.result; // ================================================================
      // OUTER "EVALUATION FRAME" LOOP.
      // An a single call to the _evaluate method comprises a sequence of
      // one or more evaluation frames during which each bound OPM is evaluated.
      // Additional frames are added so long one or more OPM transitioned
      // between process steps. Or, until the maximum allowed frames / evaluation
      // limit is surpassed.

      while (result.evalFrames.length < opcRef._private.options.evaluate.maxFrames) {
        evalStopwatch.mark("frame ".concat(result.evalFrames.length, " start OPM instance binding"));
        var evalFrame = {
          bindings: {},
          // <- IRUT : OPM instance frame map
          summary: {
            counts: {
              bindings: 0,
              transitions: 0,
              errors: 0
            },
            reports: {
              transitions: [],
              errors: []
            }
          }
        }; // Get a reference to the controller data.

        filterResponse = opcRef._private.ocdi.readNamespace("~");

        if (filterResponse.error) {
          errors.push(filterResponse.error);
          break;
        }

        var controllerData = filterResponse.result; // ****************************************************************
        // ****************************************************************
        // ****************************************************************
        // FRAME-SCOPE OPM INSTANCE BINDING
        // ****************************************************************
        // ****************************************************************
        // ****************************************************************
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
                evalRequest: {
                  dataBinding: record,
                  initialStep: record.dataRef.__opmiStep,
                  opmRef: opcRef._private.opmMap[opmID]
                },
                evalResponse: {
                  status: "pending",
                  finishStep: null,
                  phases: {
                    p1_toperator: [],
                    p2_exit: [],
                    p3_enter: [],
                    p4_finalize: null
                  },
                  errors: {
                    p0: 0,
                    p1_toperator: 0,
                    p2_exit: 0,
                    p3_enter: 0,
                    p4_finalize: 0,
                    total: 0
                  }
                }
              }; // Generate an IRUT based on the CDS path to use as key in the binding map.

              var key = arccore.identifier.irut.fromReference(record.dataPath).result; // Register the new binding the the evalFrame.

              evalFrame.bindings[key] = opmInstanceFrame;
              evalFrame.summary.counts.bindings++;
              console.log("..... ..... controller data path '".concat(record.dataPath, "' bound to OPM '").concat(opmID, "'"));
              console.log("opmInstanceFrame=");
              console.log(opmInstanceFrame); // ****************************************************************
              // ****************************************************************
            } else {
              errors.push("Controller data namespace '".concat(record.specPath, "' is declared with an illegal syntax ObservableProcessModel binding ID '").concat(opmID, "'."));
              evalFrame.summary.counts.errors++;
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
          // TODO: I don't think we're handling errors here correctly?
          break; // from the outer evaluation loop
        } // ****************************************************************
        // ****************************************************************
        // ****************************************************************
        // FRAME-SCOPE OPM INSTANCE EVALUATION
        // ****************************************************************
        // ****************************************************************
        // ****************************************************************
        // ================================================================
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


        for (var cdsPathIRUT_ in evalFrame.bindings) {
          // Derefermce the opmInstanceFrame created during phase #0 binding.
          var _opmInstanceFrame = evalFrame.bindings[cdsPathIRUT_];
          _opmInstanceFrame.evalResponse.status = "analyzing";
          var cdsPath = _opmInstanceFrame.evalRequest.dataBinding.dataPath;
          var opmRef = _opmInstanceFrame.evalRequest.opmRef;
          var initialStep = _opmInstanceFrame.evalRequest.initialStep;
          var stepDescriptor = opmRef.getStepDescriptor(initialStep);
          console.log("..... Evaluting '".concat(cdsPath, "' instance of ").concat(opmRef.getID(), "::").concat(opmRef.getName(), " ..."));
          console.log("..... ..... model instance is currently at process step '".concat(initialStep, "' stepDescriptor="));
          console.log("stepDescriptor=");
          console.log(stepDescriptor); // ================================================================
          // ================================================================
          // ================================================================
          // PHASE 1 - BOUND OPM INSTANCE STEP TRANSITION EVALUATION
          // ================================================================
          // ================================================================
          // ================================================================
          // Evaluate the OPM instance's step transition ruleset.

          var nextStep = null; // null (default) indicates that the OPM instance should remain in its current process step (i.e. no transition).

          _opmInstanceFrame.evalResponse.status = "evaluation-check-transitions";

          for (var transitionRuleIndex = 0; transitionRuleIndex < stepDescriptor.transitions.length; transitionRuleIndex++) {
            var transitionRule = stepDescriptor.transitions[transitionRuleIndex];
            var operatorRequest = {
              context: {
                namespace: cdsPath,
                ocdi: opcRef._private.ocdi,
                transitionDispatcher: opcRef._private.transitionDispatcher
              },
              operator: transitionRule.transitionIf
            };

            var _transitionResponse = opcRef._private.transitionDispatcher.request(operatorRequest);

            _opmInstanceFrame.evalResponse.phases.p1_toperator.push({
              request: operatorRequest,
              response: _transitionResponse
            });

            if (_transitionResponse.error) {
              console.error(_transitionResponse.error);
              _opmInstanceFrame.evalResponse.status = "error";
              _opmInstanceFrame.evalResponse.errors.p1_toperator++;
              _opmInstanceFrame.evalResponse.errors.total++;
              _opmInstanceFrame.evalResponse.finishStep = initialStep;
              break; // abort evaluation of transition rules for this OPM instance...
            }

            if (_transitionResponse.result) {
              // Setup to transition between process steps...
              nextStep = transitionRule.nextStep; // signal a process step transition

              _opmInstanceFrame.evalResponse.status = "transitioning";
              break; // skip evaluation of subsequent transition rules for this OPM instance.
            }
          } // for transitionRuleIndex
          // If we encountered any error during the evaluation of the model step's transition operators skip the remainder of the model evaluation and proceed to the next model in the frame.


          if (_opmInstanceFrame.evalResponse.status === "error") {
            continue;
          } // If the OPM instance is stable in its current process step, continue on to evaluate the next OPM instance in the eval frame.


          if (!nextStep) {
            _opmInstanceFrame.evalResponse.status = "noop";
            _opmInstanceFrame.evalResponse.finishStep = initialStep;
            continue;
          } // Transition the OPM instance to its next process step.
          // ================================================================
          // ================================================================
          // ================================================================
          // PHASE 2 - BOUND OPM INSTANCE STEP EXIT DISPATCH
          // ================================================================
          // ================================================================
          // ================================================================
          // Get the stepDescriptor for the next process step that declares the actions to take on step entry.


          var nextStepDescriptor = opmRef.getStepDescriptor(nextStep); // Dispatch the OPM instance's step exit action(s).

          _opmInstanceFrame.evalResponse.status = "transitioning-dispatch-exit-actions";

          for (var exitActionIndex = 0; exitActionIndex < stepDescriptor.actions.exit.length; exitActionIndex++) {
            // Dispatch the action request.
            var actionRequest = stepDescriptor.actions.exit[exitActionIndex];
            var dispatcherRequest = {
              actionRequest: actionRequest,
              context: {
                dataPath: cdsPath,
                ocdi: opcRef._private.ocdi,
                act: opcRef.act
              }
            };

            var actionResponse = opcRef._private.actionDispatcher.request(dispatcherRequest);

            _opmInstanceFrame.evalResponse.phases.p2_exit.push({
              request: actionRequest,
              response: actionResponse
            });

            if (actionResponse.error) {
              console.error(actionResponse.error);
              _opmInstanceFrame.evalResponse.errors.p2_exit++;
              _opmInstanceFrame.evalResponse.errors.total++;
              _opmInstanceFrame.evalResponse.finishStep = initialStep;
            }
          } // TODO: Consider control flow gates based on accumulated errors.
          // ================================================================
          // ================================================================
          // ================================================================
          // PHASE 3 - BOUND OPM INSTANCE STEP EXIT DISPATCH
          // ================================================================
          // ================================================================
          // ================================================================
          // Dispatch the OPM instance's step enter action(s).


          _opmInstanceFrame.evalResponse.status = "transitioning-dispatch-enter-actions";

          for (var enterActionIndex = 0; enterActionIndex < nextStepDescriptor.actions.enter.length; enterActionIndex++) {
            var _actionRequest = nextStepDescriptor.actions.enter[enterActionIndex];
            var _dispatcherRequest = {
              actionRequest: _actionRequest,
              context: {
                dataPath: cdsPath,
                ocdi: opcRef._private.ocdi,
                act: opcRef.act
              }
            };

            var _actionResponse = opcRef._private.actionDispatcher.request(_dispatcherRequest);

            _opmInstanceFrame.evalResponse.phases.p3_enter.push({
              request: _actionRequest,
              response: _actionResponse
            });

            if (_actionResponse.error) {
              console.error(_actionResponse.error);
              _opmInstanceFrame.evalResponse.errors.p3_enter++;
              _opmInstanceFrame.evalResponse.errors.total++;
              _opmInstanceFrame.evalResponse.finishStep = initialStep;
            }
          } // TODO: Consider control flow gates based on accumulated errors.
          // ================================================================
          // ================================================================
          // ================================================================
          // PHASE 4 - BOUND OPM INSTANCE STEP TRANSITION FINALIZE
          // ================================================================
          // ================================================================
          // ================================================================
          // Update the OPM instance's __opmiStep flag in the controller data store.


          _opmInstanceFrame.evalResponse.status = "transitioning-finalize";

          var transitionResponse = opcRef._private.ocdi.writeNamespace("".concat(cdsPath, ".__opmiStep"), nextStep);

          _opmInstanceFrame.evalResponse.phases.p4_finalize = transitionResponse;

          if (transitionResponse.error) {
            console.error(transitionResponse.error);
            _opmInstanceFrame.evalResponse.errors.p4_finalize++;
            _opmInstanceFrame.evalResponse.errors.total++;
            _opmInstanceFrame.evalResponse.finishStep = initialStep;
          } else {
            _opmInstanceFrame.evalResponse.status = "transitioned";
            evalFrame.summary.counts.transitions++;
            evalFrame.summary.reports.transitions.push(cdsPathIRUT_);
            result.summary.counts.transitions++;
            _opmInstanceFrame.evalResponse.finishStep = nextStep;
          }
        } // cdsPath in evalFrame


        evalStopwatch.mark("frame ".concat(result.evalFrames.length, " end OPM instance evaluation"));
        console.log("> ... Finish evaluation frame ".concat(opcRef._private.evalCount, ":").concat(result.evalFrames.length, " ..."));
        result.evalFrames.push(evalFrame);
        result.summary.counts.frames++; // ================================================================
        // If any of the OPM instance's in the just-completed eval frame transitioned, add another eval frame.
        // Otherwise exit the outer eval loop and conclude the OPC evaluation algorithm.

        if (evalFrame.summary.counts.errors) {
          // Bail out of the frame loop if the frame we just evaluated had errors. There should be no errors on the control plane of an OPC.
          result.error = "ObservableProcessController evaluation aborted due to frame-scope error(s).";
          break;
        }

        if (!evalFrame.summary.counts.transitions) {
          // Exit the frame loop when the evaluation of the last frame resulted in no OPMI step transitions.
          break;
        }
      } // while outer frame evaluation loop (counted and limited to catch non-halting model constructs)


      if (result.evalFrames.length === opcRef._private.options.evaluate.maxFrames) {
        errors.push("Max evaluation frame limit of ".concat(opcRef._private.options.evaluate.maxFrames, " was reached before evaluation completed."));
        break;
      }

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
    return response;
  }
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;