
const maxEvalFrames = 64; // TODO: Migrate to constructor input w/default value.

const arccore = require("@encapsule/arccore");
const constructorRequestFilter = require("./ObservableProcessController-constructor-filter");
const ApplicationDataStore = require("../app-data-store/ApplicationDataStore");

const SimpleStopwatch = require("./lib/SimpleStopwatch");

class ObservableProcessController {

    constructor(request_) {

        try {

            // Allocate private, per-class-instance state.
            this._private = {};

            // Normalize the incoming request descriptor object.
            let filterResponse = constructorRequestFilter.request(request_);
            if (filterResponse.error) {
                throw new Error(filterResponse.error);
            }

            // Keep a copy of the normalized request passed to the constructor.
            this._private.construction = filterResponse.result;

            // Build a map of ObservableControllerModel instances.
            this._private.opmMap = {};
            for (let opmArray of request_.observableProcessModels) {
                for (let opm of opmArray) {
                    const opmID = opm.getID();
                    if (this._private.opmMap[opmID]) {
                        throw new Error(`Illegal duplicate ObservableProcessModel identifier '${opmID}' for model name '${opm.getName()}' with description '${opm.getDescription()}'.`);
                    }
                    this._private.opmMap[opmID] = opm;
                }
            }

            this._private.controllerData = new ApplicationDataStore({ spec: request_.controllerDataSpec, data: request_.controllerData });
            this._private.evaluationCount = 0;

            this._private.toperatorDiscriminator = {
                request: function(request_) {
                    console.log(request_);
                    return { error: null, result: false }; // no transition
                }
            };

            // Bind instance methods.
            // public
            this.toJSON = this.toJSON.bind(this);
            this.act = this.act.bind(this);
            // private
            this._evaluate = this._evaluate.bind(this);

            // Wake the beast up...
            filterResponse = this._evaluate();
            if (filterResponse.error) {
                throw new Error(filterResponse.error);
            }

            this._private.initialEvaluation = filterResponse.result;

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

        let response = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        const evalStopwatch = new SimpleStopwatch(`eval #${this._private.evaluationCount} stopwatch`);

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

            let evalFrameCount = 0;
            let evalFrames = [];

            while (evalFrameCount < maxEvalFrames) {

                evalStopwatch.mark(`start frame ${evalFrameCount}`);
                console.log(`> ... Starting evaluation frame ${this._private.evaluationCount}:${evalFrameCount} ...`);

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

                evalStopwatch.mark(`frame ${evalFrameCount} OPM binding complete`);

                if (errors.length) {
                    break; // from the outer evaluation loop
                }

                // ================================================================


                // ================================================================
                // Evaluate each discovered OPM-bound object instance in the controller
                // data store. Note that we evaluate the model instances in their order
                // of discovery which is somewhat arbitrary as it depends on user-defined
                // controller data filter spec composition. Each model instance is evaluted,
                // per it's declared step-dependent transition rules. And, if the rules
                // and current data values indicate, the model is transitioned between
                // steps dispatching exit actions declared on the initial step's model.
                // And, enter actions declared on the new process step's model.

                evalStopwatch.mark(`frame ${evalFrameCount} start evaluation`);

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
                            opmInstanceFrame.evaluationResponse.finishStep = initialStep;
                            break; // abort evaluation of transition rules for this OPM instance...
                        }
                        if (transitionResponse.result) {
                            nextStep = transitionRule.nextStep; // signal a process step transition
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

                    // Dispatch the OPM instance's step exit action(s).

                    // Dispatch the OPM instance's step enter action(s).

                    // Update the OPM instance's opmStep flag in the controller data store.

                }

                evalFrames.push(evalFrame);
                evalStopwatch.mark(`eval frame ${evalFrameCount} complete`);
                console.log(`> ... Finish evaluation frame ${this._private.evaluationCount}:${evalFrameCount++} ...`);

                // ================================================================
                // If any of the OPM instance's in the just-completed eval frame transitioned, add another eval frame.
                // Otherwise exit the outer eval loop and conclude the OPC evaluation algorithm.

                break; // ... out of the main evaluation loop

            } // while outer evaluation loop;


            if (errors.length) {
                break;
            }

            response.result = evalFrames;
            evalStopwatch.mark(`eval ${this._private.evaluationCount} complete`);

            break;

        } // while (!inBreakScope)

        if (errors.length) {
            response.error = errors.join(" ");
        }

        const evalStopwatchMarks = evalStopwatch.finish();

        response.result = {
            evalFrames: response.result,
            evalMarks: evalStopwatchMarks
        };

        console.log(`> ObservableProcessController::_evaluate  #${this._private.evaluationCount++} ${response.error?"aborted with error":"completed without error"}.`);
        console.log(response);
        return response;

    } // _evaluate method

}

module.exports = ObservableProcessController;
