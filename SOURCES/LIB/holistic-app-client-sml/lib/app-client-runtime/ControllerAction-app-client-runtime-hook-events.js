// ControllerAction-app-client-hook-events.js

const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.ControllerAction({

    id: "JwE4LMvpRGC3Jsg1RDjJ1Q",
    name: "Holistic App Client Hook Events",
    description: "Hooks DOM events on behalf of the Holistic App Client Runtime OPM.",

    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                client: {
                    ____types: "jsObject",
                    sml: {
                        ____types: "jsObject",
                        HolisticAppRuntime: {
                            ____types: "jsObject",
                            actions: {
                                ____types: "jsObject",
                                _private: {
                                    ____types: "jsObject",
                                    hookEvents: {
                                        ____accept: "jsBoolean",
                                        ____inValueSet: [ true ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: { ____accept: "jsUndefined" }, // action returns no response.result

    bodyFunction: (request_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            // Hook the window.onload event.
            window.onload((event_) => {
                const actResponse = request_.context.act({
                    opmBindingPath: request_.context.opmBindingPath,
                    actorName: "DOM Event window.onload",
                    actorTaskDescription: "Signal that the window.onload event has fired.",
                    actionRequest: { holistic: { app: { client: { sml: { HolisticAppClient: { actions: { _private: { notifyEvent: { window: { onload: { event: event_ } } } } } } } } } } }

                });
                if (actResponse.error) {
                    throw new Error(actResponse.error);
                }
            });

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});
