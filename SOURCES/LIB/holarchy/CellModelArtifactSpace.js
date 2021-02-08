// HolarchyArtifactSpaceMapper.js
//

(function() {

    const constructorFilter = require("./lib/filters/cmas-method-constructor-filter");

    class CellModelArtifactSpace {
        constructor(request_) {
            let filterResponse = constructorFilter.request(request_);
            this._private = !filterResponse.error?filterResponse.result:{ constructorError: filterResponse.error };
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.mapLabels = this.mapLabels.bind(this);
        }
        isValid() {
            return (this._private.constructorError)?false:true;
        }
        toJSON() {
            return (this.isValid()?this._private:this._private.constructorError);
        }
        mapLabels(request_) {
            return (this.isValid()?this._private.artifactSpaceMapperFilter.request(request_):{ error: this.toJSON() });
        }
    }

    module.exports = CellModelArtifactSpace;

})();
