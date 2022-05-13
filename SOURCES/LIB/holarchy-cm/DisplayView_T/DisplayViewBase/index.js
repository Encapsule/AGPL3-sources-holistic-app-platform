// DisplayView_T/DisplayViewBase/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const cmLabel = require("./cell-label");

    const cellModel = new holarchy.CellModel({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel }).result.CMID,
        name: cmLabel,
        description: "Provides common base-level behaviors for all CellModel specializations constructed by calling CellModelTemplate instance DisplayView_T.",
        actions: [
            require("./ControllerAction-DisplayViewBase-step-worker"),
            require("./ControllerAction-DisplayViewBase-link-display-process"),
            require("./ControllerAction-DisplayViewBase-set-as-root")
        ]
    });

    if (!cellModel.isValid()) {
        throw new Error(cellModel.toJSON());
    }

    module.exports = cellModel;

})();

