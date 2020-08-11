// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-process-query.js

const ControllerAction = require("../../ControllerAction");

const controllerAction = new ControllerAction({
    id: "r-JgxABoS_a-mSE2c1nvKA",
    name: "Cell Process Manager: Process Query",
    description: "Performs a query on a specific cell process managed by the Cell Process Manager.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                process: {
                    ____types: "jsObject",
                    query: {
                        ____types: "jsObject",
                        resultSets: {
                            ____types: "jsArray",
                            ____defaultValue: [],
                            index: {
                                ____accept: "jsString",
                                ____inValueSet: [
                                    "parent",
                                    "ancestors", // includes parent, it's parent...
                                    "children",
                                    "descendants", // includes children, their children...
                                ]
                            }
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____types: "jsObject",
        query: {
            ____label: "Query Cell Process",
            ____description: "The cell process ID and apmBindingPath of the queried cell process.",
            ____types: "jsObject",
            cellProcessID: { ____accept: "jsString" },
            apmBindingPath: { ____accept: "jsString" }
        },
        parent: {
            ____label: "Parent Cell Process",
            ____description: "The cell process ID and apmBindingPath of the queried cell process' parent cell process.",
            ____types: [ "jsNull", "jsObject" ],
            ____defaultValue: null,
            cellProcessID: { ____accept: "jsString" },
            apmBindingPath: { ____accept: "jsString" }
        },
        ancestors: {
            ____label: "Ancestor Cell Processes",
            ____description: "An array of cell process ID and apmBindingPath descriptor objects that include the queried cell process' parent, it's parent...",
            ____types: "jsArray",
            index: {
                ____label: "Ancestor Cell Process",
                ____description: "The cell process ID and apmBindingPath of the queried cell process' ancestor cell process.",
                ____types: "jsObject",
                cellProcessID: { ____accept: "jsString" },
                apmBindingPath: { ____accept: "jsString" }
            }
        },
        children: {
            ____label: "Ancestor Cell Processes",
            ____description: "An array of cell process ID and apmBindingPath descriptor objects that include the queried cell process' parent, it's parent...",
            ____types: "jsArray",
            index: {
                ____label: "Ancestor Cell Process",
                ____description: "The cell process ID and apmBindingPath of the queried cell process' ancestor cell process.",
                ____types: "jsObject",
                cellProcessID: { ____accept: "jsString" },
                apmBindingPath: { ____accept: "jsString" }
            }
        },
        descendants: {
            ____label: "Ancestor Cell Processes",
            ____description: "An array of cell process ID and apmBindingPath descriptor objects that include the queried cell process' parent, it's parent...",
            ____types: "jsArray",
            index: {
                ____label: "Ancestor Cell Process",
                ____description: "The cell process ID and apmBindingPath of the queried cell process' ancestor cell process.",
                ____types: "jsObject",
                cellProcessID: { ____accept: "jsString" },
                apmBindingPath: { ____accept: "jsString" }
            }
        }
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("Cell Process Manager process query...");

            const message = request_.actionRequest.holarchy.CellProcessor.process.query;

            if (
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

