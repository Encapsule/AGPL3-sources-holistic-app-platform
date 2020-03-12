// Holodeck.js (v2)

const constructorFilter = require("./lib/holodeck-method-constructor-filter");
const runProgramFilter = require("./lib/holodeck-method-run-program-filter");

module.exports = class Holodeck {

    constructor(constructorRequest_) {
        this._private = {};
        this.isValid = this.isValid.bind(this);
        this.toJSON = this.toJSON.bind(this);
        this.runProgram = this.runProgram.bind(this);
        this._getHarnessDiscriminator = this._getHarnessDiscriminator.bind(this);

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
        if (!this.isValid()) { return { error: this.toJSON() }; }
        return runProgramFilter.request({ HolodeckInstance: this, programRequest: programRequest_ });
    }

    // Private method used by plug-in harnesses to obtain an reference to the harness discriminator filter
    // that it uses to affect RMDR-pattern dispatch of a programRequest.
    _getHarnessDiscriminator() {
        if (!this.isValid()) {
            return { error: this.toJSON() };
        }
        return { error: null, result: this._private.holodeckHarnessDispatcher };
    }

};


