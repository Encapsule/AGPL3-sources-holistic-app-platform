// TransitionOperator-cpp-proxy-logical-state-connected.js

const TransitionOperator = require("../../../lib/TransitionOperator");

const transitionOperator = new TransitionOperator({
    id: "aRz-bXOaSY-77jGIvSLFvw",
    name: "Cell Process Proxy: Proxy State Connected",
    description: "Returns Boolean true if the cell process proxy helper cell is logically connected to an owned or shared local cell process.",
    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessProxy: {
                ____types: "jsObject",
                isConnected: {
                    ____types: "jsObject",
                    path: { ____accept: "jsString", ____defaultValue: "#" }
                }
            }
        }
    },
    bodyFunction: function(request_) {
        const response = { error: null, result: false };
        const errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;


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

