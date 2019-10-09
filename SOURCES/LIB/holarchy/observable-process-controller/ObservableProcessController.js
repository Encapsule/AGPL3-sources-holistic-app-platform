
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
        while (!inBreakScope) {
            inBreakScope = true;

            const startDate = new Date();

            // Traverse the controller data filter specification and find all namespace declarations containing an OPM binding.
            let filterResponse = this._private.controllerData.getNamespaceSpec("~");
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            const controllerDataSpec = filterResponse.result;
            filterResponse = this._private.controllerData.readNamespace("~");
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            const controllerData = filterResponse.result;
            let opmDeclarationMap = {}; // A dictionary that maps controller data namespace declaration paths to their associated ObservableProcessModel class instances.
            let namespaceQueue = [ { specPathTokens: [ "~" ], dataPathTokens: [ "~" ], specRef: controllerDataSpec, dataRef: controllerData } ];
            while (namespaceQueue.length) {
                // Retrieve the next record from the queue.
                let record = namespaceQueue.shift();
                const currentSpecPath = record.specPathTokens.join(".");
                const currentDataPath = record.dataPathTokens.join(".");
                console.log(`..... inspecting spec path='${currentSpecPath}' data path='${currentDataPath}'`);

                // If dataRef is undefined, then we're done traversing this branch of the filter spec descriptor tree.
                if (record.dataRef === undefined) {
                    console.log(`..... ..... controller data path '${currentDataPath}' is undefined; spec tree branch processing complete.`);
                    continue;
                }

                // Determine if the current spec namespace has an opm binding annotation.
                // TODO: We should validate the controller data spec wrt opm bindings to ensure the annotation is only made on appropriately-declared non-map object namespaces w/appropriate props...
                if (record.specRef.____appdsl && record.specRef.____appdsl.opm) {
                    const opmID = record.specRef.____appdsl.opm;
                    if (arccore.identifier.irut.isIRUT(opmID).result) {
                        if (!this._private.opmMap[opmID]) {
                            errors.push(`Controller data namespace '${currentSpecPath}' is declared with an unregistered ObservableProcessModel binding ID '${opmID}'.`);
                            break;
                        }
                        opmDeclarationMap[currentDataPath] = this._private.opmMap[opmID];
                        console.log(`..... ..... controller data path '${currentDataPath}' bound to OPM '${opmID}'`);
                    } else {
                        errors.push(`Controller data namespace '${currentSpecPath}' is declared with an illegal syntax ObservableProcessModel binding ID '${opmID}'.`);
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
                        newRecord.specPathTokens.push(key_);
                        newRecord.dataPathTokens.push(key_);
                        newRecord.specRef = record.specRef[key_];
                        newRecord.dataRef = record.dataRef[key_];
                        namespaceQueue.push(newRecord);
                    } else {
                        if (declaredAsArray) {
                            if (Object.prototype.toString.call(record.dataRef) === "[object Array]") {
                                for (let index = 0 ; index < record.dataRef.length ; index++) {
                                    let newRecord = arccore.util.clone(record);
                                    newRecord.specPathTokens.push(key_);
                                    newRecord.dataPathTokens.push(`${index}`);
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
                                    newRecord.specPathTokens.push(key_);
                                    newRecord.dataPathTokens.push(dataKey);
                                    newRecord.specRef = record.specRef[key_];
                                    newRecord.dataRef = record.dataRef[dataKey];
                                    namespaceQueue.push(newRecord);
                                }
                            }
                        }
                    }
                }
            } // end while(namespaceQueue.length)

            if (errors.length) {
                break;
            }

            const opmBindDate = new Date();
            const opmBindMicroseconds = opmBindDate.getTime() - startDate.getTime();

            console.log(`>> Dynamic OPM model binding completed in ${opmBindMicroseconds} microseconds.`);

            response.result = opmDeclarationMap;
            break;

        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;

    } // _evaluate method

}

module.exports = ObservableProcessController;
