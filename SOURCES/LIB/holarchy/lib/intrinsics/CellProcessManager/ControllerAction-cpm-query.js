// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-query.js

const ControllerAction = require("../../../ControllerAction");



const controllerAction = new ControllerAction({
    id: "L2mTv5LvT12WIYb0cYOsLA",
    name: "Cell Process Manager Query",
    description: "Performs a synchronous query of the Cell Process Manager's process digraph.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                processes: {
                    ____types: "jsObject",
                    query: {
                        ____types: "jsObject",
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____types: "jsObject",
        // TODO
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("Cell Process Manager query...");
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;

