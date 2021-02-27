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
            this.mapLabels = this.mapLabels.bind(this);
            this.makeSubspaceInstance = this.makeSubspaceInstance.bind(this);
            // deprecate this.getArtifactSpaceLabel = this.getArtifactSpaceLabel.bind(this);
        }

        isValid() {
            return (this._private.constructorError)?false:true;
        }

        toJSON() {
            return (this.isValid()?this._private:this._private.constructorError);
        }

        mapLabels(request_) {
            return (this.isValid()?this._private.mapLabelsMethodFilter.request({ ...request_, cmasInstance: this }):{ error: this.toJSON() });
        }

        makeSubspaceInstance(request_) {
            if (!this.isValid()) {
                return ({ error: this.toJSON() });
            }
            const filterResponse = this._private.makeSubspaceInstanceMethodFilter.request({ ...request_, cmasInstance: this });
            if (filterResponse.error) {
                return filterResponse;
            }
            return new CellModelArtifactSpace(filterResponse.result);
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
