// CellProcessPlane.js

const arccore = require("@encapsule/arccore");
const constructorFilter = require("./lib/filters/cpp-method-constructor-filter");

module.exports = class CellProcessPlane {

    constructor(request_) {
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            this._private = { constructorError: null };
            this.vdid = null;
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            // this.getID = this.getID.bind(this);
            // this.getVDID = this.getVDID.bind(this);
            // this.getName = this.getName.bind(this);
            // this.getDescription = this.getDescription.bind(this);

            const filterResponse = constructorFilter.request(request_);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift(`CellT2Point::constructor failed yielding a zombie instance.`);
            this._private.constructorError = errors.join(" ");
        }
    }

    isValid() {
        return (!this._private.constructorError);
    }

    toJSON() {
        return (
            !this.isValid()?
                this._private.constructorError
                :
                {
                    weNeedSomethingHere: {}
                }
        );
    }


};
