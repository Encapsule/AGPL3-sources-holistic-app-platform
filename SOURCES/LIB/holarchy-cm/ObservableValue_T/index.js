// ObservableValue_T.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cellmodelConstructorRequestGeneratorFilter = require("./CellModel-constructor-request-generator-filter")
    const artifactSpaceMappingFilter = require("./cellplane-manifold-mapper-filter");

    class ObservableValue_T extends holarchy.CellModel {
        constructor(request_) {
            const filterResponse = cellmodelConstructorRequestGeneratorFilter.request(request_);
            super(filterResponse.result);
            this._private.constructorError = filterResponse.error?filterResponse.error:this._private.constructorError;
        }
        static mapArtifactID(request_) { return artifactSpaceMappingFilter.request(request_.result); }
    }
    module.exports = ObservableValue_T; // A class that becomes a specific, type-specialized ObservableValue CellModel when constructed.

})();

