// cmasObservableValueBase.js

(function() {
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const cmasObservableValueBase = cmasHolarchyCMPackage.makeSubspaceInstance({ spaceLabel: require("./cell-label") });
    if (!cmasObservableValueBase.isValid()) {
        throw new Error(cmasObservableValueBase.toJSON());
    }
    module.exports = cmasObservableValueBase;
})();

