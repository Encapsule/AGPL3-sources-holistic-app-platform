// HolodeckRunner.js

const constructorFilter = require("./lib/hr-method-constructor-filter");

module.exports = class HolodeckRunner {

    constructor(constructorRequest_) {

        this._private = {};

        const constructorResponse = constructorFilter.request(constructorRequest_);
        if (constructorResponse.error) {
            this._private.constructorError = constructorResponse.error;
            return;
        }

        this._private = constructorResponse.result;

        // Bind methods
        this.runVectors = this.runVectors.bind(this);

    }

    isValid() {
        return (!this._private.constructorError);
    }


    runVectors(runVectorsRequest_) {


    }


};

