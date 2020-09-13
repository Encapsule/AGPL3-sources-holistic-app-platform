// TransitionOperator-cpp-proxy-logical-state-disconnect.js

const TransitionOperator = require("../../../lib/TransitionOperator");

const transitionOperator = new TransitionOperator({
    id: "1SC437izTgKckxxWUq6cbQ",
    name: "Cell Process Proxy: Proxy State Disconnected",
    description: "Returns Boolean true if the cell process proxy helper cell is logically disconnected from a shared local cell process.",
    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessProxy: {
                ____types: "jsObject",
                isDisconnected: {
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
            const dispatchRequest = {
                context: request_.context,
                operatorRequest: subOperatorRequest
            };
            let transitionDispatcherResponse = request_.context.transitionDispatcher.request(dispatchRequest);
            if (transitionDispatcherResponse.error) {
                errors.push(transitionOperatorResponse.error);
                break;
            }
            response = transitionDispatcherResponse.result.request(dispatchRequest);
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

