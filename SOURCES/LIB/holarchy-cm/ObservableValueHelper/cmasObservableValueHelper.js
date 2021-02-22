// cmasObservableValueHelper.js

(function() {
    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const cmLabel = require("./cell-label");
    module.exports = new holarchy.CellModelArtifactSpace(cmasHolarchyCMPackage.makeSubspaceInstance({ spaceLabel: cmLabel }).result);
})();
