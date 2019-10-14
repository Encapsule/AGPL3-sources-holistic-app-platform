
const maxEvalFrames = 64; // TODO: Migrate to constructor input w/default value.

const arccore = require("@encapsule/arccore");
const constructorRequestFilter = require("./lib/ObservableProcessController-constructor-filter");
const ControllerDataStore = require("./ControllerDataStore");

const SimpleStopwatch = require("./lib/SimpleStopwatch");

class ObservableProcessController {

    constructor(request_) {

        try {

            // Allocate private, per-class-instance state.
            this._private = {};

            // ----------------------------------------------------------------
            // Normalize the incoming request descriptor object.
            let filterResponse = constructorRequestFilter.request(request_);
            if (filterResponse.error) {
                throw new Error(filterResponse.error);
            }

            // ----------------------------------------------------------------
            // Keep a copy of the normalized request passed to the constructor.
            // TODO: Evaluate and trim as a later optimization to reduce per-instance memory overhead.
            this._private.construction = filterResponse.result;

            // ----------------------------------------------------------------
            // Build a map of ObservableControllerModel instances.
            // Note that there's a 1:N relationship between an OPM declaration and an OPM runtime instance.
            this._private.opmMap = {};
            for (let opmArray of request_.observableProcessModelSets) {
                for (let opm of opmArray) {
                    const opmID = opm.getID();
                    if (this._private.opmMap[opmID]) {
                        throw new Error(`Illegal duplicate ObservableProcessModel identifier '${opmID}' for model name '${opm.getName()}' with description '${opm.getDescription()}'.`);
                    }
                    this._private.opmMap[opmID] = opm;
                }
            }

            // ----------------------------------------------------------------
            // Build an arccore.discriminator filter instance to route transition
            // operatror request messages to a registered transition operator
            // filter for processing.
            let transitionOperatorFilters = [];
            request_.transitionOperatorSets.forEach(transitionOperatorSet_ => {
                transitionOperatorSet_.forEach(transitionOperatorInstance_ => {
                    transitionOperatorFilters.push(transitionOperatorInstance_.getFilter());
                });
            });
            if (transitionOperatorFilters.length < 2) {
                throw new Error("You must register at least two unique TransitionOperator class instances to construct an ObservableProcessController instance.");
            }
            filterResponse = arccore.discriminator.create({
                options: { action: "routeRequest" },
                filters: transitionOperatorFilters
            });
            if (filterResponse.error) {
                throw new Error(`Unable to construct a discriminator filter instance to route transition operator request messages. ${filterResponse.error}`);
            }

            // ----------------------------------------------------------------
            // Build an arccore.discrimintor filter instance to route controller
            // action request messages to a registitered controller action filter
            // for processing.
            let controllerActionFilters = [];
            request_.controllerActionSets.forEach(controllerActionSet_ => {
                controllerActionSet_.forEach(controllerActionInstance_ => {
                    controllerActionFilters.push(controllerActionInstance_.getFilter());
                });
            });
            // TODO: ASFT we may want to relax this to allow OPC instantiations that are pure FSM transition logic?
            if (controllerActionFilters.length < 2) {
                throw new Error("You must register at least two unique ControllerAction class instances to construct an ObservableProcessController instance.");
            }
            filterResponse = arccore.discriminator.create({
                options: { action: "routeRequest" },
                filters: controllerActionFilters
            });
            if (filterResponse.error) {
                throw new Error(`Unable to construct a discriminator filter instance to route controller action request messages. ${filterResponse.error}`);
            }
            this._private.actionDiscriminator = filterResponse.result;

            // Complete initialization of the instance.
            this._private.controllerData = new ControllerDataStore({ spec: request_.controllerDataSpec, data: request_.controllerData });
            this._private.evaluationCount = 0; // Keep track of the total number of calls to ObservableProcessController::_evaluate method.
            this._private.lastEvaluation = null; // This is overwritten by calls to ObservableProcessController::_evaluate

            // ----------------------------------------------------------------
            // Bind instance methods.
            // public
            this.toJSON = this.toJSON.bind(this);
            this.act = this.act.bind(this);
            // private
            this._evaluate = this._evaluate.bind(this);

            // ----------------------------------------------------------------
            // Wake the beast up...
            // TODO: I am not 100% sure it's the best choice to perform the preliminary evaluation in the constructor.

            filterResponse = this._evaluate();
            if (filterResponse.error) {
                throw new Error(filterResponse.error);
            }

        } catch (exception_) {
            throw new Error(`ObservableProcessController::constructor failed: ${exception_.stack}.`);
        }

    } // end constructor function

