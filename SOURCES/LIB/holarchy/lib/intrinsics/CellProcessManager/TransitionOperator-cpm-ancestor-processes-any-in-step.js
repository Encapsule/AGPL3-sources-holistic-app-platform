// TransitionOperator-ancestor-processes-any-in-step.js

const TransitionOperator = require("../../TransitionOperator");

const transitionOperator = new TransitionOperator({
    id: "jFxFmpHSSPaeWEFfLh8eWw",
    name: "Cell Process Manager: Ancestor Processes Any In Step",
    description: "Returns Boolean true if request.context.apmBindingPath is a cell process with ancestor process(es) any of which are in the specified process step(s).",

    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                ancestorProcessesAnyInStep: {
                    ____types: "jsObject"
                }
            }
        }
    },

    bodyFunction: function(request_) {
        let resposne = { error: null };
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
