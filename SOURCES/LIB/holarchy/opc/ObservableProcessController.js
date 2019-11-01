
const arccore = require("@encapsule/arccore");
const constructorRequestFilter = require("./filters/ObservableProcessController-constructor-filter");
const evaluateFilter = require("./filters/ObservableProcessController-evaluate-filter");

class ObservableProcessController {

    constructor(request_) {

        // #### sourceTag: Gql9wS2STNmuD5vvbQJ3xA

        console.log("================================================================");
        console.log("ObservableProcessController::constructor starting...");

        let errors = [];
        let inBreakScope = false;

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

            // Allocate private, per-class-instance state.
            this._private = {};

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
            // should only access this._private. External access to this values
            // at your own peril as no gaurantee whatsoever across versions
            // is made on _prviate namespace entities.

            this._private = filterResponse.result; // TODO: Evaluate and trim as a later optimization to reduce per-instance memory overhead.

            // ----------------------------------------------------------------
            // Wake the beast up...
            // TODO: I am not 100% sure it's the best choice to perform the preliminary evaluation in the constructor.

            filterResponse = this._evaluate();
            if (filterResponse.error) {
                errors.push("Failed while executing first system evaluation.");
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
            console.log("================================================================");
        } else {
            console.log("ObservableProcessController::constructor complete.");
            console.log("================================================================");

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

        if (!this.isValid()) {
            return this.isValid({ getError: true });
        }

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            // Push the stack.
            this._private.opcActorStack.push(request_);

            console.log("WE ARE ABOUT TO ACT.");
            let actionResponse = this._private.actionDispatcher.request(request_);

            if (actionResponse.error) {
                errors.push(actionResponse.error);
            }

            this._private.opcActorStack.pop();

            if (!this._private.opcActorStack.length) {
                response.result = this._private.evaluate();
            }

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
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
        // TODO: We can at this point in the execution flow deep copy the CDS,
        // execute the evaluation against the copy. Then depending on the
        // results of the evaluation:
        // * If no error(s), swap out the old CDS instance for the new.
        // * Otherwise, report the evaluation result and leave the contents of the CDS unmodified by the operation.
        console.log("================================================================");
        console.log("ObservableProcessController::_evaluate starting...");
        console.log("================================================================");
        // Deletegate to the evaluation filter.
        const evalFilterResponse = evaluateFilter.request({ opcRef: this });
        this._private.lastEvaluationResponse =  evalFilterResponse;
        this._private.evalCount++;
        console.log("================================================================");
        console.log(evalFilterResponse);
        console.log(JSON.stringify(evalFilterResponse, undefined, 2));
        console.log("ObservableProcessController::_evaluate complete.");
        console.log("================================================================");
        return evalFilterResponse;
    } // _evaluate method

}

module.exports = ObservableProcessController;
