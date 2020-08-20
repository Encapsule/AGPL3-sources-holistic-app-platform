// TransitionOperator-cpm-child-processes-all-in-step.js

const cpmLib = require("./lib");
const TransitionOperator = require("../../TransitionOperator");

module.exports = new TransitionOperator({
    id: "5P2MHjL4TXCqScp_xNrJyA",
    name: "Cell Proces Manager: Child Processes All In Step",
    description: "Returns Boolean true request.context.apmBindingPath is a cell process whose child processes are all in the specified process step.",
    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                childProcessesAllInStep: {
                    ____types: "jsObject",
                    apmStep: { ____accept: "jsString" }
                }
            }
        }
    },

    bodyFunction: function(request_) {
        // Not implemented yet...
        return { error: null, result: false };
    }
});
