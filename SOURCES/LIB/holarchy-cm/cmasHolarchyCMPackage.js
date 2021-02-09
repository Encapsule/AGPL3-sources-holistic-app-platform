// cmasHolarchyCMPackage.js

(function() {
    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage  = new holarchy.CellModelArtifactSpace({ spaceLabel: "@encapsule/holarchy-cm"});
    if (!cmasHolarchyCMPackage.isValid()) {
        throw new Error(cmasHolarchyCMPackage.toJSON());
    }
    module.exports = cmasHolarchyCMPackage;
})();

