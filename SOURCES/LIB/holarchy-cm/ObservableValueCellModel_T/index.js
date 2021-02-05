// ObservableValueCellModel_T.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cellmodelConstructorRequestGeneratorFilter = require("./CellModel-constructor-request-generator-filter")

    class ObservableValueCellModel_T extends holarchy.CellModel {
        constructor(request_) {
            const filterResponse = cellmodelConstructorRequestGeneratorFilter.request(request_);
            super(filterResponse.result);
            this._private.constructorError = filterResponse.error?filterResponse.error:this._private.constructorError;
        }
    }
    module.exports = ObservableValueCellModel_T;

})();

