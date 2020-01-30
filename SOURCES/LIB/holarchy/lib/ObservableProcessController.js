
const arccore = require("@encapsule/arccore");
const constructorFilter = require("./filters/opc-method-constructor-filter");
const actInputFilter = require("./filters/opc-method-act-input-filter");
const actOutputFilter = require("./filters/opc-method-act-output-filter");
const evaluateFilter = require("./filters/opc-method-evaluate-filter");

const consoleStyles = require("./util/console-colors-lut");
const logger = require("./util/holarchy-logger-filter");

class ObservableProcessController {

    constructor(request_) {

        // #### sourceTag: Gql9wS2STNmuD5vvbQJ3xA

        try {

            let errors = [];
            let inBreakScope = false;

            // Allocate private per-class-instance state.
            this._private = {};


            console.log("%cOPC::constructor starting...", consoleStyles.opc.constructor.entry);

            logger.request({
                opc: { id: request_?request_.id:undefined, name: request_?request_.name:undefined },
                subsystem: "opc", method: "constructor",
                message: "WTF Starting",
            });

            while (!inBreakScope) {
                inBreakScope = true;

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

                // ****************************************************************
                // ****************************************************************
                // KEEP A COPY OF THE NORMALIZED OUTPUT OF THE CONSTRUCTION FILTER
                // We no longer care about the request input; internal methods
                // should only access this._private. Clients of this class should
                // not deference data in an OPC instance's _private namespace.
                // The names, types, and semantics of this information can change
                // release to release as an implementation of this library. Only
                // ever rely on public methods which we will try to keep stable.
                //

                this._private = filterResponse.result;

                // Perform the first post-construction evaluation of the OPC system model
                // if the instance was constructed in "automatic" evaluate mode.
                if (this._private.options.evaluate.firstEvaluation === "constructor") {

                    filterResponse = this.act({
                        actorName: "ObservableProcessController::constructor",
                        actionDescription: "Performing default post-construction runtime state evaluation.",
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

            if (errors.length) {
                errors.unshift(`ObservableProcessController::constructor for [${(request_ && request_.id)?request_.id:"unspecified"}::${(request_ && request_.name)?request_.name:"unspecified"}] failed yielding a zombie instance.`);
                this._private.constructionError = { error: errors.join(" ") };
            }

            if (this._private.constructionError) {
                console.error(`%cOPC::constructor failed: ${this._private.constructionError.error}`, consoleStyles.error);

                logger.request({
                    logLevel: "error",
                    opc: {
                        id: request_?request_.id:undefined,
                        iid: this._private.iid,
                        name: this._private.name,
                    },
                    subsystem: "opc", method: "constructor",
                    message: "Error.",
                });

            } else {
                console.log("%cOPC::constructor complete.", consoleStyles.opc.constructor.success);

                logger.request({
                    opc: { id: this._private.id, iid: this._private.iid, name: this._private.name, evalCount: this._private.evalCount, frameCount: 0, actorStack: this._private.opcActorStack },
                    subsystem: "opc", method: "constructor",
                    message: "Complete.",
                });
            }

        } catch (exception_) {
            const message = [ "ObserverableProcessController::constructor (no-throw) caught an unexpected runtime exception: ", exception_.message ].join(" ");
            this._private.constructionError = message;
            console.error(message);
            console.error(exception_.stack);
        }

    } // end constructor function

    // ================================================================
    // PUBLIC API METHODS
    // All external interactions with an ObservableProcessController class instance
    // should be via public API methods. Do not dereference the _private data
    // namespace or call underscore-prefixed private class methods.

    // Determines if the OPMI is valid or not.

    // Called w/no options_, returns Boolean true iff ObservableProcessController::constructor succeeded. Otherwise false.
    isValid(options_) {
        try {
            if (!options_ || !options_.getError) {
                return this._private.constructionError?false:true;
            }
            return {
                error: this._private.constructionError?this._private.constructionError.error:null,
                result: this._private
            };
        } catch (exception_) {
            const message = [ "ObservableProcessController::isValid (no-throw) caught an unexpected runtime exception: ", exception_.message ].join(" ");
            console.error(message);
            console.error(exception_.stack);
            return { error: message };
        }
    }

    // Produces a serializable object representing the internal state of this OPCI.
    toJSON() {
        try {
            if (!this.isValid()) {
                return this.isValid({ getError: true });
            }
            return this._private;
        } catch (exception_) {
            const message = [ "ObservableProcessController.toJSON (no-throw) caught an unexpected runtime exception: ", exception_.message ].join(" ");
            console.error(message);
            console.error(exception_.stack);
            return { error: message };
        }
    } // toJSON method


    act(request_) {
        try {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;

            while (!inBreakScope) {
                inBreakScope = true;

                if (!this.isValid()) {
                    // Retrieve just the error string, not the entire response.
                    errors.push("Zombie instance:");
                    errors.push(this.toJSON());
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
                this._private.opcActorStack.push({
                    actorName: request.actorName,
                    actionDescription: request.actionDescription
                });

                const styles = (this._private.opcActorStack.length === 1)?consoleStyles.opc.act.entry:consoleStyles.opc.act.levelN;

                console.log(`%cOPC::act [${this._private.opcActorStack.length}] Actor: '${request.actorName}' Task: '${request.actionDescription}'`, styles);

                let actionResponse = null;
                try {
                    // Dispatch the actor's requested action.
                    // TODO: It would be more informative to convert this DMR to return the filter so we can see the mapping prior to dispatch.
                    actionResponse = this._private.actionDispatcher.request(controllerActionRequest);
                } catch (actionCallException_) {
                    errors.push("Handled exception dispatch controller action: " + actionCallException_.message);
                    this_.private.opcActorStack.pop();
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
                    this._private.opcActorStack.pop();
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

                    let evaluateResponse = this._evaluate();
                    if (evaluateResponse.error) {
                        errors.push("Unable to evaluate OPC state after executing controller action due to error:");
                        errors.push(evaluateResponse.error);
                        this._private.opcActorStack.pop();
                        break;
                    }
                    response.result = {
                        actionResult: actionResponse.result,
                        lastEvaluation: evaluateResponse.result
                    }
                }
                this._private.opcActorStack.pop();
                break;
            }

            if (errors.length) {
                response.error = errors.join(" ");
                console.error(`OPC.act transport error: ${response.error}`);
            }

            return response;
        } catch (exception_) {
            const message = [ "ObservableProcessController.act (no-throw) caught an unexpected exception: ", exception_.message ].join(" ");
            console.error(message);
            console.error(exception_.stack);
            return { error: message };
        }

    } // act method

    // ================================================================
    // PRIVATE IMPLEMENTATION METHODS
    // By convention underscore-prefixed class methods should never be called
    // outside of the implementation of public and private methods in this class.
    //

    _evaluate() {
        try {
            // #### sourceTag: A7QjQ3FbSBaBmkjk_F8AMw
            // Deletegate to the evaluation filter.
            if (!this.isValid()) {
                return { error: this.toJSON() };
            }
            if (this._private.opcActorStack.length !== 1) {
                return {
                    error: `Precondition violation: Unexpected actor call stack depth of ${this._private.opcActorStack.length} found.`
                };
            }
            const evalFilterResponse = evaluateFilter.request({ opcRef: this });
            this._private.lastEvalResponse =  evalFilterResponse;
            this._private.evalCount++;
            this._private.opcActorStack.pop();
            return evalFilterResponse;
        } catch (evaluateException_) {
            const message = [ "ObservableProcessController:_evaluate (no-throw) caught an unexpected runtime exception: ", evaluateException_.message ].join(" ");
            console.error(message);
            console.error(exception_.stack);
            this._private.opcActorStack.pop();
            return { error: message };
        }
    } // _evaluate method

}

module.exports = ObservableProcessController;
