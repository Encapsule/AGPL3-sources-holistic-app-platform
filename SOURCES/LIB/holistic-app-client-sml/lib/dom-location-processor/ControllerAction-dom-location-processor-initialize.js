// ControllerAction-init-dom-client-hash-router.js

const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.ControllerAction({
    id: "TlGPCf7uSf2cZMGZCcU85A",
    name: "DOM Client Location Proccessor: Initialize",
    description: "Adds a listener to the brower's 'hashchange' event and redirects subsequent event callbacks to the ControllerAction peTmTek_SB64-ofd_PSGj.",
    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            sml: {
                ____types: "jsObject",
                actions: {
                    ____types: "jsObject",
                    ClientDOMLocationProcessor: {
                        ____types: "jsObject",
                        initialize: {
                            ____accept: "jsBoolean",
                            ____inValueSet: [ true ]
                        }
                    }
                }
            }
        }
    },
    actionResultSpec: { ____accept: "jsUndefined" }, // action returns no response.result
    bodyFunction: (request_) => {
        return { error: null };
    }
});
