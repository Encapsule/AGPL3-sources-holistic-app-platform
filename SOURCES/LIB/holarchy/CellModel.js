// CellModel.js

const arccore = require("@encapsule/arccore");
const constructorFilter = require("./lib/filters/cm-method-constructor-filter");

module.exports = class CellModel {

    constructor(request_) {
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // Allocate private per-class-instance state.
            this._private = { constructorError: null };
            this.vdid = null;
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.getID = this.getID.bind(this);
            this.getVDID = this.getVDID.bind(this);
            this.getName = this.getName.bind(this);
            this.getDescription = this.getDescription.bind(this);

            let filterResponse;
            // If the caller didn't pass an object, just pass it through to the constructor filter which will fail w/correct error message.
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

    getID() {
        return (this.isValid()?this._private.id:this._private.constructorError);
    }

    getVDID() {
        if (!this.vdid) {
            this.vdid = arccore.identifier.irut.fromReference(this._private).result;
        }
        return this.vdid;
    }

    getName() {
        return (this.isValid()?this._private.name:this._private.constructorError);
    }

    getDescription() {
        return (this.isValid()?this._private.description:this._private.constructorError);
    }


}
