/*
  O       o O       o O       o
  | O   o | | O   o | | O   o |
  | | O | | | | O | | | | O | |
  | o   O | | o   O | | o   O |
  o       O o       O o       O
*/

// @encapsule/holarchy - the keystone of holistic app platform
// Copyright (C) 2020 Christopher D. Russell for Encapsule Project

const arccore = require("@encapsule/arccore");
const SimpleStopwatch = require("../util/SimpleStopwatch");
const logger = require("../util/holarchy-logger-filter");

const opcMethodEvaluateInputSpec = require("./iospecs/opc-method-evaluate-input-spec");
const opcMethodEvaluateOutputSpec = require("./iospecs/opc-method-evaluate-output-spec");

const factoryResponse = arccore.filter.create({

    operationID: "T7PiatEGTo2dbdy8jOMHQg",
    operationName: "OPC Evaluation Filter",
    operationDescription: "Implements OPC's algorithm for locating and evaluating APM instances in the OCD shared memory space.",
    inputFilterSpec:  opcMethodEvaluateInputSpec,
    outputFilterSpec: opcMethodEvaluateOutputSpec,

    bodyFunction: function(opcEvaluateRequest_) {

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
        //        INNER LOOP (APMI EVALUATION FRAME)

        // ****************************************************************
        // Outer loop used to aid flow of control and error reporting.
        while (!inBreakScope) {
            inBreakScope = true;

            const currentActor = opcRef._private.opcActorStack[0];

            // ================================================================
            // Prologue - executed before starting the outer evaluation loop.

            logger.request({
                opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name, evalCount: opcRef._private.evalCount, frameCount: 0, actorStack: opcRef._private.opcActorStack },
                subsystem: "opc", method: "evaluate", phase: "prologue",
                message: `STARTING OPC system state update #${result.evalNumber}`
            });

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
            // one or more evaluation frames during which each bound APM is evaluated.
            // Additional frames are added so long one or more APM transitioned
            // between process steps. Or, until the maximum allowed frames / evaluation
            // limit is surpassed.

            while (result.evalFrames.length < opcRef._private.options.evaluate.maxFrames) {

                evalStopwatch.mark(`frame ${result.evalFrames.length} start APM instance binding`);

                let evalFrame = {
                    bindings: {}, // <- IRUT : APM instance frame map
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
                // FRAME-SCOPE APM INSTANCE BINDING
                // ****************************************************************
                // ****************************************************************
                // ****************************************************************

                // Dynamically locate and bind ObservableProcessModel instances based
                // on analysis of the controller data's filter specification and the
                // actual controller data values. This occurs at the prologue of the
                // outer evaluation loop in order to track the addition and removal
                // of APM-bound objects in the controller data store that may occur
                // as a side-effect of executing process model step enter and exit
                // actions.

                let namespaceQueue = [ { specPath: "~", dataPath: "~", specRef: controllerDataSpec, dataRef: controllerData } ];

                while (namespaceQueue.length) {

                    // Retrieve the next record from the queue.
                    let record = namespaceQueue.shift();

                    // We are searching the controller data for objects that are "bound" (i.e. associated with APM).
                    // The value record.dataRef is a reference to the actual data in the OCD we're currently looking at.

                    const inTypeSetResponse = arccore.types.check.inTypeSet({ value: record.dataRef, types: [ "jsObject", "jsArray" ] });
                    if (inTypeSetResponse.error || !inTypeSetResponse.result) {
                        // inTypeSet will respond with an error when asked to evaluate types that are not in the set supported by filter.
                        // So, we ignore these because by definition we don't track these in filter specs. And, what's not tracked cannot be bound to an APM.
                        // But, for types that filter does support, we actually only care to evaluate the two we asked about above;
                        // by definition finding any other type ends the possibility of binding additional APM on this branch of the controller data tree.
                        continue;
                    }

                    // Determine if the current spec namespace has an APM binding annotation.
                    if ((Object.prototype.toString.call(record.dataRef) === "[object Object]") && !record.specRef.asMap && record.specRef.____appdsl && record.specRef.____appdsl.apm) {

                        // We can here safely presume that the following construction-time invariants have been met:
                        // - ID is a valid IRUT
                        // - ID IRUT identifies a specific APM registered with this OPC instance.
                        const apmID = record.specRef.____appdsl.apm;

                        // ****************************************************************
                        // ****************************************************************
                        // We found an APM-bound namespace in the controller data.
                        const apmInstanceFrame = {
                            evalRequest: {
                                dataBinding: record,
                                initialStep: record.dataRef.__apmiStep,
                                apmRef: opcRef._private.apmMap[apmID]
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
                        evalFrame.bindings[key] = apmInstanceFrame;
                        result.summary.counts.bindings++;
                        evalFrame.summary.counts.bindings++;

                        // ****************************************************************
                        // ****************************************************************

                    } // end if apm binding on current namespace?

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
                            let newRecord = { ...record }; // DO NOT USE: arccore.util.clone(record);
                            newRecord.specPath = `${newRecord.specPath}.${key_}`;
                            newRecord.dataPath = `${newRecord.dataPath}.${key_}`;
                            newRecord.specRef = record.specRef[key_];
                            newRecord.dataRef = record.dataRef[key_];
                            namespaceQueue.push(newRecord);
                        } else {
                            if (declaredAsArray) {
                                if (Object.prototype.toString.call(record.dataRef) === "[object Array]") {
                                    for (let index = 0 ; index < record.dataRef.length ; index++) {
                                        let newRecord = { ...record }; // NO NOT USE: arccore.util.clone(record);
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
                                        let newRecord = { ...record }; // DO NOT USE: arccore.util.clone(record);
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

                // We have completed dynamically locating all instances of APM-bound data objects in the controller data store and the results are stored in the evalFrame.
                evalStopwatch.mark(`frame ${result.evalFrames.length} end APM instance binding / start APM instance evaluation`);

                if (errors.length) {
                    // If we encountered any errors locating the cells (APM instances)
                    // that we need to evaluate (defines the work to be done in the frame
                    // evaluation loop), then we do not execute the frame evaluation loop.
                    errors.unshift("PLEASE REPORT THE FOLLOWING ERROR AS A BUG:");
                    break; // from the outer evaluation loop
                }

                // ****************************************************************
                // ****************************************************************
                // ****************************************************************
                // FRAME-SCOPE APM INSTANCE EVALUATION
                // ****************************************************************
                // ****************************************************************
                // ****************************************************************

                // ================================================================
                //
                // ¯\_(ツ)_/¯ - following along? Hang on for the fun part ...
                //
                // ================================================================
                // Evaluate each discovered APM-bound object instance in the controller
                // data store. Note that we evaluate the model instances in their order
                // of discovery which is somewhat arbitrary as it depends on user-defined
                // controller data filter spec composition. Each model instance is evaluted,
                // per it's declared step-dependent transition rules. And, if the rules
                // and current data values indicate, the model is transitioned between
                // steps dispatching exit and enter actions declared optionally on the
                // step we're exiting and/or the step we're entering.

                for (let ocdPathIRUT_ in evalFrame.bindings) {

                    // Derefermce the apmInstanceFrame created during phase #0 binding.
                    const apmInstanceFrame = evalFrame.bindings[ocdPathIRUT_];

                    apmInstanceFrame.evalResponse.status = "analyzing";

                    const apmBindingPath = apmInstanceFrame.evalRequest.dataBinding.dataPath;
                    const apmRef = apmInstanceFrame.evalRequest.apmRef;
                    const initialStep = apmInstanceFrame.evalRequest.initialStep;
                    const stepDescriptor = apmRef.getStepDescriptor(initialStep);

                    let ocdResponse = opcRef._private.ocdi.readNamespace(`${apmBindingPath}.__apmiStep`);
                    if (ocdResponse.error) {
                        // We take this as a blunt indicator that cells evaluated previously in the frame have killed this cell.
                        logger.request({
                            logLevel: "info",
                            opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name, evalCount: result.evalNumber, frameCount: result.summary.counts.frames, actorStack: opcRef._private.opcActorStack },
                            subsystem: "opc", method: "evaluate", phase: "body",
                            message: `[${apmRef.getID()}::${apmRef.getName()}] was in initial step '${initialStep}'. But, now we find that it was put to death earlier in the evaluation frame. Back to dust...`
                        });
                        apmInstanceFrame.evalResponse.status = "cell-deleted";
                        apmInstanceFrame.evalResponse.finishStep = "death";
                        continue;
                    }

                    if (!stepDescriptor) {
                        /* This is really just noise
                        logger.request({
                            logLevel: "info",
                            opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name, evalCount: result.evalNumber, frameCount: result.summary.counts.frames, actorStack: opcRef._private.opcActorStack },
                            subsystem: "opc", method: "evaluate", phase: "body",
                            message: `[${apmRef.getID()}::${apmRef.getName()}] in initial terminal process step, '${initialStep}'. No process rules means to work for us. So, we're moving on...`
                        });
                        */
                        apmInstanceFrame.evalResponse.status = "noop";
                        apmInstanceFrame.evalResponse.finishStep = initialStep;
                        continue;
                    }

                    // ================================================================
                    // ================================================================
                    // ================================================================
                    // PHASE 1 - BOUND APM INSTANCE STEP TRANSITION EVALUATION
                    // ================================================================
                    // ================================================================
                    // ================================================================

                    // Evaluate the APM instance's step transition ruleset.
                    let nextStep = null; // null (default) indicates that the APM instance should remain in its current process step (i.e. no transition).

                    apmInstanceFrame.evalResponse.status = "evaluation-check-transitions";

                    for (let transitionRuleIndex = 0; transitionRuleIndex < stepDescriptor.transitions.length ; transitionRuleIndex++) {

                        const transitionRule = stepDescriptor.transitions[transitionRuleIndex];

                        const operatorRequest = {
                            context: {
                                apmBindingPath: apmBindingPath,
                                ocdi: opcRef._private.ocdi,
                                transitionDispatcher: opcRef._private.transitionDispatcher
                            },
                            operatorRequest: transitionRule.transitionIf
                        };

                        let transitionResponse;

                        try {
                            transitionResponse = opcRef._private.transitionDispatcher.request(operatorRequest);
                            if (transitionResponse.error) {
                                transitionResponse = {
                                    error: `TransitionOperator request value type cannot be routed to any registered TransitionOperator plug-in filters based on runtime type feature analysis. Please check your request format vs. registered TransitionOperator plug-in filter request signatures. ${transitionResponse.error}`
                                };
                            } else {
                                let topFilter = transitionResponse.result;
                                transitionResponse = topFilter.request(operatorRequest);
                                if (transitionResponse.error) {
                                    const errorMessage = [
                                        `TransitionOperator request was successfully parsed and routed to plug-in filter delegate [${topFilter.filterDescriptor.operationID}::${topFilter.filterDescriptor.operationName}]. But, the plug-in rejected the request with error: ${transitionResponse.error}`,
                                        "From the perspective of this error handler it's difficult to say precisely what this error means given the broad semantics of TransitionOperator filters. Here is a list of possible problems in decreasing order of liklihood:",
                                        "Your request format may be invalid above the point in the request data where the message router made its delegate selection and this error is the plug-in rejecting the request entirely.",
                                        "Or, the selected TransitionOperator plug-in filter may implement some sort of additional input value validation that constrains the permissible input beyond what's examined by the message router and TransitionOperator plug-in filters. And, you've violated API constraints.",
                                        "Or, you have made a valid request but applied the action to the wrong type of cell (i.e. you think you're acting on a cell bound to APM X but it's really bound to a Y).",
                                        "Or, the cell you're attempting to operator on is not in the correct process step or otherwise prepared to accept or take action on behalf of the caller.",
                                        "Or, there's a bug in the TransitionOperator plug-in filter itself.",
                                        "If you track down the source of this error and it's not on this list please report it!"
                                    ].join(" ");
                                    transitionResponse = {
                                        error: errorMessage
                                    };
                                }
                            }
                        } catch (topException_) {
                            transitionResponse = {
                                error: `TransitionOperator threw an illegal exception that was handled by OPC: ${topException_.message}`
                            };
                        }

                        apmInstanceFrame.evalResponse.phases.p1_toperator.push({
                            request: {
                                context: {
                                    apmBindingPath: operatorRequest.context.apmBindingPath
                                },
                                operatorRequest: operatorRequest.operatorRequest
                            },
                            response: transitionResponse
                        });

                        if (transitionResponse.error) {
                            logger.request({
                                logLevel: "error",
                                opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name, evalCount: result.evalNumber, frameCount: result.summary.counts.frames, actorStack: opcRef._private.opcActorStack },
                                subsystem: "opc", method: "evaluate", phase: "body",
                                message: transitionResponse.error
                            });
                            console.log("Offending operator request:");
                            console.warn(operatorRequest);
                            console.log("Registered operator filters:");
                            console.warn(opcRef._private.transitionDispatcherFilterMap);
                            apmInstanceFrame.evalResponse.status = "error";
                            apmInstanceFrame.evalResponse.errors.p1_toperator++;
                            apmInstanceFrame.evalResponse.errors.total++;
                            apmInstanceFrame.evalResponse.finishStep = initialStep;
                            evalFrame.summary.counts.errors++;
                            evalFrame.summary.reports.errors.push(ocdPathIRUT_);
                            result.summary.counts.errors++;
                            break; // abort evaluation of transition rules for this APM instance...
                        }
                        if (transitionResponse.result) {
                            // Setup to transition between process steps...
                            nextStep = transitionRule.nextStep; // signal a process step transition
                            apmInstanceFrame.evalResponse.status = "transitioning";
                            break; // skip evaluation of subsequent transition rules for this APM instance.
                        }

                    } // for transitionRuleIndex

                    // If we encountered any error during the evaluation of the model step's transition operators
                    // skip the remainder of the model evaluation and proceed to the next model in the frame.

                    if (apmInstanceFrame.evalResponse.status === "error") {
                        continue;
                    }

                    // If the APM instance is stable in its current process step, continue on to evaluate the next APM instance in the eval frame.
                    if (!nextStep) {
                        apmInstanceFrame.evalResponse.status = "noop";
                        apmInstanceFrame.evalResponse.finishStep = initialStep;
                        continue;
                    }

                    // Transition the APM instance to its next process step.

                    // ================================================================
                    // ================================================================
                    // ================================================================
                    // PHASE 2 - BOUND APM INSTANCE STEP EXIT DISPATCH
                    // ================================================================
                    // ================================================================
                    // ================================================================

                    // Get the stepDescriptor for the next process step that declares the actions to take on step entry.
                    const nextStepDescriptor = apmRef.getStepDescriptor(nextStep);

                    logger.request({
                        opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name, evalCount: result.evalNumber, frameCount: result.summary.counts.frames, actorStack: opcRef._private.opcActorStack },
                        subsystem: "opc", method: "evaluate", phase: "body",
                        message: `Cell process [${ocdPathIRUT_}] (${apmBindingPath}) step: "${initialStep}" ==> "${nextStep}"`
                    });

                    // Dispatch the APM instance's step EXIT action(s).

                    apmInstanceFrame.evalResponse.status = "transitioning-dispatch-exit-actions";

                    for (let exitActionIndex = 0 ; exitActionIndex < stepDescriptor.actions.exit.length ; exitActionIndex++) {

                        const actionRequest = stepDescriptor.actions.exit[exitActionIndex];

                        let actionResponse = opcRef.act({
                            actorName: `${apmRef.getID()}::${ocdPathIRUT_}`,
                            actorTaskDescription: `EXIT ACTION #${exitActionIndex}: APM [${apmRef.getID()}::${apmRef.getName()}] step "${initialStep}" on cell [${ocdPathIRUT_}]...`,
                            actionRequest: actionRequest,
                            apmBindingPath: apmBindingPath
                        });

                        apmInstanceFrame.evalResponse.phases.p2_exit.push({
                            request: actionRequest,
                            response: actionResponse
                        });

                        if (actionResponse.error) {
                            logger.request({
                                logLevel: "error",
                                opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name, evalCount: result.evalNumber, frameCount: result.summary.counts.frames, actorStack: opcRef._private.opcActorStack },
                                subsystem: "opc", method: "evaluate", phase: "body",
                                message: actionResponse.error
                            });
                            console.log("Failed EXIT action request:");
                            console.warn(actionRequest);
                            console.log("Registered controller action plug-ins:");
                            console.warn(opcRef._private.actionDispatcherFilterMap);
                            apmInstanceFrame.evalResponse.status = "error";
                            apmInstanceFrame.evalResponse.errors.p2_exit++;
                            apmInstanceFrame.evalResponse.errors.total++;
                            apmInstanceFrame.evalResponse.finishStep = initialStep;
                            evalFrame.summary.counts.errors++;
                            evalFrame.summary.reports.errors.push(ocdPathIRUT_);
                            result.summary.counts.errors++;
                            break;
                        }

                    } // for exitActionIndex

                    // If we encountered any error during the evaluation of the cell's exit actions, skip further eval of this cell and continue to the next cell in the frame.
                    if (apmInstanceFrame.evalResponse.status === "error") {
                        continue;
                    }

                    // ================================================================
                    // ================================================================
                    // ================================================================
                    // PHASE 3 - BOUND APM INSTANCE STEP ENTER DISPATCH
                    // ================================================================
                    // ================================================================
                    // ================================================================

                    // Dispatch the APM instance's step enter action(s).

                    apmInstanceFrame.evalResponse.status = "transitioning-dispatch-enter-actions";

                    for (let enterActionIndex = 0 ; enterActionIndex < nextStepDescriptor.actions.enter.length ; enterActionIndex++) {

                        const actionRequest = nextStepDescriptor.actions.enter[enterActionIndex];

                        let actionResponse = opcRef.act({
                            actorName: `${apmRef.getID()}::${ocdPathIRUT_}`,
                            actorTaskDescription: `ENTER ACTION #${enterActionIndex}: APM [${apmRef.getID()}::${apmRef.getName()}] step "${nextStep}" on cell [${ocdPathIRUT_}]...`,
                            actionRequest: actionRequest,
                            apmBindingPath: apmBindingPath
                        });

                        apmInstanceFrame.evalResponse.phases.p3_enter.push({
                            request: actionRequest,
                            response: actionResponse
                        });

                        if (actionResponse.error) {

                            logger.request({
                                logLevel: "error",
                                opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name, evalCount: result.evalNumber, frameCount: result.summary.counts.frames, actorStack: opcRef._private.opcActorStack },
                                subsystem: "opc", method: "evaluate", phase: "body",
                                message: actionResponse.error
                            });
                            console.log("Failed ENTER action request:");
                            console.warn(actionRequest);
                            console.log("Registered controller action plug-ins:");
                            console.warn(opcRef._private.actionDispatcherFilterMap);
                            apmInstanceFrame.evalResponse.status = "error";
                            apmInstanceFrame.evalResponse.errors.p3_enter++;
                            apmInstanceFrame.evalResponse.errors.total++;
                            apmInstanceFrame.evalResponse.finishStep = initialStep;
                            evalFrame.summary.counts.errors++;
                            evalFrame.summary.reports.errors.push(ocdPathIRUT_);
                            result.summary.counts.errors++;
                        }

                    } // for enterActionIndex

                    // If we encountered any error during the evaluation of the cell's enter actions, skip further eval of the cell and continue to the next cell in the frame.
                    if (apmInstanceFrame.evalResponse.status === "error") {
                        continue;
                    }

                    // ================================================================
                    // ================================================================
                    // ================================================================
                    // PHASE 4 - BOUND APM INSTANCE STEP TRANSITION FINALIZE
                    // ================================================================
                    // ================================================================
                    // ================================================================

                    // Update the APM instance's __apmiStep flag in the controller data store.
                    apmInstanceFrame.evalResponse.status = "transitioning-finalize";

                    let transitionResponse = opcRef._private.ocdi.writeNamespace(`${apmBindingPath}.__apmiStep`, nextStep);
                    apmInstanceFrame.evalResponse.phases.p4_finalize = transitionResponse;

                    if (transitionResponse.error) {
                        logger.request({
                            logLevel: "error",
                            opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name, evalCount: result.evalNumber, frameCount: result.summary.counts.frames, actorStack: opcRef._private.opcActorStack },
                            subsystem: "opc", method: "evaluate", phase: "body",
                            message: transitionResponse.error
                        });
                        apmInstanceFrame.evalResponse.status = "error";
                        apmInstanceFrame.evalResponse.errors.p4_finalize++;
                        apmInstanceFrame.evalResponse.errors.total++;
                        apmInstanceFrame.evalResponse.finishStep = initialStep;
                        evalFrame.summary.counts.errors++;
                        evalFrame.summary.reports.errors.push(ocdPathIRUT_);
                        result.summary.counts.errors++;
                    } else {
                        apmInstanceFrame.evalResponse.status = "transitioned";
                        evalFrame.summary.counts.transitions++;
                        evalFrame.summary.reports.transitions.push(ocdPathIRUT_);
                        result.summary.counts.transitions++;
                        apmInstanceFrame.evalResponse.finishStep = nextStep;
                    }
                } // apmBindingPath in evalFrame

                evalStopwatch.mark(`frame ${result.evalFrames.length} end APM instance evaluation`);

                result.evalFrames.push(evalFrame);
                result.summary.counts.frames++;

                // ================================================================
                // If any of the APM instance's in the just-completed eval frame transitioned, add another eval frame.
                // Otherwise exit the outer eval loop and conclude the OPC evaluation algorithm.

                /*
                if (evalFrame.summary.counts.errors) {
                    // Bail out of the frame loop if the frame we just evaluated had errors. There should be no errors on the control plane of an OPC.
                    result.error = "ObservableProcessController evaluation aborted due to frame-scope error(s).";
                    break;
                }
                */

                if (!evalFrame.summary.counts.transitions) {
                    // Exit the frame loop when the evaluation of the last frame resulted in no APMI step transitions.
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
        // If !response.error (i.e. no error) then the following is true:
        // - There were no errors encountered while dynamically binding APM instances in OCD.
        // - There were no errors encountered during APM instance evaluation including transition evaluations, and consequent action request dispatches.
        // - This does not mean that your operator and action filters are correct.
        // - This does not mean that your APM's encode what you think they do.

        result.summary.evalStopwatch = evalStopwatch.stop();
        result.summary.framesCount = result.evalFrames.length;

        logger.request({
            errorLevel: response.error?"error":"info",
            opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name,
                   evalCount: opcRef._private.evalCount, frameCount: result.summary.framesCount-1,
                   actorStack: opcRef._private.opcActorStack },
            subsystem: "opc", method: "evaluate", phase: "epilogue",
            message: `COMPLETE OPC system state update #${result.evalNumber}. Completed ${result.summary.framesCount} eval frame(s) in ${result.summary.evalStopwatch.totalMilliseconds} ms.`
        });

        response.result = result;
        return response;
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
