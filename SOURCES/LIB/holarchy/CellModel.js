// CellModel.js

const arccore = require("@encapsule/arccore");
const constructorFilter = require("./lib/filters/cm-method-constructor-filter");
const getArtifactFilter = require("./lib/filters/cm-method-get-artifact-filter");
const getConfigFilter = require("./lib/filters/cm-method-get-config-filter");

// A CellModel class instance is a container for zero or one AbtractProcessModel definition +
// zero or more ControllerAction filter(s) + zero or more TransitionOperator filter(s) +
// a collection of zero or more other CellModel class instance(s) that the producer of the
// CellModel class instance has aggregated w/their cell declaration for implicit registration
// with CellProcessor class instance CellProcessManager process.

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
            this.getAPM = this.getAPM.bind(this);

            // These are primarily for support of CellProcessor ES6 class.
            // But, are also leveraged by the @encapsule/holodeck-assets CellModel harness.
            this.getArtifact = this.getArtifact.bind(this);
            this.getCMConfig = this.getCMConfig.bind(this);

            // If the caller didn't pass an object, just pass it through to the constructor filter which will fail w/correct error message.
            let filterResponse;
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
        if (!this.isValid()) {
            return this._private.constructorError;
        }
        const response = {
            id: this.getID(),
            vdid: this.getVDID(),
            name: this.getName(),
            description: this.getDescription(),
            cmat: this.getCMConfig({ type: "CMAT" })
        };
        return (response);
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

    // if !isValid() returns constructor error message string
    // if isValid() returns undefined (CM does not declare an APM) or APM reference.
    getAPM() {
        if (!this.isValid()) {
            return this.toJSON(); // Not a valid APM but rather a constructor error message string.
        }
        let outEdges = this._private.digraph.outEdges(this.getID());
        let result = undefined; // The CellModel instance does not define an APM
        while (outEdges.length) {
            const edge = outEdges.pop();
            if (this._private.digraph.getEdgeProperty(edge).type === "CM:APM") {
                result = this._private.digraph.getVertexProperty(edge.v).artifact;
                break;
            }
        }
        return result;
    }

    // Returns a filter response object.
    getArtifact(request_) { // request = { id: optional, type: optional }
        let response = getArtifactFilter.request({
            ...request_,
            CellModelInstance: this
        });
        if (response.error) {
            response.error = `CellModel::getArtifact failed: ${response.error}`;
        }
        return response;
    } // getArtifact

    // Returns a filter response object.
    getCMConfig(request_) { // request = { id: optional CM ID, type: optional }
        let response = getConfigFilter.request({
            ...request_,
            CellModelInstance: this
        });
        if (response.error) {
            response.error = `CellModel::getCMConfig failed: ${response.error}`;
        }
        return response;
    } // getCMConfig (TODO: getConfig)

};
