

const holarchy = require("@encapsule/holarchy");
const cmasHolisticHTML5ServicePackage = require("../cmasHolisticHTML5ServicePackage");

const cmLabel = require("./cm-label");

module.exports = new holarchy.CellModel({
    id: cmasHolisticHTML5ServicePackage.mapLabels({ CM: cmLabel }).result.CMID,
    name: cmLabel,
    description: "Abstracts monitoring and setting the window.location and hashroute.",
    apm: require("./AbstractProcessModel-dom-location-processor"),
    actions: [
        // v0.0.51-ametrine deprecated --- require("./ControllerAction-dom-location-processor-initialize"),
        require("./ControllerAction-dom-location-processor-configure"),
        require("./ControllerAction-dom-location-processor-hashchange")
    ],
    subcells: [
        require("./ObservableValue_RouterEventDescriptor")
    ]
});


