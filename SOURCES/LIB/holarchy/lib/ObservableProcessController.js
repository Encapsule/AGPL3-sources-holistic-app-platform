
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
const SimpleStopwatch = require("./util/SimpleStopwatch");
const constructorFilter = require("./filters/opc-method-constructor-filter");
const actInputFilter = require("./filters/opc-method-act-input-filter");
const actOutputFilter = require("./filters/opc-method-act-output-filter");
const evaluateFilter = require("./filters/opc-method-evaluate-filter");

const consoleStyles = require("./util/console-colors-lut");
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
    // Determines if the OPMI is valid or not.
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
    act(request_) {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        let initialActorStackDepth = 0; // default

        let stopwatch = new SimpleStopwatch("OPC::act");

        try {

            while (!inBreakScope) {
                inBreakScope = true;

                if (!this.isValid()) {
                    // Retrieve just the error string, not the entire response.
                    errors.push("Zombie instance:");
                    errors.push(this.toJSON().error);
                    break;
                }

                let filterResponse = actInputFilter.request(request_);
                if (filterResponse.error) {
                    errors.push("Bad request:");
                    errors.push(filterResponse.error);
                    break;
                }
                const request = filterResponse.result;

                // Prepare the controller action plug-in filter request descriptor object.
                const controllerActionRequest = {
                    context: {
                        opmBindingPath: request.opmBindingPath,
                        ocdi: this._private.ocdi,
                        act: this.act
                    },
                    actionRequest: request.actionRequest
                };

                // Push the actor stack.
                initialActorStackDepth = this._private.opcActorStack.length; // save the initial stack depth
                this._private.opcActorStack.push({
                    actorName: request.actorName,
                    actorTaskDescription: request.actorTaskDescription
                });

                // Log the start of the action.
                logger.request({
                    opc: { id: this._private.id, iid: this._private.iid, name: this._private.name,
                           evalCount: this._private.evalCount, frameCount: 0, actorStack: this._private.opcActorStack },
                    subsystem: "opc", method: "act", phase: "prologue",
                    message: "START ACTION..."
                });

                logger.request({
                    opc: { id: this._private.id, iid: this._private.iid, name: this._private.name,
                           evalCount: this._private.evalCount, frameCount: 0, actorStack: this._private.opcActorStack },
                    subsystem: "opc", method: "act", phase: "body",
                    message: `Task: ${request.actorTaskDescription}`
                });

                // Dispatch the action on behalf of the actor.
                let actionResponse = null;
                try {
                    // Dispatch the actor's requested action.
                    actionResponse = this._private.actionDispatcher.request(controllerActionRequest);
                    if (actionResponse.error) {
                        actionResponse = {
                            error: "Unrecognized controller action request format. Check message data syntax against registered ControllerAction plug-ins.",
                            result: actionResponse.error
                        };
                    } else {
                        let actionFilter = actionResponse.result;

                        logger.request({
                            opc: { id: this._private.id, iid: this._private.iid, name: this._private.name,
                                   evalCount: this._private.evalCount, frameCount: 0, actorStack: this._private.opcActorStack },
                            subsystem: "opc", method: "act", phase: "body",
                            message: `Dispatching action filter [${actionFilter.filterDescriptor.operationID}::${actionFilter.filterDescriptor.operationName}]...`
                        });

                        actionResponse = actionFilter.request(controllerActionRequest);
                        if (actionResponse.error) {
                            actionResponse = {
                                error: `It looks like this action request was intended for [${actionFilter.filterDescriptor.operationID}::${actionFilter.filterDescriptor.operationName}]. But, the controller action plug-in rejected the request.`,
                                result: actionResponse.error
                            };
                        }
                    }

                } catch (actionCallException_) {
                    errors.push("Handled exception during controller action dispatch: " + actionCallException_.message);
                    break;
                }

                // If a transport error occurred dispatching the controller action,
                // skip any futher processing (including a possible evaluation)
                // and return. Transport errors represent serious flaws in a derived
                // app/service that must be corrected. We skip possible evaluation
                // that would normally occur to make it simpler for developers to diagnose
                // the transport error.

                if (actionResponse.error) {
                    errors.push("Error dispatching controller action filter. Skipping any further evaluation.");
                    errors.push(actionResponse.error);
                    break;
                }

                // If no errors have occurred then there's by definition at least
                // one pending action on the actor stack. This is so because
                // controller actions may delegate to other controller actions via
                // re-entrant calls to ObservableProcessController.act method.
                // Such delegations are non-observable, i.e. they are atomic
                // with respect to OPC evaluation. So, we only re-evaluate when
                // we have finished the last of >= 1 controller action plug-in
                // filter delegations. And, this propogates the net effects of
                // the controller action as observed in the contained ocdi according

                if (this._private.opcActorStack.length === 1) {

                    logger.request({
                        opc: { id: this._private.id, iid: this._private.iid, name: this._private.name,
                               evalCount: this._private.evalCount, frameCount: 0, actorStack: this._private.opcActorStack },
                        subsystem: "opc", method: "act", phase: "body",
                        message: "SEQUENCE..."
                    });

                    // Evaluate is an actor too. It adds itself to the OPC actor stack.
                    // And is responsible itself for ensuring that it cleans up after
                    // itself no matter how it may fail.
                    let evaluateResponse = this._evaluate();
                    if (evaluateResponse.error) {
                        errors.push("Unable to evaluate OPC state after executing controller action due to error:");
                        errors.push(evaluateResponse.error);
                        break;
                    }
                    response.result = {
                        actionResult: actionResponse.result,
                        lastEvaluation: evaluateResponse.result
                    }
                }
                break;

            } // while (!inBreakScope)

            if (errors.length) {
                response.error = errors.join(" ");
            }

        } catch (exception_) {
            response.error = `ObservableProcessController.act (no-throw) caught an unexpected exception: ${exception_.message}`;
        }

        const timings = stopwatch.stop();

        if (!response.error) {

            logger.request({
                opc: { id: this._private.id, iid: this._private.iid, name: this._private.name,
                       evalCount: this._private.evalCount, frameCount: 0, actorStack: this._private.opcActorStack },
                subsystem: "opc", method: "act", phase: "epilogue",
                message: `COMPLETE in ${timings.totalMilliseconds} ms`
            });

        } else {

            logger.request({
                logLevel: "error",
                opc: { id: this._private.id, iid: this._private.iid, name: this._private.name,
                       evalCount: this._private.evalCount, frameCount: 0, actorStack: this._private.opcActorStack },
                subsystem: "opc", method: "act", phase: "epilogue",
                message: `ERROR in ${timings.totalMilliseconds} ms: ${response.error}`
            });

        }

        // Check and maintain the OPC actor stack.
        if (this.isValid()) {
            if (initialActorStackDepth !== this._private.opcActorStack.length) {
                // Check and maintain the OPC actor stack.
                if ((initialActorStackDepth + 1) !== this._private.opcActorStack.length) {
                    response.error = `Invariant assertion error: OPC.act actor stack depth off by ${this._private.opcActorStack.length - initialActorStackDepth - 1}.`; // Nope
                } else {
                    this._private.opcActorStack.pop();
                }
            }
        }

        return response;

    } // act method

    // ================================================================
    // PRIVATE IMPLEMENTATION METHODS
    // By convention underscore-prefixed class methods should never be called
    // outside of the implementation of public and private methods in this class.
    //

    // ================================================================
    _evaluate() {
        try {
            // #### sourceTag: A7QjQ3FbSBaBmkjk_F8AMw
            // Deletegate to the evaluation filter.
            if (!this.isValid()) {
                return { error: this.toJSON().error };
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
            const message = [ "ObservableProcessController:_evaluate (no-throw) caught an unexpected runtime exception: ", evaluateException_.message ].join(" ");
            // TODO: Send through the logger
            console.error(message);
            console.error(evaluateException_.stack);
            this._private.opcActorStack.pop();
            return { error: message };
        }

    } // _evaluate method

} // ObservableProcessController

module.exports = ObservableProcessController;
