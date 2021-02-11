// cmasHolarchyPackage.js

(function() {
    const CellModelArtifactSpace = require("./CellModelArtifactSpace");
    const cmasHolarchyPackage  = new CellModelArtifactSpace({ spaceLabel: "@encapsule/holarchy"});
    if (!cmasHolarchyPackage.isValid()) {
        throw new Error(cmasHolarchyPackage.toJSON());
    }
    module.exports = cmasHolarchyPackage;
})();