    // ================================================================
    // PUBLIC API METHODS
    // All external interactions with an ObservableProcessController class instance
    // should be via public API methods. Do not dereference the _private data
    // namespace or call underscore-prefixed private class methods.

    toJSON() {
        return this._private;
    } // toJSON method

    act(request_) {
        request_;
    } // act method

    // ================================================================
    // PRIVATE IMPLEMENTATION METHODS
    // By convention underscore-prefixed class methods should never be called
    // outside of the implementation of public and private methods in this class.
    //

    _evaluate() {

        // You are standing at the top of a double black diamond. There is 0.25-meter of fresh untouched powder. A raven watches from a tree. You are here alone...

        let response = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        const evalStopwatch = new SimpleStopwatch(`eval #${this._private.evaluationCount} stopwatch`);
        let evalFrames = [];

        while (!inBreakScope) {
            inBreakScope = true;

            // ================================================================
            // Prologue - executed before starting the outer evaluation loop.

            console.log("================================================================");
            console.log(`> ObservableProcessController::_evaluate starting system evaluation ${this._private.evaluationCount} ...`);

            // Traverse the controller data filter specification and find all namespace declarations containing an OPM binding.

            // Get a reference to the entire filter spec for the controller data store.
            let filterResponse = this._private.controllerData.getNamespaceSpec("~");
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            const controllerDataSpec = filterResponse.result;

            // Get a reference to the controller data.
            filterResponse = this._private.controllerData.readNamespace("~");
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            const controllerData = filterResponse.result;

            // ================================================================
            // Outer evaluation loop.
            // An a single call to the _evaluate method comprises a sequence of
            // one or more evaluation frames during which each bound OPM is evaluated.
            // Additional frames are added so long one or more OPM transitioned
            // between process steps. Or, until the maximum allowed frames / evaluation
            // limit is surpassed.

            while (evalFrames.length < maxEvalFrames) {

                evalStopwatch.mark(`frame ${evalFrames.length} start opm instance binding`);

                // ================================================================
                // Dynamically locate and bind ObservableProcessModel instances based
                // on analysis of the controller data's filter specification and the
                // actual controller data values. This occurs at the prologue of the
                // outer evaluation loop in order to track the addition and removal
                // of OPM-bound objects in the controller data store that may occur
                // as a side-effect of executing process model step enter and exit
                // actions.

                let evalFrame = {}; // A dictionary that maps controller data namespace declaration paths to their associated ObservableProcessModel class instances.
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

                    // Determine if the current spec namespace has an opm binding annotation.
                    // TODO: We should validate the controller data spec wrt opm bindings to ensure the annotation is only made on appropriately-declared non-map object namespaces w/appropriate props...
                    if (record.specRef.____appdsl && record.specRef.____appdsl.opm) {
                        const opmID = record.specRef.____appdsl.opm;
                        if (arccore.identifier.irut.isIRUT(opmID).result) {
                            if (!this._private.opmMap[opmID]) {
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
                                    opm: this._private.opmMap[opmID]
                                },
                                evaluationResponse: {
                                    status: "pending-eval"
                                }
                            };
                            evalFrame[record.dataPath] = opmInstanceFrame;
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

                evalStopwatch.mark(`frame ${evalFrames.length} end opm instance binding / start evaluation`);

                if (errors.length) {
                    break; // from the outer evaluation loop
                }

                // ================================================================
                //
                // ¯\_(ツ)_/¯ - following along? hang on for the fun part ...
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

                for (let controllerDataPath in evalFrame) {

                    const opmInstanceFrame = evalFrame[controllerDataPath];
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

                    for (let transitionIndex = 0; transitionIndex < stepDescriptor.transitions.length ; transitionIndex++) {
                        const transitionRule = stepDescriptor.transitions[transitionIndex];

                        let transitionResponse = this._private.toperatorDiscriminator.request(transitionRule.transitionIf);
                        if (transitionResponse.error) {
                            opmInstanceFrame.evaluationResponse.status = "error";
                            opmInstanceFrame.evaluationResponse.action = "stuck";
                            opmInstanceFrame.evaluationResponse.error = transitionResponse.error;
                            opmInstanceFrame.evaluationResponse.transitionIf = transitionRule.transitionIf;
                            opmInstanceFrame.evaluationResponse.finishStep = initialStep;
                            break; // abort evaluation of transition rules for this OPM instance...
                        }
                        if (transitionResponse.result) {
                            nextStep = transitionRule.nextStep; // signal a process step transition
                            opmInstanceFrame.evaluationResponse.status = "transitioning";
                            opmInstanceFrame.evaluationResponse.action = "pending";
                            opmInstanceFrame.evaluationResponse.transitionIf = transitionRule.transitionIf;
                            opmInstanceFrame.evaluationResponse.actions = { exit: [], exitErrors: 0, enter: [], enterErrors: 0, stepTransitionResponse: null, totalErrors: 0 };
                            break; // skip evaluation of subsequent transition rules for this OPM instance.
                        }
                    }

                    // If the OPM instance is stable in its current process step, continue on to evaluate the next OPM instance in the eval frame.
                    if (!nextStep && !opmInstanceFrame.evaluationResponse.error) {
                        opmInstanceFrame.evaluationResponse.status = "complete";
                        opmInstanceFrame.evaluationResponse.action = "noop";
                        opmInstanceFrame.evaluationResponse.finishStep = initialStep;
                        continue;
                    }

                    // Transition the OPM instance to its next process step.

                    // Get the stepDescriptor for the next process step that declares the actions to take on step entry.
                    const nextStepDescriptor = opmBinding.getStepDescriptor(nextStep);

                    // Dispatch the OPM instance's step exit action(s).
                    opmInstanceFrame.evaluationResponse.action = "step-exit-action-dispatch";
                    for (let exitActionIndex = 0 ; exitActionIndex < stepDescriptor.actions.exit.length ; exitActionIndex++) {
                        const actionRequest = stepDescriptor.actions.exit[exitActionIndex];
                        const actionResponse = this._private.actionDiscriminator.request(actionRequest);
                        opmInstanceFrame.evaluationResponse.actions.exit.push({ actionRequest: actionRequest, actionResponse: actionResponse });
                        if (actionResponse.error) {
                            opmInstanceFrame.evaluationResponse.actions.exitErrors++;
                            opmInstanceFrame.evaluationResponse.actions.totalErrors++;
                        }
                    }

                    // Dispatch the OPM instance's step enter action(s).
                    opmInstanceFrame.evaluationResponse.action = "step-enter-action-dispatch";
                    for (let enterActionIndex = 0 ; enterActionIndex < nextStepDescriptor.actions.enter.length ; enterActionIndex++) {
                        const actionRequest = nextStepDescriptor.actions.enter[enterActionIndex];
                        const actionResponse = this._private.actionDiscriminator.request(actionRequest);
                        opmInstanceFrame.evaluationResponse.actions.enter.push({ actionRequest: actionRequest, actionResponse: actionResponse });
                        if (actionResponse.error) {
                            opmInstanceFrame.evaluationResponse.actions.enterErrors++;
                            opmInstanceFrame.evaluationResponse.actions.totalErrors++;
                        }
                    }

                    // Update the OPM instance's opmStep flag in the controller data store.
                    let transitionResponse = this._private.controllerData.writeNamespace(`${controllerDataPath}.opmStep`, nextStep);
                    opmInstanceFrame.evaluationResponse.actions.stepTransitionResponse = transitionResponse;
                    if (transitionResponse.error) {
                        opmInstanceFrame.evaluationResponse.actions.totalErrors++;
                    }

                    opmInstanceFrame.evaluationResponse.status = "completed";
                    opmInstanceFrame.evaluationResponse.action = "transitioned";
                    opmInstanceFrame.evaluationResponse.finishStep = nextStep;

                } // controllerDataPath in evalFrame

                evalStopwatch.mark(`frame ${evalFrames.length} end evaluation`);
                console.log(`> ... Finish evaluation frame ${this._private.evaluationCount}:${evalFrames.length} ...`);
                evalFrames.push(evalFrame);

                // ================================================================
                // If any of the OPM instance's in the just-completed eval frame transitioned, add another eval frame.
                // Otherwise exit the outer eval loop and conclude the OPC evaluation algorithm.

                // TODO break on out as a temporary measure until the transition operators and actions are working.
                break; // ... out of the main evaluation loop

            } // while outer evaluation loop;
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
        response.result = {
            evalFrames: evalFrames,
            evalStopwatch: evalStopwatch.stop()
        };

        console.log(`> ObservableProcessController::_evaluate  #${this._private.evaluationCount++} ${response.error?"ABORTED WITH ERROR":"completed without error"}.`);
        console.log(response);

        this._private.lastEvaluation = response;
        return response;

    } // _evaluate method

}

module.exports = ObservableProcessController;
