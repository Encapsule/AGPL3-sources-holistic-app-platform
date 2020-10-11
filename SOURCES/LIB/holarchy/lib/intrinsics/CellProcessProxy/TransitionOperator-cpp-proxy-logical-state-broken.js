// TransitionOperator-cpp-proxy-logical-state-broken.js

const TransitionOperator = require("../../../TransitionOperator");
const cppLib = require("./lib");

const transitionOperator = new TransitionOperator({
    id: "c-n6U_maQa23j9jWFDsgOw",
    name: "Cell Process Proxy: Proxy State Broken",
    description: "Returns Boolean true if the cell process proxy helper cell was logically connected to an owned local cell process that has been deleted.",
    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessProxy: {
                ____types: "jsObject",
                isBroken: {
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
            const cppLibResponse = cppLib.getStatus.request({ proxyHelperPath: request_.context.apmBindingPath, ocdi: request_.context.ocdi });
            if (cppLibResponse.error) {
                errors.push(cppLibResponse.error);
                break;
            }
            response.result = cppLibResponse.result.status === "broken";
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
