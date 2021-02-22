// cmasObservableValueWorker.js

(function() {
    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const cmasObservableValueWorker = cmasHolarchyCMPackage.makeSubspaceInstance({ spaceLabel: require("./cell-label") });
    if (!cmasObservableValueWorker.isValid()) {
        throw new Error(cmasObservableValueWorker.toJSON());
    }
    module.exports = cmasObservableValueWorker;
})();
