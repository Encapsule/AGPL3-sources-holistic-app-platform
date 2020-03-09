// HolodeckHarness.js (v2)

const constructorFilter = require("./lib/holodeck-harness-method-constructor-filter");


module.exports = class HolodeckHarness {

    constructor(constructorRequest_) {

        this._private = {};
        this.isValid = this.isValid.bind(this);
        this.toJSON = this.toJSON.bind(this);
        this.getID = this.getID.bind(this);
        this.getName = this.getName.bind(this);
        this.getDescription = this.getDescription.bind(this);
        this.getHarnessType = this.getHarnessType.bind(this);
        this.getHarnessFilter = this.getHarnessFilter.bind(this);

        const constructorResponse = constructorFilter.request(constructorRequest_);
        if (constructorResponse.error) {
            this._private.constructorError = constructorResponse.error;
            return;
        }
        this._private = constructorResponse.result;
    }

    // Returns Boolean true if constructor yields a valid object. Otherwise, false.
    isValid() {
        return (!this._private.constructorError);
    }

    // Returns private instance state if valid. Otherwise, constructor error string.
    toJSON() {
        return (this.isValid()?this._private:this._private.constructorError);
    }

    // Returns holodeck harness filter ID if valid. Otherwise, constructor error string.
    getID() {
        return (this.isValid()?this._private.harnessFilter.filterDescriptor.operationID:this.toJSON());
    }

    // Returns holodeck harness filter name if valid. Otherwise, constructor error string.
    getName() {
        return (this.isValid()?this._private.harnessFilter.filterDescriptor.operationName:this.toJSON());
    }

    // Returns holodeck harness filter description if valid. Otherwise, constructor error string.
    getDescription() {
        return (this.isValid()?this._private.harnessFilter.filterDescriptor.operationDescription:this.toJSON());
    }

    // Returns holodeck harness filter type if valid. Otherwise, constructor error string.
    getHarnessType() {
        return (this.isValid()?this._private.harnessType:this.toJSON());
    }

    // Returns the holodeck harness filter if valid. Otherwise, constructor error string.
    getHarnessFilter() {
        return (this.isValid()?this._private.harnessFilter:this.toJSON());
    }

};


