// HolarchyArtifactSpaceMapper.js
//

(function() {

    const constructorFilter = require("./lib/filters/cmas-method-constructor-filter");

    class CellModelArtifactSpace {

        constructor(request_) {
            const filterResponse = constructorFilter.request(request_);
            this._private = !filterResponse.error?filterResponse.result:{ constructorError: filterResponse.error };
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.getArtifactPath = this.getArtifactPath.bind(this);
            this.getArtifactSpaceID = this.getArtifactSpaceID.bind(this);
            this.mapLabels = this.mapLabels.bind(this);
            this.makeSubspaceInstance = this.makeSubspaceInstance.bind(this);
            // deprecate this.getArtifactSpaceLabel = this.getArtifactSpaceLabel.bind(this);
        }

        // Returns Boolean true/false
        isValid() {
            return (this._private.constructorError)?false:true;
        }

        // Mostly for testing.
        toJSON() {
            return (this.isValid()?{ spaceLabel: this._private.spaceLabel, spaceID: this._private.spaceID }:this._private.constructorError);
        }

        // Returns a string (that might be a constructor error string)
        getArtifactPath() {
            return (this.isValid()?this._private.spaceLabel:this._private.constructorError);
        }

        // Returns a string (that might be a constructor error string)
        getArtifactSpaceID() {
            return (this.isValid()?this._private.spaceID:this._private.constructorError);
        }

        // Returns a filter response.
        mapLabels(request_) {
            return (this.isValid()?this._private.mapLabelsMethodFilter.request({ ...request_, cmasInstance: this }):{ error: this.toJSON() });
        }

        // Returns a filter response.
        makeSubspaceInstance(request_) {
            if (!this.isValid()) {
                return ({ error: this.toJSON() });
            }
            const filterResponse = this._private.makeSubspaceInstanceMethodFilter.request({ ...request_, cmasInstance: this });
            if (filterResponse.error) {
                return filterResponse;
            }
            // v0.0.62-titanite --- This should be returning response.result
            const cmasInstance = new CellModelArtifactSpace(filterResponse.result);
            return cmasInstance.isValid()?{ error: null, result: cmasInstance }:{ error: cmasInstance.toJSON() };
        }

        // deprecate?
        /*
        getArtifactSpaceLabel() {
            return (this.isValid()?this._private.artifactSpaceLabel:this._private.constructorError);
        }
        */

        get spaceLabel() {
            return (this.isValid()?this._private.spaceLabel:this._private.constructorError);
        }

    }

    module.exports = CellModelArtifactSpace;

})();
