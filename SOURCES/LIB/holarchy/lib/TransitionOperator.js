
const constructorFilter = require("./filters/top-method-constructor-filter");

module.exports = class TransitionOperator {
    constructor(request_) {
        // #### sourceTag: FuMaLlqkSwW7przxe2XSdw
        console.log("================================================================");
        console.log("TransitionOperator::constructor starting...");
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            this._private = { constructorError: null };
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.getFilter = this.getFilter.bind(this);

            let filterResponse = constructorFilter.request(request_);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift("TransitionOperator::constructor failed yielding a zombie instance.");
            this._private.constructorError = errors.join(" ");
        }
    }

    isValid() {
        return (!this._private.constructorError);
    }

    toJSON() {
        return (this.isValid()?this._private.filterDescriptor:this._private.constructorError);
    }

    getFilter() {
        return (this.isValid()?this._private:this._private.constructorError);
    }

};


