// TransitionOperator-cpp-proxy-logical-state-connected.js

const TransitionOperator = require("../../../TransitionOperator");
const cppLib = require("./lib");

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
                    ____accept: "jsObject",
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
            const cppLibResponse = cppLib.getStatus.request({ proxyHelperPath:  request_.context.apmBindingPath, ocdi: request_.context.ocdi });
            if (cppLibResponse.error) {
                errors.push(cppLibResponse.error);
                break;
            }
            response.result = cppLibResponse.result.status === "connected";
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

