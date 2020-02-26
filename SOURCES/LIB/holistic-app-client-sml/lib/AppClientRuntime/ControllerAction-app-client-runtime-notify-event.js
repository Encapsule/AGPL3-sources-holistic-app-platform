
// ControllerAction-app-client-runtime-notify-event.js

module.exports = {

    id: "h-auSE-OSP2TG1jh_3EQ1Q",
    name: "Holistic App Client Runtime Receive DOM Event",
    description: "ControllerAction that signals the HolisticAppClientRuntime CM that the window.onload event has occurred.",

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
        }
    },

    actionResultSpec: { ____accept: "jsUndefined" }, // action return no response.result

    bodyFunction: (request_) => {
        let response = { error: null };
        return response;
    }

};
