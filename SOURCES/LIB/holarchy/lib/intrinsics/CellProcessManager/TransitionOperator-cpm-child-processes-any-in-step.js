// TransitionOperator-cpm-child-processes-any-in-step.js

const cpmLib = require("./lib");
const TransitionOperator = require("../../TransitionOperator");

module.exports = new TransitionOperator({
    id: "esuJGgmERrSV3AFvFOMyhw",
    name: "Cell Process Manager: Child Processes Any In Step",
    description: "Returns Boolean true request.context.apmBindingPath is a cell process with any child cell process in the specified process step.",
    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                childProcessesAnyInStep: {
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
