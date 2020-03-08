// HolodeckHarness.js (v2)

const constructorFilter = require("./lib/holodeck-harness-method-constructor-filter");


module.exports = class HolodeckHarness {

    constructor(constructorRequest_) {
        this._private = {};
        this.isValid = this.isValid.bind(this);
        this.toJSON = this.toJSON.bind(this);
        const constructorResponse = constructorFilter.request(constructorRequest_);
        if (constructorResponse.error) {
            this._private.constructorError = constructorResponse.error;
            return;
        }
        this._private = constructorResponse.result;
    }

    isValid() {
        return (!this._private.constructorError);
    }

    toJSON() {
        return (this.isValid()?this._private:this._private.constructorError);
    }

};


