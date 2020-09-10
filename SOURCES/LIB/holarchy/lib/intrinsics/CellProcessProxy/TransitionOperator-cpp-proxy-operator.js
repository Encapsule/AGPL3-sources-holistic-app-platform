// SOURCES/LIB/holarchy/lib/intrinsics/CellProcessProxy/TransitionOperator-cpp-proxy-operator.js

const TransitionOperator = require("../../../lib/TransitionOperator");

const action = new TransitionOperator({
    id: "FTxze-WaRp6HS0Dlr_Ke6A",
    name: "Cell Process Proxy: Proxy Operator",
    description: "Forwards the specified operator request to the local cell process to which the proxy is currently connected.",

    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                process: {
                    ____types: "jsObject",
                    proxy: {
                        ____types: "jsObject",
                        // Proxy (i.e. forward through) this proxy to another local cell process...
                        proxyPath: {
                            ____accept: "jsString",
                            ____defaultValue: "#"
                        },
                        // ... an arbitrary TransitionOperator request.
                        request: {
                            ____accept: "jsObject"
                        }
                    }
                }
            }
        }

    },

    bodyFunction: function(request_) {
        return { error: null, result: false};
    }
    
});

if (!action.isValid()) {
    throw new Error(action.toJSON());
}

module.exports = action;
