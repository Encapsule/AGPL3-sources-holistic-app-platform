
const constructorFilter = require("./filters/cac-method-constructor-filter");

module.exports = class ControllerAction {

    constructor(request_) {
        // #### sourceTag: ufoEHFc9RKOiy4gPXLT1lA
        console.log("================================================================");
        console.log("ControllerAction::constructor starting...");
        let errors = [];
        let inBreakScope = false;
        // Allocate private per-class-instance state.
        this._private = { constructorError: null };
        this.isValid = this.isValid.bind(this);
        this.toJSON = this.toJSON.bind(this);
        this.getFilter = this.getFilter.bind(this);
        while (!inBreakScope) {
            inBreakScope = true;
            const filterResponse = constructorFilter.request(request_);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift("ControllerAction::constructor failed yielding a zombie instance.");
            this._private.constructorError = errors.join(" ");
        }
    }

    isValid() {
        return (!this._private.constructorError);
    }

    toJSON() {
        if (!this.isValid()) {
            return this._private.constructorError;
        }
        return this._private.filterDescriptor;
    }

    getFilter() {
        if (!this.isValid()) {
            return this._private.constructorError;
        }
        return this._private;
    }

};

