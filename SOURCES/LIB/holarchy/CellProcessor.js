// CellProcessor.js

const constructorFilter = require("./lib/filters/cp-method-constructor-filter");

module.exports = class CellProcessor {

    constructor(request_) {
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            this._private = { constructorError: null };
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.act = this.act.bind(this);
            let filterResponse = constructorFilter.request(request_);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift(`CellProcessor::constructor for [${(request_ && request_.id)?request_.id:"unspecified"}::${(request_ && request_.name)?request_.name:"unspecified"}] failed yielding a zombie instance.`);
            this._private.constructorError = errors.join(" ");
        }
    }

    isValid() { return (!this._private.constructorError); }

    // This method will undergo some considerable transformation in the future.
    // It's not nearly done yet. But, done enough to use CellProcessor for many
    // jobs...Just not yet jobs that require that we save/restore the contents
    // of a CellProcessor and or specific subgraphs of the process digraph.
    toJSON() { return (this.isValid()?this._private:this._private.constructorError); }

    act(request_) { return (this.isValid()?this._private.opc.act(request_):{ error: this.toJSON() }); }

} // class CellProcessor
