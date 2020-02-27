
// AbstractProcessModel.js

const arccore = require("@encapsule/arccore");
const constructorRequestFilter = require("./filters/apm-method-constructor-filter");

class AbstractProcessModel {

    constructor(request_) {

        // #### sourceTag: If9EVP5OSPqQZz07Dg_05Q

        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            this._private = { constructorError: null };
            this.vdid = null;
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.getID = this.getID.bind(this);
            this.getVDID = this.getVDID.bind(this);
            this.getName = this.getName.bind(this);
            this.getDescription = this.getDescription.bind(this);
            this.getStepDescriptor = this.getStepDescriptor.bind(this);
            this.getDataSpec = this.getDataSpec.bind(this);
            this.getDigraph = this.getDigraph.bind(this);

            let filterResponse = constructorRequestFilter.request(request_);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift(`AbstractProcessModel::constructor for [${(request_ && request_.id)?request_.id:"unspecified"}::${(request_ && request_.name)?request_.name:"unspecified"}] failed yielding a zombie instance.`);
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
        return {
            id: this.getID(),
            vdid: this.getVDID(),
            name: this.getName(),
            description: this.getDescription(),
            ocdDataSpec: this._private.ocdDataSpec,
            process: this._private.digraph
        };
    }

    getID() {
        return (this.isValid()?this._private.declaration.id:this._private.constructorError);
    }

    getVDID() {
        if (!this.vdid) {
            this.vdid = arccore.identifier.irut.fromReference(this._private).result;
        }
        return this.vdid;
    }

    getName() {
        return (this.isValid()?this._private.declaration.name:this._private.constructorError);
    }

    getDescription() {
        return (this.isValid()?this._private.declaration.description:this._private.constructorError);
    }

    getStepDescriptor(stepLabel_) {
        return (this.isValid()?this._private.declaration.steps[stepLabel_]:this._private.constructorError);
    }

    getDataSpec() {
        return (this.isValid()?this._private.declaration.ocdDataSpec:this._private.constructorError);
    }

    getDigraph() {
        return (this.isValid()?this._private.digraph:this._private.constructorError);
    }

}

module.exports = AbstractProcessModel;


