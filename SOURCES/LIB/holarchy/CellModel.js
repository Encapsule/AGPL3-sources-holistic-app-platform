// CellModel.js

const constructorFilter = require("./lib/filters/cm-method-constructor-filter");

module.exports = class CellModel {

    constructor(request_) {
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            this._private = { constructorError: null };
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            let filterResponse;
            if (!request_ || (Object.prototype.toString.call(request_) !== "[object Object]")) {
                filterResponse = constructorFilter.request(request_);
            } else {
                filterResponse = constructorFilter.request({
                    CellModel,
                    CellModelInstance: this,
                    ...request_
                });
            }
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift(`CellModel::constructor for [${(request_ && request_.id)?request_.id:"unspecified"}::${(request_ && request_.name)?request_.name:"unspecified"}] failed yielding a zombie instance.`);
            this._private.constructorError = errors.join(" ");
        }
    }

    isValid() {
        return (!this._private.constructorError);
    }

    toJSON() {
        return (this.isValid()?this._private:this._private.constructorError);
    }

}
