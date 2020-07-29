// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-query.js

const ControllerAction = require("../ControllerAction");

const controllerAction = new ControllerAction({
    id: "L2mTv5LvT12WIYb0cYOsLA",
    name: "Cell Process Manager Query",
    description: "Performs a synchronous query of the Cell Process Manager's process digraph.",
});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;

