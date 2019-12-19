
// Copyright (C) 2019 Christopher D. Russell

const arccore = require("@encapsule/arccore");
const SimpleStopwatch = require("../util/SimpleStopwatch");

const opcMethodEvaluateInputSpec = require("./iospecs/opc-method-evaluate-input-spec");
const opcMethodEvaluateOutputSpec = require("./iospecs/opc-method-evaluate-output-spec");

const factoryResponse = arccore.filter.create({

    operationID: "T7PiatEGTo2dbdy8jOMHQg",
    operationName: "OPC Evaluation Filter",
    operationDescription: "Encapsulates the OPC's core OPM instance evaluation algorithm providing a detailed audit trail of the algorithm's execution.",
    inputFilterSpec:  opcMethodEvaluateInputSpec,
    outputFilterSpec: opcMethodEvaluateOutputSpec,

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
        const evalStopwatch = new SimpleStopwatch(`OPC evaluation #${opcRef._private.evalCount} stopwatch`);

        let result = {
            evalNumber: opcRef._private.evalCount,
            summary: {
                evalStopwatch: null,
                counts: {
                    bindings: 0,
                    frames: 0,
                    errors: 0,
                    transitions: 0
                }
            },
            evalFrames: [] // <- each iteration of the outer "frames" loop pushes an evalFrame descriptor
        };

        // OUTER LOOP (CONTROL FLOW AND ERROR REPORTING)
        //    MIDDLE LOOP (OPCI EVALUATION FRAME)
        //        INNER LOOP (OPMI EVALUATION FRAME)

        // ****************************************************************
        // Outer loop used to aid flow of control and error reporting.
        while (!inBreakScope) {
            inBreakScope = true;

            // ================================================================
            // Prologue - executed before starting the outer evaluation loop.

            console.log("================================================================");
            console.log(`> ObservableProcessController::_evaluate starting system evaluation ${opcRef._private.evalCount} ...`);

            // Get a reference to the entire filter spec for the controller data store.
            let filterResponse = opcRef._private.ocdi.getNamespaceSpec("~");
            if (filterResponse.error) {
                errors.push("Fatal internal error:");
                errors.push(filterResponse.error);
                break;
            }
            const controllerDataSpec = filterResponse.result;

            // ================================================================
            // OUTER "EVALUATION FRAME" LOOP.
            // An a single call to the _evaluate method comprises a sequence of
            // one or more evaluation frames during which each bound OPM is evaluated.
            // Additional frames are added so long one or more OPM transitioned
            // between process steps. Or, until the maximum allowed frames / evaluation
            // limit is surpassed.

            while (result.evalFrames.length < opcRef._private.options.evaluate.maxFrames) {

                evalStopwatch.mark(`frame ${result.evalFrames.length} start OPM instance binding`);

                let evalFrame = {
                    bindings: {}, // <- IRUT : OPM instance frame map
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
                };

                // Get a reference to the controller data.
                filterResponse = opcRef._private.ocdi.readNamespace("~");
                if (filterResponse.error) {
                    errors.push("Fatal internal error:");
                    errors.push(filterResponse.error);
                    break;
                }
                const controllerData = filterResponse.result;

                // ****************************************************************
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

                        // We can here safely presume that the following
                        // construction-time invariants have been met:
                        // - ID is a valid IRUT
                        // - ID IRUT identifies a specific OPM registered with this OPC instance.
                        const opmID = record.specRef.____appdsl.opm;

                        // ****************************************************************
                        // ****************************************************************
                        // We found an OPM-bound namespace in the controller data.
                        const opmInstanceFrame = {
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
                        };

                        // Generate an IRUT based on the CDS path to use as key in the binding map.
                        const key = arccore.identifier.irut.fromReference(record.dataPath).result;

                        // Register the new binding the the evalFrame.
                        evalFrame.bindings[key] = opmInstanceFrame;
                        result.summary.counts.bindings++;
                        evalFrame.summary.counts.bindings++;

                        console.log(`..... ..... controller data path '${record.dataPath}' bound to OPM '${opmID}'`);
                        console.log("opmInstanceFrame=")
                        console.log(opmInstanceFrame);
                        // ****************************************************************
                        // ****************************************************************

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
                    // TODO: I don't think we're handling errors here correctly?
                    break; // from the outer evaluation loop
                }

                // ****************************************************************
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

                for (let ocdPathIRUT_ in evalFrame.bindings) {

                    // Derefermce the opmInstanceFrame created during phase #0 binding.
                    const opmInstanceFrame = evalFrame.bindings[ocdPathIRUT_];

                    opmInstanceFrame.evalResponse.status = "analyzing";

                    const opmBindingPath = opmInstanceFrame.evalRequest.dataBinding.dataPath;
                    const opmRef = opmInstanceFrame.evalRequest.opmRef;
                    const initialStep = opmInstanceFrame.evalRequest.initialStep;
                    const stepDescriptor = opmRef.getStepDescriptor(initialStep);

                    console.log(`..... Evaluting '${opmBindingPath}' instance of ${opmRef.getID()}::${opmRef.getName()} ...`);
                    console.log(`..... ..... model instance is currently at process step '${initialStep}' stepDescriptor=`);
                    console.log("stepDescriptor=");
                    console.log(stepDescriptor);

                    if (!stepDescriptor) {
                        console.warn(`No step descriptor in model for [${opmRef.getID()}::${opmRef.getName()}] for step '${initialStep}'. Ignoring.`);
                        opmInstanceFrame.evalResponse.status = "noop";
                        opmInstanceFrame.evalResponse.finishStep = initialStep;
                        continue;
                    }

                    // ================================================================
                    // ================================================================
                    // ================================================================
                    // PHASE 1 - BOUND OPM INSTANCE STEP TRANSITION EVALUATION
                    // ================================================================
                    // ================================================================
                    // ================================================================

                    // Evaluate the OPM instance's step transition ruleset.
                    let nextStep = null; // null (default) indicates that the OPM instance should remain in its current process step (i.e. no transition).

                    opmInstanceFrame.evalResponse.status = "evaluation-check-transitions";

                    for (let transitionRuleIndex = 0; transitionRuleIndex < stepDescriptor.transitions.length ; transitionRuleIndex++) {

                        const transitionRule = stepDescriptor.transitions[transitionRuleIndex];

                        const operatorRequest = {
                            context: {
                                opmBindingPath: opmBindingPath,
                                ocdi: opcRef._private.ocdi,
                                transitionDispatcher: opcRef._private.transitionDispatcher
                            },
                            operatorRequest: transitionRule.transitionIf
                        };

                        let transitionResponse;

                        try {
                            transitionResponse = opcRef._private.transitionDispatcher.request(operatorRequest);
                        } catch (topException_) {
                            console.error(topException_);
                            transitionResponse = {
                                error: `TransitionOperator threw an illegal exception that was handled by OPC: ${topException_.message}`
                            };
                        }

                        opmInstanceFrame.evalResponse.phases.p1_toperator.push({
                            request: operatorRequest,
                            response: transitionResponse
                        });

                        if (transitionResponse.error) {
                            console.error(transitionResponse.error);
                            opmInstanceFrame.evalResponse.status = "error";
                            opmInstanceFrame.evalResponse.errors.p1_toperator++;
                            opmInstanceFrame.evalResponse.errors.total++;
                            opmInstanceFrame.evalResponse.finishStep = initialStep;
                            evalFrame.summary.counts.errors++;
                            evalFrame.summary.reports.errors.push(ocdPathIRUT_);
                            result.summary.counts.errors++;
                            break; // abort evaluation of transition rules for this OPM instance...
                        }
                        if (transitionResponse.result) {
                            // Setup to transition between process steps...
                            nextStep = transitionRule.nextStep; // signal a process step transition
                            opmInstanceFrame.evalResponse.status = "transitioning";
                            break; // skip evaluation of subsequent transition rules for this OPM instance.
                        }

                    } // for transitionRuleIndex

                    // If we encountered any error during the evaluation of the model step's transition operators
                    // skip the remainder of the model evaluation and proceed to the next model in the frame.

                    if (opmInstanceFrame.evalResponse.status === "error") {
                        continue;
                    }

                    // If the OPM instance is stable in its current process step, continue on to evaluate the next OPM instance in the eval frame.
                    if (!nextStep) {
                        opmInstanceFrame.evalResponse.status = "noop";
                        opmInstanceFrame.evalResponse.finishStep = initialStep;
                        continue;
                    }

                    // Transition the OPM instance to its next process step.

                    // ================================================================
                    // ================================================================
                    // ================================================================
                    // PHASE 2 - BOUND OPM INSTANCE STEP EXIT DISPATCH
                    // ================================================================
                    // ================================================================
                    // ================================================================

                    // Get the stepDescriptor for the next process step that declares the actions to take on step entry.
                    const nextStepDescriptor = opmRef.getStepDescriptor(nextStep);

                    // Dispatch the OPM instance's step exit action(s).

                    opmInstanceFrame.evalResponse.status = "transitioning-dispatch-exit-actions";

                    for (let exitActionIndex = 0 ; exitActionIndex < stepDescriptor.actions.exit.length ; exitActionIndex++) {
                        // Dispatch the action request.
                        const actionRequest = stepDescriptor.actions.exit[exitActionIndex];
                        const dispatcherRequest = {
                            actionRequest: actionRequest,
                            context: {
                                opmBindingPath: opmBindingPath,
                                ocdi: opcRef._private.ocdi,
                                act: opcRef.act
                            }
                        };

                        let actionResponse;
                        try {
                            actionResponse = opcRef._private.actionDispatcher.request(dispatcherRequest);
                        } catch (actException_) {
                            console.error(actException_);
                            actionResponse = {
                                error: `ControllerAction threw an illegal exception that was handled by OPC: ${actException_}`
                            };
                        }

                        opmInstanceFrame.evalResponse.phases.p2_exit.push({
                            request: actionRequest,
                            response: actionResponse
                        });

                        if (actionResponse.error) {
                            console.error(actionResponse.error);
                            opmInstanceFrame.evalResponse.status = "error";
                            opmInstanceFrame.evalResponse.errors.p2_exit++;
                            opmInstanceFrame.evalResponse.errors.total++;
                            opmInstanceFrame.evalResponse.finishStep = initialStep;
                            evalFrame.summary.counts.errors++;
                            evalFrame.summary.reports.errors.push(ocdPathIRUT_);
                            result.summary.counts.errors++;
                            break;
                        }
                    }

                    // If we encountered any error during the evaluation of the model step's exit actions skip
                    // the remainder of the model evaluation and proceed to the next model in the frame.

                    if (opmInstanceFrame.evalResponse.status === "error") {
                        continue;
                    }

                    // ================================================================
                    // ================================================================
                    // ================================================================
                    // PHASE 3 - BOUND OPM INSTANCE STEP ENTER DISPATCH
                    // ================================================================
                    // ================================================================
                    // ================================================================

                    // Dispatch the OPM instance's step enter action(s).
                    opmInstanceFrame.evalResponse.status = "transitioning-dispatch-enter-actions";

                    for (let enterActionIndex = 0 ; enterActionIndex < nextStepDescriptor.actions.enter.length ; enterActionIndex++) {
                        const actionRequest = nextStepDescriptor.actions.enter[enterActionIndex];
                        const dispatcherRequest = {
                            actionRequest: actionRequest,
                            context: {
                                opmBindingPath: opmBindingPath,
                                ocdi: opcRef._private.ocdi,
                                act: opcRef.act
                            }
                        };

                        let actionResponse;

                        try {
                            actionResponse = opcRef._private.actionDispatcher.request(dispatcherRequest);
                        } catch (actException_) {
                            console.error(actException_)
                            actionResponse = {
                                error: `ControllerAction threw an illegal exception that was handled by the OPC: ${actException_.message}`
                            }
                        }

                        opmInstanceFrame.evalResponse.phases.p3_enter.push({
                            request: actionRequest,
                            response: actionResponse
                        });

                        if (actionResponse.error) {
                            console.error(actionResponse.error);
                            opmInstanceFrame.evalResponse.status = "error";
                            opmInstanceFrame.evalResponse.errors.p3_enter++;
                            opmInstanceFrame.evalResponse.errors.total++;
                            opmInstanceFrame.evalResponse.finishStep = initialStep;
                            evalFrame.summary.counts.errors++;
                            evalFrame.summary.reports.errors.push(ocdPathIRUT_);
                            result.summary.counts.errors++;
                        }

                    }
                    // If we encountered any error during the evaluation of the model step's enter actions skip
                    // the remainder of the model evaluation and proceed to the next model in the frame.

                    if (opmInstanceFrame.evalResponse.status === "error") {
                        continue;
                    }

                    // ================================================================
                    // ================================================================
                    // ================================================================
                    // PHASE 4 - BOUND OPM INSTANCE STEP TRANSITION FINALIZE
                    // ================================================================
                    // ================================================================
                    // ================================================================

                    // Update the OPM instance's __opmiStep flag in the controller data store.
                    opmInstanceFrame.evalResponse.status = "transitioning-finalize";

                    let transitionResponse = opcRef._private.ocdi.writeNamespace(`${opmBindingPath}.__opmiStep`, nextStep);
                    opmInstanceFrame.evalResponse.phases.p4_finalize = transitionResponse;

                    if (transitionResponse.error) {
                        console.error(transitionResponse.error);
                        opmInstanceFrame.evalResponse.status = "error";
                        opmInstanceFrame.evalResponse.errors.p4_finalize++;
                        opmInstanceFrame.evalResponse.errors.total++;
                        opmInstanceFrame.evalResponse.finishStep = initialStep;
                        evalFrame.summary.counts.errors++;
                        evalFrame.summary.reports.errors.push(ocdPathIRUT_);
                        result.summary.counts.errors++;
                    } else {
                        opmInstanceFrame.evalResponse.status = "transitioned";
                        evalFrame.summary.counts.transitions++;
                        evalFrame.summary.reports.transitions.push(ocdPathIRUT_);
                        result.summary.counts.transitions++;
                        opmInstanceFrame.evalResponse.finishStep = nextStep;
                    }

                } // opmBindingPath in evalFrame

                evalStopwatch.mark(`frame ${result.evalFrames.length} end OPM instance evaluation`);
                console.log(`> ... Finish evaluation frame ${opcRef._private.evalCount}:${result.evalFrames.length} ...`);

                result.evalFrames.push(evalFrame);
                result.summary.counts.frames++;

                // ================================================================
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
                errors.push(`Max evaluation frame limit of ${opcRef._private.options.evaluate.maxFrames} was reached before evaluation completed.`);
                break;
            }

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

        return response;
    },

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
