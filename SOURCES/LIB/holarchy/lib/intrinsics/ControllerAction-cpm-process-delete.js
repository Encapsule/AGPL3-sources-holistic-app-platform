// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-process-delete.js


const ControllerAction = require("../ControllerAction");

const controllerAction = new ControllerAction({
    id: "4s_DUfKnQ4aS-xRjewAfUQ",
    name: "Cell Process Manager: Process Delete",
    description: "Requests that the Cell Process Manager delete a branch of the cell process tree by recursively deleting the OCD namespaces associated with every cell process on the tree branch."

});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;

