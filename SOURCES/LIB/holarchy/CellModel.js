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
            this.generateConfig = this.generateConfig.bind(this);

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

    // Returns a Boolean
    isValid() {
        return (!this._private.constructorError);
    }

    // If isValid then serializable object. Otherwise, constructor error string.
    toJSON() {
        return (this.isValid()?this._private:this._private.constructorError);
    }

    // If isValid() then IRUT string. Otherwise, constructor error string.
    getID() {
        return (this.isValid()?this._private.id:this.toJSON());
    }

    // Always returns an IRUT string. Should not be used if !isValid().
    getVDID() {
        if (!this.vdid) {
            this.vdid = arccore.identifier.irut.fromReference(this._private).result;
        }
        return this.vdid;
    }

    // If isValid() then name string returned. Otherwise, constructor error string.
    getName() {
        return (this.isValid()?this._private.name:this.toJSON());
    }

    // If isValid() then descriptor string returned. Otherwise, constructor error string.
    getDescription() {
        return (this.isValid()?this._private.description:this.toJSON());
    }

    // Returns a filter response object.
    generateConfig() {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            if (!this.isValid()) {
                errors.push(this.toJSON());
                break;
            }
            response.result = {};
            response.result.apm = this._private.digraph.outEdges("INDEX_APM").map((edge_) => { return this._private.digraph.getVertexProperty(edge_.v).artifact; })
            response.result.top = this._private.digraph.outEdges("INDEX_TOP").map((edge_) => { return this._private.digraph.getVertexProperty(edge_.v).artifact; })
            response.result.act = this._private.digraph.outEdges("INDEX_ACT").map((edge_) => { return this._private.digraph.getVertexProperty(edge_.v).artifact; })
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }


}
