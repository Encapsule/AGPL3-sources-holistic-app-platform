
// TransitionOperator.js

const arccore = require("@encapsule/arccore");
const constructorFilter = require("./filters/top-method-constructor-filter");

module.exports = class TransitionOperator {
    constructor(request_) {
        // #### sourceTag: FuMaLlqkSwW7przxe2XSdw
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            this._private = { constructorError: null };
            this.vdid = null;
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.getFilter = this.getFilter.bind(this);
            this.getID = this.getID.bind(this);
            this.getVDID = this.getVDID.bind(this);
            this.getName = this.getName.bind(this);
            this.getDescription = this.getDescription.bind(this);

            let filterResponse = constructorFilter.request(request_);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift(`TransitionOperator::constructor for [${(request_ && request_.id)?request_.id:"unspecified"}::${(request_ && request_.name)?request_.name:"unspecified"}] failed yielding a zombie instance.`);
            this._private.constructorError = errors.join(" ");
        }
    }

    isValid() {
        return (!this._private.constructorError);
    }

    toJSON() {
        if (!this.isValid()) {
            return this._private.constructorError;
        }
        const response = {
            id: this.getID(),
            vdid: this.getVDID(),
            name: this.getName(),
            description: this.getDescription()
        };
        return response;
    }

    getFilter() {
        return (this.isValid()?this._private:this._private.constructorError);
    }

    getID() {
        return (this.isValid()?this._private.filterDescriptor.operationID:this._privateConstructorError);
    }

    getVDID() {
        if (!this.vdid) {
            this.vdid = arccore.identifier.irut.fromReference(this._private).result;
        }
        return this.vdid;
    }

    getName() {
        return (this.isValid()?this._private.filterDescriptor.operationName:this._privateConstructorError);
    }

    getDescription() {
        return (this.isValid()?this._private.filterDescriptor.operationDescription:this._private.constructorError);
    }
};
