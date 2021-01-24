// ControllerAction-init-dom-client-hash-router.js

const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.ControllerAction({
    id: "TlGPCf7uSf2cZMGZCcU85A",
    name: "DOM Client Location Proccessor: Initialize",
    description: "Adds a listener to the brower's 'hashchange' event and redirects subsequent event callbacks to the ControllerAction peTmTek_SB64-ofd_PSGj.",
    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                client: {
                    ____types: "jsObject",
                    domLocation: {
                        ____types: "jsObject",
                        _private: {
                            ____types: "jsObject",
                            initialize: {
                                ____accept: "jsBoolean",
                                ____inValueSet: [ true ]
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

            const hashLength = !location.hash?0:location.hash.length;
            const hasHashRoute = (hashLength || location.href.endsWith("#"));

            /* experiment

            if (!hasHashRoute) {
                location.replace("/#");
            }

            */

            window.addEventListener("hashchange", (event_) => {
                // If this act request fails, the app client process will get notified via its error lifecycle action.
                request_.context.act({
                    apmBindingPath: request_.context.apmBindingPath,
                    actorName: "DOMLocationProcessor:hashchange Event Handler",
                    actorTaskDescription: "Notifying the DOM Location Processor of hashchange/location update.",
                    actionRequest: { holistic: { app: { client: { domLocation: { _private: { notifyEvent: { hashchange: { event: event_ } } } } } } } }
                }, false);
                event_.preventDefault();
            });

            /* ----------------------------------------------------------------
               v0.0.48-kyanite
               SAVE THIS - this is the actual spanner in the works that blocks the user from navigating away or
               to another domain or closing the browser tab. But, it's very tricky to use it correctly; there
               needs to be a whole app-level protocol based on some sort of model of the user's browser tab
               session that toggles this mechanism on/off as appropriate. We will bring this back into the
               mix shortly....

               // https://stackoverflow.com/questions/821011/prevent-a-webpage-from-navigating-away-using-javascript
               window.addEventListener("beforeunload", (event_) => {
               event_.preventDefault();
               event_.returnValue = "";
               }, false);

               ---------------------------------------------------------------- */

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});
