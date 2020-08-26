// TransitionOperator-cpm-ancestor-processes-active.js

const TransitionOperator = require("../../TransitionOperator");

const transitionOperator = new TransitionOperator({
    id: "gJnA-VJTTLa0g9TKFmjv1Q",
    name: "Cell Process Manager: Ancestor Processes Active",
    description: "Return Boolean true if request.context.apmBindingPath is a cell process with active ancestor processes.",

    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                ancestorProcessesActive: {
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
