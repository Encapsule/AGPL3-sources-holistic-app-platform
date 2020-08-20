// TransitionOperator-cpm-descendant-process-in-step.js

const cpmLib = require("./lib");
const TransitionOperator = require("../../TransitionOperator");

module.exports = new TransitionOperator({
    id:     "DzlsRZBOReO03GSPsU3CIg",
    name: "Cell Proces Manager: Descendant Processes Any In Step",
    description: "Returns Boolean true request.context.apmBindingPath is a cell process whose descendant cell processes contain any cell process(es) in the specified process step.",
    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                descendantProcessesAnyInStep: {
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

