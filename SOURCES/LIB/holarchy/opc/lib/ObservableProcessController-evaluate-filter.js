
// Copyright (C) 2019 Christopher D. Russell

const arccore = require("@encapsule/arccore");
const SimpleStopwatch = require("./SimpleStopwatch");
const opcEvaluateRequestSpec = require("./ObservableProcessController-evaluate-filter-input-spec");
const opcEvaluateResultSpec = require("./ObservableProcessController-evaluate-filter-output-spec");

const maxEvalFrames = 64; // TODO: Migrate to constructor input w/default value.

const factoryResponse = arccore.filter.create({

    operationID: "T7PiatEGTo2dbdy8jOMHQg",
    operationName: "OPC Evaluation Filter",
    operationDescription: "Encapsulates the OPC's core OPM instance evaluation algorithm providing a detailed audit trail of the algorithm's execution.",
    inputFilterSpec:  opcEvaluateRequestSpec,
    outputFilterSpec: opcEvaluateResultSpec,

    bodyFunction: function(opcEvaluateRequest_) {

        /*
          O       o O       o O       o
          | O   o | | O   o | | O   o |
          | | O | | | | O | | | | O | |
          | o   O | | o   O | | o   O |
          o       O o       O o       O
        */

        let response = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        const opcRef = opcEvaluateRequest_.opcRef;
        const evalStopwatch = new SimpleStopwatch(`OPC evaluation #${opcRef._private.evaluationCount} stopwatch`);

        let result = {
            evalNumber: opcRef._private.evaluationCount,
            evalFrames: [],
            summary: {
                evalStopwatch: null,
                framesEvaluated: 0,
                totalErrors: 0,
                totalTransitions: 0
            }
        };

        // ****************************************************************
        // Outer loop used to aid flow of control and error reporting.
        while (!inBreakScope) {
            inBreakScope = true;

            // ================================================================
            // Prologue - executed before starting the outer evaluation loop.

            console.log("================================================================");
            console.log(`> ObservableProcessController::_evaluate starting system evaluation ${opcRef._private.evaluationCount} ...`);

            // Get a reference to the entire filter spec for the controller data store.
            let filterResponse = opcRef._private.controllerData.getNamespaceSpec("~");
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            const controllerDataSpec = filterResponse.result;

            // Get a reference to the controller data.
            filterResponse = opcRef._private.controllerData.readNamespace("~");
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            const controllerData = filterResponse.result;

            // ================================================================
            // OUTER "EVALUATION FRAME" LOOP.
            // An a single call to the _evaluate method comprises a sequence of
            // one or more evaluation frames during which each bound OPM is evaluated.
            // Additional frames are added so long one or more OPM transitioned
            // between process steps. Or, until the maximum allowed frames / evaluation
            // limit is surpassed.

            while (result.evalFrames.length < maxEvalFrames) {

                evalStopwatch.mark(`frame ${result.evalFrames.length} start OPM instance binding`);

                let evalFrame = {
                    bindings: {},
                    summary: {
                        bindingCount: 0,
                        transitionCount: 0,
                        errorCount: 0,
                        failures: {},
                        transitions: {}
                    }
                };

                // ================================================================
                // Dynamically locate and bind ObservableProcessModel instances based
                // on analysis of the controller data's filter specification and the
                // actual controller data values. This occurs at the prologue of the
                // outer evaluation loop in order to track the addition and removal
                // of OPM-bound objects in the controller data store that may occur
                // as a side-effect of executing process model step enter and exit
                // actions.

                // Traverse the controller data filter specification and find all namespace declarations containing an OPM binding.

                let namespaceQueue = [ { specPath: "~", dataPath: "~", specRef: controllerDataSpec, dataRef: controllerData } ];

                while (namespaceQueue.length) {
                    // Retrieve the next record from the queue.
                    let record = namespaceQueue.shift();

                    console.log(`..... inspecting spec path='${record.specPath}' data path='${record.dataPath}'`);

                    // If dataRef is undefined, then we're done traversing this branch of the filter spec descriptor tree.
                    if (record.dataRef === undefined) {
                        console.log(`..... ..... controller data path '${record.dataPath}' is undefined; spec tree branch processing complete.`);
                        continue;
                    }

                    // Determine if the current spec namespace has an OPM binding annotation.
                    // TODO: We should validate the controller data spec wrt OPM bindings to ensure the annotation is only made on appropriately-declared non-map object namespaces w/appropriate props...
                    if (record.specRef.____appdsl && record.specRef.____appdsl.opm) {
                        const opmID = record.specRef.____appdsl.opm;
                        if (arccore.identifier.irut.isIRUT(opmID).result) {
                            if (!opcRef._private.opmMap[opmID]) {
                                errors.push(`Controller data namespace '${record.specPath}' is declared with an unregistered ObservableProcessModel binding ID '${opmID}'.`);
                                break;
                            }

                            // ****************************************************************
                            // ****************************************************************
                            // We found an OPM-bound namespace in the controller data.
                            const opmInstanceFrame = {
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
                            console.log(`..... ..... controller data path '${record.dataPath}' bound to OPM '${opmID}'`);
                            console.log(opmInstanceFrame);
                            // ****************************************************************
                            // ****************************************************************

                        } else {
                            errors.push(`Controller data namespace '${record.specPath}' is declared with an illegal syntax ObservableProcessModel binding ID '${opmID}'.`);
                            break;
                        }
                    } // end if opm binding on current namespace?

                    // Is the current namespace an array or object used as a map?

                    let declaredAsArray = false;
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

                    let declaredAsMap = false;
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
                    }

                    // Evaluate the child namespaces of the current filter spec namespace.
                    for (let key_ in record.specRef) {

                        if (key_.startsWith("____")) {
                            continue;
                        }

                        if (!declaredAsArray && !declaredAsMap) {
                            let newRecord = arccore.util.clone(record);
                            newRecord.specPath = `${newRecord.specPath}.${key_}`;
                            newRecord.dataPath = `${newRecord.dataPath}.${key_}`;
                            newRecord.specRef = record.specRef[key_];
                            newRecord.dataRef = record.dataRef[key_];
                            namespaceQueue.push(newRecord);
                        } else {
                            if (declaredAsArray) {
                                if (Object.prototype.toString.call(record.dataRef) === "[object Array]") {
                                    for (let index = 0 ; index < record.dataRef.length ; index++) {
                                        let newRecord = arccore.util.clone(record);
                                        newRecord.specPath = `${newRecord.specPath}.${key_}`;
                                        newRecord.dataPath = `${newRecord.dataPath}.${index}`;
                                        newRecord.specRef = record.specRef[key_];
                                        newRecord.dataRef = record.dataRef[index];
                                        namespaceQueue.push(newRecord);
                                    }
                                }
                            } else {
                                if (Object.prototype.toString.call(record.dataRef) === "[object Object]") {
                                    let dataKeys = Object.keys(record.dataRef);
                                    while (dataKeys.length) {
                                        const dataKey = dataKeys.shift();
                                        let newRecord = arccore.util.clone(record);
                                        newRecord.specPath = `${newRecord.specPath}.${key_}`;
                                        newRecord.dataPath = `${newRecord.dataPath}.${dataKey}`;
                                        newRecord.specRef = record.specRef[key_];
                                        newRecord.dataRef = record.dataRef[dataKey];
                                        namespaceQueue.push(newRecord);
                                    }
                                }
                            }
                        }
                    }
                } // end while(namespaceQueue.length)

                // We have completed dynamically locating all instances of OPM-bound data objects in the controller data store and the results are stored in the evalFrame.

                evalStopwatch.mark(`frame ${result.evalFrames.length} end OPM instance binding / start OPM instance evaluation`);

                if (errors.length) {
                    // As a matter of implementation policy, we do not further evaluation of an OPM instance
                    // if any error is encountered during the evaluation of the model's transition operator
                    // expression.
                    break; // from the outer evaluation loop
                }

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

                for (let controllerDataPath in evalFrame.bindings) {

                    const opmInstanceFrame = evalFrame.bindings[controllerDataPath];
                    opmInstanceFrame.evaluationResponse.status = "evaluating";

                    const opmBinding = opmInstanceFrame.evaluationContext.opm;
                    const initialStep = opmInstanceFrame.evaluationContext.initialStep;
                    const stepDescriptor = opmBinding.getStepDescriptor(initialStep);

                    console.log(`..... Evaluting '${controllerDataPath}' instance of ${opmBinding.getID()}::${opmBinding.getName()} ...`);
                    console.log(`..... ..... model instance is currently at process step '${initialStep}' stepDescriptor=`);
                    console.log(stepDescriptor);

                    // ================================================================
                    // Evaluate the OPM instance's step transition ruleset.
                    let nextStep = null; // null (default) indicates that the OPM instance should remain in its current process step (i.e. no transition).

                    for (let transitionRuleIndex = 0; transitionRuleIndex < stepDescriptor.transitions.length ; transitionRuleIndex++) {
                        const transitionRule = stepDescriptor.transitions[transitionRuleIndex];
                        let transitionResponse = opcRef._private.transitionDispatcher.request({
                            context: {
                                namespace: controllerDataPath,
                                opd: opcRef._private.controllerData,
                                transitionDispatcher: opcRef._private.transitionDispatcher
                            },
                            operator: transitionRule.transitionIf
                        });
                        // TODO: These structures are currently ad-hoc; create a filter spec for the entire response.result of _evaluate method and nail these details down.

                        if (transitionResponse.error) {
                            console.error(transitionResponse.error);
                            opmInstanceFrame.evaluationResponse.status = "error";
                            opmInstanceFrame.evaluationResponse.error = transitionResponse.error;
                            opmInstanceFrame.evaluationResponse.transitionIf = transitionRule.transitionIf;
                            opmInstanceFrame.evaluationResponse.finishStep = initialStep;
                            break; // abort evaluation of transition rules for this OPM instance...
                        }
                        if (transitionResponse.result) {
                            // Setup to transition between process steps...
                            nextStep = transitionRule.nextStep; // signal a process step transition
                            opmInstanceFrame.evaluationResponse.status = "transitioning";
                            opmInstanceFrame.evaluationResponse.transitionIf = transitionRule.transitionIf;
                            opmInstanceFrame.evaluationResponse.actions = { exit: [], exitErrors: 0, enter: [], enterErrors: 0, stepTransitionResponse: null, totalErrors: 0 };
                            break; // skip evaluation of subsequent transition rules for this OPM instance.
                        }
                    } // for transitionRuleIndex

                    // If we encountered any error during the evaluation of the model step's transition operators skip the remainder of the model evaluation and proceed to the next model in the frame.
                    if (opmInstanceFrame.evaluationResponse.status === "error") {
                        continue;
                    }

                    // If the OPM instance is stable in its current process step, continue on to evaluate the next OPM instance in the eval frame.
                    if (!nextStep) {
                        opmInstanceFrame.evaluationResponse.status = "noop";
                        opmInstanceFrame.evaluationResponse.finishStep = initialStep;
                        continue;
                    }

                    // Transition the OPM instance to its next process step.

                    // Get the stepDescriptor for the next process step that declares the actions to take on step entry.
                    const nextStepDescriptor = opmBinding.getStepDescriptor(nextStep);

                    // Dispatch the OPM instance's step exit action(s).
                    opmInstanceFrame.evaluationResponse.action = "step-exit-action-dispatch";
                    for (let exitActionIndex = 0 ; exitActionIndex < stepDescriptor.actions.exit.length ; exitActionIndex++) {
                        // Dispatch the action request.
                        const actionRequest = stepDescriptor.actions.exit[exitActionIndex];
                        const dispatcherRequest = {
                            actionRequest: actionRequest,
                            context: {
                                dataPath: controllerDataPath,
                                cds: opcRef._private.controllerData,
                                act: opcRef.act
                            }
                        };
                        const actionResponse = opcRef._private.actionDispatcher.request(dispatcherRequest);
                        opmInstanceFrame.evaluationResponse.actions.exit.push({ actionRequest: actionRequest, actionResponse: actionResponse });
                        if (actionResponse.error) {
                            console.error(actionResponse.error);
                            console.error(dispatcherRequest);
                            opmInstanceFrame.evaluationResponse.actions.exitErrors++;
                            opmInstanceFrame.evaluationResponse.actions.totalErrors++;
                        }
                    }

                    // TODO: Consider control flow gates based on accumulated errors.

                    // Dispatch the OPM instance's step enter action(s).
                    opmInstanceFrame.evaluationResponse.action = "step-enter-action-dispatch";
                    for (let enterActionIndex = 0 ; enterActionIndex < nextStepDescriptor.actions.enter.length ; enterActionIndex++) {
                        const actionRequest = nextStepDescriptor.actions.enter[enterActionIndex];
                        const dispatcherRequest = {
                            actionRequest: actionRequest,
                            context: {
                                dataPath: controllerDataPath,
                                cds: opcRef._private.controllerData,
                                act: opcRef.act
                            }
                        };
                        const actionResponse = opcRef._private.actionDispatcher.request(dispatcherRequest);
                        opmInstanceFrame.evaluationResponse.actions.enter.push({ actionRequest: actionRequest, actionResponse: actionResponse });
                        if (actionResponse.error) {
                            console.error(actionResponse.error);
                            console.error(dispatcherRequest);
                            opmInstanceFrame.evaluationResponse.actions.enterErrors++;
                            opmInstanceFrame.evaluationResponse.actions.totalErrors++;
                        }
                    }

                    // TODO: Consider control flow gates based on accumulated errors.

                    // Update the OPM instance's opmStep flag in the controller data store.
                    let transitionResponse = opcRef._private.controllerData.writeNamespace(`${controllerDataPath}.opmStep`, nextStep);
                    opmInstanceFrame.evaluationResponse.actions.stepTransitionResponse = transitionResponse;
                    if (transitionResponse.error) {
                        console.error(transitionResponse.error);
                        opmInstanceFrame.evaluationResponse.actions.totalErrors++;
                    }

                    opmInstanceFrame.evaluationResponse.status = "completed";
                    opmInstanceFrame.evaluationResponse.action = "transitioned";
                    opmInstanceFrame.evaluationResponse.finishStep = nextStep;

                } // controllerDataPath in evalFrame

                evalStopwatch.mark(`frame ${result.evalFrames.length} end OPM instance evaluation`);
                console.log(`> ... Finish evaluation frame ${opcRef._private.evaluationCount}:${result.evalFrames.length} ...`);
                result.evalFrames.push(evalFrame);

                // ================================================================
                // If any of the OPM instance's in the just-completed eval frame transitioned, add another eval frame.
                // Otherwise exit the outer eval loop and conclude the OPC evaluation algorithm.

                // TODO break on out as a temporary measure until the transition operators and actions are working.
                break; // ... out of the main evaluation loop

            } // while outer frame evaluation loop;
            break;

        } // while (!inBreakScope)

        if (errors.length) {
            response.error = errors.join(" "); // override response.error with a string value. by filter convention, this means that response.result is invalid.
        }

        // Note that in all cases the response descriptor object returned by ObservableProcessController:_evaluate is informational.
        // If !response.result (i.e. no error) then the following is true:
        // - There were no errors encountered while dynamically binding OPM instances in OPD.
        // - There were no errors encountered during OPM instance evaluation including transition evaluations, and consequent action request dispatches.
        // - This does not mean that your operator and action filters are correct.
        // - This does not mean that your OPM's encode what you think they do.

        result.summary.evalStopwatch = evalStopwatch.stop();
        result.summary.framesCount = result.evalFrames.length;
        response.result = result;

        console.log(`> ObservableProcessController::_evaluate  #${result.evalNumber} ${response.error?"ABORTED WITH ERROR":"completed"}.`);
        console.log(`..... OPC evalution #${result.evalNumber} sequenced ${result.summary.framesCount} frame(s) in ${result.summary.evalStopwatch.totalMicroseconds} microseconds.`);
        console.log(response);

        return response;
    },

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
