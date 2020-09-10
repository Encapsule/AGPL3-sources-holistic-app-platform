// SOURCES/LIB/holarchy/lib/intrinsics/CellProcessProxy/ControllerAction-cpp-proxy-connect.js

const ControllerAction = require("../../../lib/ControllerAction");

const action = new ControllerAction({
    id: "X6ck_Bo4RmWTVHl-vk-urw",
    name: "Cell Process Proxy: Connect Proxy",
    description: "Disconnect a connected cell process proxy process (if connected). And, connect the proxy to the specified local cell process.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                process: {
                    ____types: "jsObject",
                    proxy: {
                        ____types: "jsObject",
                        connect: {
                            ____types: "jsObject",
                            // Connect from this proxy process (a helper cell process)...
                            proxyPath: {
                                ____accept: "jsString",
                                ____defaultValue: "#"
                            },
                            // ... to this new or existing local cell process.
                            cellProcess: {
                                ____types: "jsObject",
                                apmID: {
                                    ____accept: "jsString"
                                },
                                instanceName: {
                                    ____accept: "jsString",
                                    ____defaultValue: "singleton"
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____accept: "jsObject" // TODO
    },

    bodyFunction: function(request_) {
        return { error: null };
    }
    
});

if (!action.isValid()) {
    throw new Error(action.toJSON());
}

module.exports = action;
