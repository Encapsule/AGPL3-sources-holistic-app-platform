// SOURCES/LIB/holarchy/lib/intrinsics/CellProcessProxy/ControllerAction-cpp-proxy-action.js

const ControllerAction = require("../../../lib/ControllerAction");

const action = new ControllerAction({
    id: "rua1glcmTsOlYcfpZuiXnA",
    name: "",
    description: ""
});

if (!action.isValid()) {
    throw new Error(action.toJSON());
}

module.exports = action;
