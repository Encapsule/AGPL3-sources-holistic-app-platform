// DisplayView_T/DisplayViewBase/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const cmLabel = require("./cell-label");

    const cellModel = new holarchy.CellModel({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel }).result.CMID,
        name: cmLabel,
        description: "Provides generic behaviors for specializations for DisplayValue family cells synthesized with DisplayView_T.",

        actions: [
            require("./ControllerAction-DisplayViewBase-step-worker"),
            require("./ControllerAction-DisplayViewBase-link-display-process")
        ]

    });

    if (!cellModel.isValid()) {
        throw new Error(cellModel.toJSON());
    }

    module.exports = cellModel;


})();

