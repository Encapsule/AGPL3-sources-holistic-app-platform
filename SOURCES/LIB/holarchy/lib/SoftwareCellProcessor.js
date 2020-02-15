// SoftwareCellProcessor.js
//
// SoftwareCellProcess (SCP) provides a runtime execution and evaluation
// environment for hosted systems composed of re-usable, plug-and-play
// SoftwareCellModel runtime component definitions.

module.exports = class SoftwareCellProcessor {

    constructor(request_) {
        this.isValid = this.isValid.bind(this);
        this.toJSON = this.toJSON.bind(this);
    }

    isValid() {
    }

    toJSON() {

      }

}
