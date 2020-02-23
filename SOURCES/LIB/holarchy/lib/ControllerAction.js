
const arccore = require("@encapsule/arccore");
const constructorFilter = require("./filters/cac-method-constructor-filter");

module.exports = class ControllerAction {

    constructor(request_) {
        // #### sourceTag: ufoEHFc9RKOiy4gPXLT1lA
        let errors = [];
        let inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            // Allocate private per-class-instance state.
            this._private = { constructorError: null };
            this.vdid = null;
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.getFilter = this.getFilter.bind(this);
            this.getID = this.getID.bind(this);
            this.getVDID = this.getVDID.bind(this);
            this.getName = this.getName.bind(this);

            const filterResponse = constructorFilter.request(request_);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift(`ControllerAction::constructor for [${(request_ && request_.id)?request_.id:"unspecified"}::${(request_ && request_.name)?request_.name:"unspecified"}] failed yielding a zombie instance.`);
            this._private.constructorError = errors.join(" ");
        }
    }

    isValid() {
        return (!this._private.constructorError);
    }

    toJSON() {
        return this.getFilter();
    }

    getFilter() {
        return (this.isValid()?this._private:this._private.constructorError);
    }

    getID() {
        return (this.isValid()?this._private.filterDescriptor.operationID:this._private.constructorError);
    }

    getVDID() {
        if (!this.vdid) {
            this.vdid = arccore.identifier.irut.fromReference(this._private).result;
        }
        return this.vdid;
    }

    getName() {
        return (this.isValid()?this._private.filterDescriptor.operationName:this._private.constructorError);
    }

};

