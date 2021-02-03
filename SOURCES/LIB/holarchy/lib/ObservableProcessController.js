
/*
  O       o O       o O       o
  | O   o | | O   o | | O   o |
  | | O | | | | O | | | | O | |
  | o   O | | o   O | | o   O |
  o       O o       O o       O
*/

// @encapsule/holarchy Copyright (C) 2021 Christopher D. Russell for Encapsule Project

// ObservableProcessController.js

/*
  ObservableProcessController is configured per-CellProcessor-instance to host
  a specific class of cellular runtime services composed of active cells
  (memory objects managed by ObservableProcessController) associated N:1 with
  AbstractProcessModel declarations (registered w/the ObservableProcessController
  instance at class instance construction).
*/

const arccore = require("@encapsule/arccore");
const SimpleStopwatch = require("./util/SimpleStopwatch");
const constructorFilter = require("./filters/opc-method-constructor-filter");

const actFilter = require("./filters/opc-method-act-filter");
const evaluateFilter = require("./filters/opc-method-evaluate-filter");

const logger = require("./util/holarchy-logger-filter");

class ObservableProcessController {

    // ================================================================
    constructor(request_) {

        // #### sourceTag: Gql9wS2STNmuD5vvbQJ3xA
        const stopwatch = new SimpleStopwatch("OPC::constructor");

        let errors = [];
        let inBreakScope = false;

        // Allocate private per-class-instance state.
        this._private = {};


        try {

            while (!inBreakScope) {
                inBreakScope = true;

                // ----------------------------------------------------------------
                logger.request({
                    opc: { id: request_?request_.id:undefined, name: request_?request_.name:undefined },
                    subsystem: "opc", method: "constructor", phase: "prologue",
                    message: "STARTING...",
                });

                // ----------------------------------------------------------------
                // Bind instance methods.
                // public
                this.isValid = this.isValid.bind(this);
                this.toJSON = this.toJSON.bind(this);
                this.act = this.act.bind(this);
                // private
                this._evaluate = this._evaluate.bind(this);

                // ----------------------------------------------------------------
                // Normalize the incoming request descriptor object.
                let filterResponse = constructorFilter.request(request_);
                if (filterResponse.error) {
                    errors.push("Failed while processing constructor request.");
                    errors.push(filterResponse.error);
                    break;
                }

                // ----------------------------------------------------------------
                // Keep a copy of the normalized output of the constructor filter.
                // The caller's request_ value is no longer used after this point.
                this._private = filterResponse.result;

                logger.request({
                    opc: { id: this._private.id, iid: this._private.iid, name: this._private.name },
                    subsystem: "opc", method: "constructor", phase: "body",
                    message: `OPC instance "${this._private.iid}" initialized!`
                });

                // Perform the first post-construction evaluation of the OPC system model
                // if the instance was constructed in "automatic" evaluate mode.
                if (this._private.options.evaluate.firstEvaluation === "constructor") {

                    logger.request({
                        opc: { id: this._private.id, iid: this._private.iid, name: this._private.name },
                        subsystem: "opc", method: "constructor", phase: "body",
                        message: `Performing first cell runtime plane evaluation on OPC instance "${this._private.iid}"...`
                    });

                    filterResponse = this.act({
                        actorName: "ObservableProcessController::constructor",
                        actorTaskDescription: "Performing initial post-construction system evaluation.",
                        actionRequest: { holarchy: { opc: { noop: true } } }
                    });

                    if (filterResponse.error) {
                        errors.push("Failed while executing the first post-construction system evaluation:");
                        errors.push(filterResponse.error);
                        break;
                    }
                } else {
                    logger.request({
                        opc: { id: this._private.id, iid: this._private.iid, name: this._private.name },
                        subsystem: "opc", method: "constructor", phase: "body",
                        message: `First cell runtime plane evaluation on OPC instance "${this._private.iid}" has been defferred until first action request...`
                    });

                }
                break;

            } // while(!inBreakScope)

        } catch (exception_) {
            errors.push(`ObserverableProcessController::constructor (no-throw) caught an unexpected runtime exception: ${exception_.message}`);
        }

        const timings = stopwatch.stop();

        if (!errors.length) {
            logger.request({
                opc: { id: this._private.id, iid: this._private.iid, name: this._private.name, evalCount: this._private.evalCount, frameCount: 0, actorStack: this._private.opcActorStack },
                subsystem: "opc", method: "constructor", phase: "epilogue",
                message: `COMPLETE in ${timings.totalMilliseconds} ms.`,
            });
        } else {
            errors.unshift(`ObservableProcessController::constructor for [${(request_ && request_.id)?request_.id:"unspecified"}::${(request_ && request_.name)?request_.name:"unspecified"}] failed yielding a zombie instance.`);
            this._private.constructionError = errors.join(" ");

            logger.request({
                logLevel: "error",
                opc: {
                    id: request_?request_.id:undefined,
                    iid: this._private.iid,
                    name: this._private.name,
                },
                subsystem: "opc", method: "constructor", phase: "epilogue",
                message: `ERROR in ${timings.totalMillisconds}: ${this._private.constructionError}`
            });

        }

    } // end constructor function

