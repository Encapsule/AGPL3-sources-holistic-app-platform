// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-process-create.js


const ControllerAction = require("../ControllerAction");

const controllerAction = new ControllerAction({
    id: "SdL0-5kmTuiNrWNu7zGZhg",
    name: "Cell Process Manager: Process Create",
    description: "Requests that the Cell Process Manager create a new cell process inside the CellProcessor runtime host instance.",

});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;

