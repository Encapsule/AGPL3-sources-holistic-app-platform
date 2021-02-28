// HolisticHTML5Service_DOMLocation/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolisticHTML5ServicePackage = require("../cmasHolisticHTML5ServicePackage");

    const cmLabel = require("./cm-label");

    const cellModel = new holarchy.CellModel({
        id: cmasHolisticHTML5ServicePackage.mapLabels({ CM: cmLabel }).result.CMID,
        name: cmLabel,
        description: "Abstracts monitoring and setting the window.location and hashroute.",
        apm: require("./AbstractProcessModel-dom-location-processor"),
        actions: [
            require("./ControllerAction-dom-location-processor-configure"),
            require("./ControllerAction-dom-location-processor-hashchange")
        ],
        subcells: [
            require("./ObservableValue_RouterEventDescriptor")
        ]
    });

    if (!cellModel.isValid()) {
        throw new Error(cellModel.toJSON());
    }

    module.exports = cellModel;

})();

