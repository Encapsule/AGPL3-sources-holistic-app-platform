
const arccore = require("@encapsule/arccore");
const constructorRequestFilter = require("./ObservableProcessController-constructor-filter");
const ApplicationDataStore = require("../app-data-store/ApplicationDataStore");

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
        while (!inBreakScope) {
            inBreakScope = true;

            // Traverse the controller data filter specification and find all namespace declarations containing an OPM binding.
            let filterResponse = this._private.controllerData.getNamespaceSpec("~");
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            let namespaceQueue = [ { path: "~", specRef: filterResponse.result } ];
            let opmDeclarationMap = {}; // A dictionary that maps controller data namespace declaration paths to their associated ObservableProcessModel class instances.
            while (namespaceQueue.length) {
                let record = namespaceQueue.shift();
                if (record.specRef.____appdsl && record.specRef.____appdsl.opm) {
                    const opmID = record.specRef.____appdsl.opm;
                    if (arccore.identifier.irut.isIRUT(opmID).result) {
                        if (!this._private.opmMap[opmID]) {
                            errors.push(`Controller data namespace '${record.path}' is declared with an unregistered ObservableProcessModel binding ID '${opmID}'.`);
                            break;
                        }
                        opmDeclarationMap[record.path] = this._private.opmMap[opmID];
                    } else {
                        errors.push(`Controller data namespace '${record.path}' is declared with an illegal syntax ObservableProcessModel binding ID '${opmID}'.`);
                        break;
                    }
                }
                // Evaluate the child namespaces of the current filter spec namespace.
                for (let key_ in record.specRef) {
                    if (key_.startsWith("____")) {
                        continue;
                    }
                    namespaceQueue.push({ path: `${record.path}.${key_}`, specRef: record.specRef[key_] });
                }
            } // end while(namespaceQueue.length)

            if (errors.length) {
                break;
            }



            break;

        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;

    } // _evaluate method

}

module.exports = ObservableProcessController;
