// cmasHolisticHTML5ServicePackage.js

(function() {
    const holarchy = require("@encapsule/holarchy");
    const cmas = new holarchy.CellModelArtifactSpace({ spaceLabel: "@encapsule/holistic-html5-package" });
    if (!cmas.isValid()) {
        throw new Error(cmas.toJSON());
    }
    module.exports = cmas;
})();
