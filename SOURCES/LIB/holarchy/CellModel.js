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
            this.getOPCConfig = this.getOPCConfig.bind(this);
            // These are primarily for support of low-level holodeck test harnesses.
            this.getArtifact = this.getArtifact.bind(this);
            this.getCMConfig = this.getCMConfig.bind(this);
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
    getOPCConfig() {

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

    } // getOPCConfig

    // Returns a filter response object.
    getArtifact(request_) { // request = { id: optional, type: optional }
        // TODO: Turn this into a method filter
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            if (!this.isValid()) {
                errors.push(this.toJSON());
                break;
            }
            if (!request_.type) {
                request_.type = "CM";
            }
            if ((request_.type === "CM") && (!request_.id || (request_.id === this._private.id))) {
                response.result = this;
                break;
            }
            if (!this._private.digraph.isVertex(request_.id)) {
                errors.push(`Unknown ${request_.type} id='${request_.id}'. No artifact found.`);
                break;
            }
            const props = this._private.digraph.getVertexProperty(request_.id);
            if (props.type !== request_.type) {
                errors.push(`Invalid id='${request_.id}' for type ${request_.type}. This ID is registered to a ${props.type} artifact, not a ${request_.type}.`);
                break;
            }
            response.result = props.artifact;
            break;
        }
        if (errors.length) {
            errors.unshift("CellModel::getArtifact method error:");
            response.error = errors.join(" ");
        }

        return response;

    } // getArtifact

    // Returns a filter response object.
    getCMConfig(request_) { // request = { id: optional CM ID, configType: optional }
        // TODO: Turn this into a method filter.
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            if (!this.isValid()) {
                errors.push(this.toJSON());
                break;
            }
            let innerResponse = this.getArtifact({ id: request_.id, type: "CM" });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            const artifact = innerResponse.result;

            switch (request_.type) {
            case undefined:
            case "CM":
                break;
            case "APM":
            case "TOP":
            case "ACT":
                response.result = artifact._private.digraph.outEdges(`INDEX_${request_.type}`)
                    .map((edge_) => { return artifact._private.digraph.getVertexProperty(edge_.v).artifact; })
                    .sort((a_, b_) => { (a_.getName() < b_.getName())?-1:(a_.getName() > b_.getName())?1:0; });

                break;
            }

            break;
        }
        if (errors.length) {
            errors.unshift("CellModel::getCMConfigAPM method error:");
            response.error = errors.join(" ");
        }

        return response;

    }

}
