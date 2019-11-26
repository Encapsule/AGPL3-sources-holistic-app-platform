
const arccore = require("@encapsule/arccore");
const constructorRequestFilter = require("./filters/opc-method-constructor-filter");
const evaluateFilter = require("./filters/opc-method-evaluate-filter");

class ObservableProcessController {

    constructor(request_) {

        // #### sourceTag: Gql9wS2STNmuD5vvbQJ3xA

        console.log("================================================================");
        console.log("ObservableProcessController::constructor starting...");

        let errors = [];
        let inBreakScope = false;

        // Allocate private per-class-instance state.
        this._private = {};

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
            let filterResponse = constructorRequestFilter.request(request_);
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

            // ----------------------------------------------------------------
            // Wake the beast up... Perform the initial post-construction evaluation.
            filterResponse = this._evaluate();
            if (filterResponse.error) {
                errors.push("Failed while executing the first post-construction system evaluation.");
                errors.push(filterResponse.error);
                break;
            }
            break;

        } // while(!inBreakScope)

        if (errors.length) {
            errors.unshift("ObservableProcessController::constructor failed yielding a zombie instance.");
            this._private.constructionError = { error: errors.join(" ") };
        }

        if (this._private.constructionError) {
            console.error(`ObservableProcessController::constructor failed: ${this._private.constructionError.error}`);
        } else {
            console.log("ObservableProcessController::constructor complete.");
        }

        console.log("opci=");
        console.log(this);
        console.log("================================================================");

    } // end constructor function

    // ================================================================
    // PUBLIC API METHODS
    // All external interactions with an ObservableProcessController class instance
    // should be via public API methods. Do not dereference the _private data
    // namespace or call underscore-prefixed private class methods.

    // Determines if the OPMI is valid or not.

    // Called w/no options_, returns Boolean true iff ObservableProcessController::constructor succeeded. Otherwise false.
    isValid(options_) {
        if (!options_ || !options_.getError) {
            return this._private.constructionError?false:true;
        }
        return {
            error: this._private.constructionError?this._private.constructionError.error:null,
            result: this._private.constructionError?false:true
        };
    }

    // Produces a serializable object representing the internal state of this OPCI.
    toJSON() {
        if (!this.isValid()) {
            return this.isValid({ getError: true });
        }

        return this._private;
    } // toJSON method


    act(request_) {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            if (!this.isValid()) {
                errors.push(this.toJSON()); // this digs out the construction error
                break;
            }

            // Push the actor stack.
            // If called by an external subroutine, the stack will initially be empty.
            this._private.opcActorStack.push(request_);

            // If a controller action returns an error it's considered a fatal
            // OPC transport error (i.e. operator, action, model evaluation errors).
            // Typically, actions encounter _applicaiton-level_ error conditions
            // that are stored in the OPC's contained OCD via some app-defined
            // protocol (e.g. a list of errors in a namespace in the OCD would suffice).

            let actionResponse = this._private.actionDispatcher.request(request_);

            if (actionResponse.error) {
                // If a transport error occurred dispatching the controller action,
                // skip any futher processing (including a possible evaluation)
                // and return. Transport errors represent serious flaws in a derived
                // app/service that must be corrected. We skip possible evaluation
                // below on error to make it simpler for developers to diagnose
                // the transport error.
                errors.push(actionResponse.error);
                this._private.opcActorStack.pop();
                break;
            }

            // If no transport error occured dispatching the controller action,
            // then re-evaluate the system of observable process models iff
            // the entire chain of controller action delegations initiated by
            // the external subroutine caller has completed. Note that as controller
            // actions delegate to sub-actions by calling OPC.act method this step
            // is explicitly skipped. We only re-evaluate the system when the
            // action(s) have completed their work.
            if (!this._private.opcActorStack.length === 1) {
                response = this._evaluate();
            }

            this._private.opcActorStack.pop();

            break;
        }

        if (errors.length) {
            response.error = errors.join(" ");
            console.error(`OPC.act transport error: ${response.error}`);
        }

        return response;

    } // act method

    // ================================================================
    // PRIVATE IMPLEMENTATION METHODS
    // By convention underscore-prefixed class methods should never be called
    // outside of the implementation of public and private methods in this class.
    //

    _evaluate() {
        // #### sourceTag: A7QjQ3FbSBaBmkjk_F8AMw
        console.log("================================================================");
        console.log("ObservableProcessController::_evaluate starting...");
        console.log("================================================================");
        // Deletegate to the evaluation filter.
        const evalFilterResponse = evaluateFilter.request({ opcRef: this });
        this._private.lastEvalResponse =  evalFilterResponse;
        this._private.evalCount++;
        console.log("================================================================");
        console.log("ObservableProcessController::_evaluate complete.");
        console.log("evalResponse=");
        console.log(evalFilterResponse);
        console.log("================================================================");
        return evalFilterResponse;
    } // _evaluate method

}

module.exports = ObservableProcessController;
