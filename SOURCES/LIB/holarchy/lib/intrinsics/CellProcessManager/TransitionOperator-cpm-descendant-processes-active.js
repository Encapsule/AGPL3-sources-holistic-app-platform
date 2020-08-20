// TransitionOperator-cpm-descendant-processes-active.js

const cpmLib = require("./lib");
const TransitionOperator = require("../../TransitionOperator");

// TODO: Not sure we'll actually ever use this. But it's simple enough. Keep an eye. Maybe remove it later?

module.exports = new TransitionOperator({
    id: "Fs6tE76WR5yTOdbwQ_N_FQ",
    name: "Cell Proces Manager: Descendant Processes Active",
    description: "Returns Boolean true request.context.apmBindingPath is a cell process with active dependant cell processes.",
    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                descendantProcessesActive: {
                    ____types: "jsObject"
                }
            }
        }
    },

    bodyFunction: function(request_) {
        // Not implemented yet...
        return { error: null, result: false };
    }
});
