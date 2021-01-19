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

            const endsWithHash = location.href.endsWith("#");
            const hashLength = location.hash?location.hash.length:0;
            const addHash = !(hashLength || endsWithHash);
            let ignoreEvent = false;

            if (addHash) {
                // Always display the hash # delimiter between the server href and client-only hashroute portions of the href string.
                const newLocation = `${location.href}#`;
                console.log(`> DOMLocationProcessor is setting the replacing the DOM location with "${newLocation}".`);
                // location.replace(newLocation);
                ignoreEvent = true;
            }

            window.addEventListener("hashchange", (event_) => {

                event_.preventDefault();

                if (!ignoreEvent) {

                    // If this act request fails, the app client process will get notified via its error lifecycle action.
                    request_.context.act({
                        apmBindingPath: request_.context.apmBindingPath,
                        actorName: "DOMLocationProcessor:hashchange Event Handler",
                        actorTaskDescription: "Notifying the DOM Location Processor of hashchange/location update.",
                        actionRequest: { holistic: { app: { client: { domLocation: { _private: { notifyEvent: { hashchange: true } } } } } } }
                    }, false);

                } else {
                    console.log("> DOMLocationProcessor is dropping the first hashchange event because we caused it to occur by calling DOM location.replace append # to the currently displayed browser location.");
                    ignoreEvent = false; // this is one-shot flag that's set true iff addHash
                }

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
