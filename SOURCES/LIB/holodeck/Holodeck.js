// Holodeck.js (v2)

const constructorFilter = require("./lib/holodeck-method-constructor-filter");


module.exports = class Holodeck {

    constructor(constructorRequest_) {
        this._private = {};
        this.isValid = this.isValid.bind(this);
        this.toJSON = this.toJSON.bind(this);

        const constructorResponse = constructorFilter.request(constructorRequest_);
        if (constructorResponse.error) {
            this._private.constructorError = constructorResponse.error;
            this._private.constructorResponse = constructorResponse;
            return;
        }

    }

    isValid() {
        return (!this._private.constructorError);
    }

    toJSON() {
        return (this._private.constructorError)?this._private.constructorError:this._private;
    }

};


