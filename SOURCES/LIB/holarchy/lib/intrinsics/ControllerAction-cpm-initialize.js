// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-initialize.js

const ControllerAction = require("../ControllerAction");

const controllerAction = new ControllerAction({
    id: "VNaA0AMsTXawb32xLaNGTA",
    name: "Cell Process Manager: Initialize",
    description: "Performs initialization of Cell Process Manager cell process (the root and parent process of all cell processes executing in a CellProcess runtime host instance).",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                initialize: {
                    ____types: "jsObject",
                    options: { ____accept: [ "jsUndefined", "jsObject" ] }
                }
            }
        }
    }, // actionRequestSpec

    actionResultSpec: { ____accept: "jsUndefined" }, // calling this action returns no result whatsoever

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("Cell Process Manager process initializing...");
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    } // bodyFunction

});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;

