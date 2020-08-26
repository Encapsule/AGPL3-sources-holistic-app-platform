// TransitionOperator-cpm-ancestor-processes-all-in-step.js

const TransitionOperator = require("../../TransitionOperator");

const transitionOperator = new TransitionOperator({
    id: "6j5F3HmKTLG9Q8kD1-QWYA",
    name: "Cell Process Manager: Ancestor Processes All In Step",
    description: "Returns Boolean true if request.context.apmBindingPath is a cell process with ancestor process(es) all in the specified process step(s).",

    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                ancestorProcessesAllInStep: {
                    ____types: "jsObject"
                }
            }
        }
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});

if (!transitionOperator.isValid()) {
    throw new Error(transitionOperator.toJSON());
}

module.exports = transitionOperator;
