// HolisticAppCommonService.js

const constructorFilter = require("./lib/filters/HolisticAppCommonService-method-constructor-filter");

class HolisticAppCommonService {

    constructor(request_) {
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            this._private = { constructorError: null };
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            let filterResponse = constructorFilter.request(request_);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift(`HolisticAppCommonService::constructor failed yielding a zombie instance.`);
            this._private.constructorError = errors.join(" ");
        }
    }

    isValid() { return (!this._private.constructorError); }

    toJSON() { return (this.isValid()?this._private:this._private.constructorError); }

}

module.exports = HolisticAppCommonService;

