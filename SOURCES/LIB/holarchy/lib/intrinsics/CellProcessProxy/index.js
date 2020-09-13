// SOURCES/LIB/holarchy/lib/intrinsics/CellProcessProxy/index.js

const CellModel = require("../../../CellModel");

const cellModel = new CellModel({
    id: "LG9CCSEmSYaU6Mp9J0wZ5g",
    name: "Holarchy Cell Process Proxy Helper Model",
    description: "Defines a helper model that functions as a proxy for action and operator calls to some (any) shared cell process.",
    description: "",
    apm: require("./AbstractProcessModel-cpp"),
    actions: [
        require("./ControllerAction-cpp-proxy-action"),
        require("./ControllerAction-cpp-proxy-connect"),
        require("./ControllerAction-cpp-proxy-disconnect")
    ],
    operators: [
        require("./TransitionOperator-cpp-proxy-operator"),
        require("./TransitionOperator-cpp-proxy-logical-state-broken"),
        require("./TransitionOperator-cpp-proxy-logical-state-connected"),
        require("./TransitionOperator-cpp-proxy-logical-state-disconnected")
    ],
    subcells: []
});

if (!cellModel.isValid()) {
    throw new Error(cellModel.toJSON());
}

module.exports = cellModel;