    // ================================================================
    // PUBLIC API METHODS
    // All external interactions with an ObservableProcessController class instance
    // should be via public API methods. Do not dereference the _private data
    // namespace or call underscore-prefixed private class methods.

    // ================================================================
    // Determines if the OPCI is valid or not.
    isValid() {
        return this._private.constructionError?false:true;
    }

    // ================================================================
    // Produces a serializable object representing the internal state of this OPCI.
    // Iff the instance is invalid, then it returns a filter response object w/error set.
    toJSON() {
        // TODO: This is totally inadequate for more than v0.0.x testing.
        // Actual serialization of an active OPC system is the goal. And,
        // this will take additional work because there's not currently
        // enough context in an OPC instance to actually accomplish the
        // task of suspending a running observable process(es) and re-
        // animating them later (potentially somewhere else) in a generic
        // way that will work for arbitrary use of the OCD store. More
        // about this later.
        return (!this._private.constructionError?this._private:{ error: this._private.constructionError });
    } // toJSON method

    // ================================================================
    // Call a ControllerAction plug-in and evaluate all cell processes. Returns a filter response object.
    act(request_) {
        try {
            // #### sourceTag: i7SBVHM6Tt-AmRRuufzh9g
            if (!this.isValid) {
                return this.toJSON();
            }

            const actFilterResponse = actFilter.request({ opcRef: this, ...request_ });

            return actFilterResponse;

        } catch (actException_) {
            const message = [ "ObservableProcessController::act (no-throw) caught an unexpected runtime expection: ", actException_.message ].join(" ");
            console.error(message);
            console.error(actException_.stack);
            return { error: message };
        }
    } // act method

    // ================================================================
    // PRIVATE IMPLEMENTATION METHODS
    // By convention underscore-prefixed class methods should never be called
    // outside of the implementation of public and private methods in this class.
    //

    // ================================================================
    // Evaluate all cell processes. Returns a filter response object.
    _evaluate() {
        try {
            // #### sourceTag: A7QjQ3FbSBaBmkjk_F8AMw
            // Deletegate to the evaluation filter.
            if (!this.isValid()) {
                return toJSON();
            }
            if (this._private.opcActorStack.length !== 1) {
                return {
                    error: `Precondition violation: Unexpected actor call stack depth of ${this._private.opcActorStack.length} found.`
                };
            }
            this._private.opcActorStack.push({
                actorName: "OPC._evaluate",
                actorTaskDescription: `Respond to the actions of actor '${this._private.opcActorStack[0].actorName}'.`
            });
            const evalFilterResponse = evaluateFilter.request({ opcRef: this });
            this._private.lastEvalResponse =  evalFilterResponse;
            this._private.evalCount++;
            this._private.opcActorStack.pop();
            return evalFilterResponse;
        } catch (evaluateException_) {
            const message = [ "ObservableProcessController::_evaluate (no-throw) caught an unexpected runtime exception: ", evaluateException_.message ].join(" ");
            // TODO: Send through the logger
            console.error(message);
            console.error(evaluateException_.stack);
            this._private.opcActorStack.pop();
            return { error: message };
        }
    } // _evaluate method
} // ObservableProcessController

module.exports = ObservableProcessController;
