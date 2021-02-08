// ObservableValueProxy_T/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cellmodelConstructorRequestGeneratorFilter = require("./CellModel-constructor-request-generator-filter");

    class ObservableValueProxyWorker_T extends holarchy.CellModel {
        constructor(request_) {
            const filterResponse = cellmodelConstructorRequestGeneratorFilter.request(request_);
            super(filterResponse.result);
            this._private.constructorError = filterResponse.error?filterResponse.error:this._private.constructorError;
        }
    }

    module.exports = ObservableValueProxyWorker_T;

})();

