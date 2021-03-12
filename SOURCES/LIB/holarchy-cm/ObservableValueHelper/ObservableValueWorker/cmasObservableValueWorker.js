// cmasObservableValueWorker.js

(function() {
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const factoryResponse = cmasHolarchyCMPackage.makeSubspaceInstance({ spaceLabel: require("./cell-label") });
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }
    module.exports = factoryResponse.result;
})();
