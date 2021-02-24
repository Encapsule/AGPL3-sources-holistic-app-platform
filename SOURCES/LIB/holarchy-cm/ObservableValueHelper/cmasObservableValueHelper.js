// cmasObservableValueHelper.js

(function() {
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const cmasObservableValueHelper = cmasHolarchyCMPackage.makeSubspaceInstance({ spaceLabel: require("./cell-label") });
    if (!cmasObservableValueHelper.isValid()) {
        throw new Error(cmasObservableValueHelper.toJSON());
    }
    module.exports = cmasObservableValueHelper;
})();
