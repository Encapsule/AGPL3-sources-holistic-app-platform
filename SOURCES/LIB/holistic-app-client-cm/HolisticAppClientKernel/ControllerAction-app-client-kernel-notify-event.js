
// ControllerAction-app-client-runtime-notify-event.js

module.exports = {

    id: "h-auSE-OSP2TG1jh_3EQ1Q",
    name: "Holistic App Client Kernel: Receive DOM Event",
    description: "ControllerAction that signals the Holistic App Client Kernel process of the occurance of a previously-hooked DOM event.",

    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                client: {
                    ____types: "jsObject",
                    kernel: {
                        ____types: "jsObject",
                        _private: {
                            ____types: "jsObject",
                            notifyEvent: {
                                ____types: "jsObject",
                                eventName: {
                                    ____types: "jsString",
                                    ____inValueSet: [
                                        "window.onload"
                                    ]
                                },
                                eventData: {
                                    ____opaque: true
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____accept: "jsString",
        ____defaultValue: "okay"
    },

    bodyFunction: (request_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const message = request_.actionRequest.holistic.app.client.kernel._private.notifyEvent;

            switch (message.eventName) {

            case "window.onload":

                // We just need to signal the HolisticAppClientRuntime cell process that the window has loaded.
                let actionResponse = request_.context.act({
                    actorName: "HolisticAppClientRuntime External DOM Event Notify",
                    actorTaskDescription: "Inform the HolisticAppClientRutime cell process that the window has loaded.",
                    actionRequest: { holarchy: { cm: { actions: { ocd: { setBooleanFlag: { path: "#.windowLoaded" } } } } } },
                    apmBindingPath: request_.context.apmBindingPath
                });

                if (actionResponse.error) {
                    // TODO: Report this back to the app kernel via an action that needs to get written soon.
                    console.error(actionResponse.error);
                }
                break;

            default:
                errors.push(`Action implementation does not yet support event name '${message.eventName}'.`);
                break;
            }


            break;
        }
        if (errors.length) {
            response.error = join(" ");
        }
        return response;
    }

};
