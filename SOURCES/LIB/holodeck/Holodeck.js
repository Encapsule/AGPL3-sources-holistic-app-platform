// Holodeck.js (v2)

const constructorFilter = require("./lib/holodeck-method-constructor-filter");
const runProgramFilter = require("./lib/holodeck-method-run-program-filter");

module.exports = class Holodeck {

    constructor(constructorRequest_) {
        this._private = {};
        this.isValid = this.isValid.bind(this);
        this.toJSON = this.toJSON.bind(this);
        this.runProgram = this.runProgram.bind(this);

        const constructorResponse = constructorFilter.request(constructorRequest_);
        if (constructorResponse.error) {
            this._private.constructorError = constructorResponse.error;
            return;
        }
        this._private = constructorResponse.result;
    }

    isValid() { return (!this._private.constructorError); }

    toJSON() { return (this._private.constructorError)?this._private.constructorError:this._private; }

    runProgram (programRequest_) {
        if (!this.isValid()) { return { error: this._private.constructorError }; }
        return runProgramFilter.request({ HolodeckInstance: this, programRequest: programRequest_ });
    }

    _getHarnessDiscriminator

};


