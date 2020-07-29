// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-initialize.js

const ControllerAction = require("../ControllerAction");

const controllerAction = new ControllerAction({
    id: "VNaA0AMsTXawb32xLaNGTA",
    name: "Cell Process Manager: Initialize",
    description: "Performs initialization of Cell Process Manager cell process (the root and parent process of all cell processes executing in a CellProcess runtime host instance).",
});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;

