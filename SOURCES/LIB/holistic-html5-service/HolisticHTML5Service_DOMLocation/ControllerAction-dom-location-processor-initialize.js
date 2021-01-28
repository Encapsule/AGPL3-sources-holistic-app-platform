// ControllerAction-dom-location-processor-initialize.js

const holarchy = require("@encapsule/holarchy");
const queryString = require("query-string");
const url = require("url");

(function() {

    const action = new holarchy.ControllerAction({

        id: "TlGPCf7uSf2cZMGZCcU85A",
        name: "HOlisticHTML5Service_DOMLocation Initialize",
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
                                    ____accept: "jsObject",
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

                console.log(`> HolisticHTML5Service_DOMLocation::initialize parsing current location.href="${location.href}"...`);

                let ocdResponse = request_.context.ocdi.getNamespaceSpec(request_.context.apmBindingPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                const apmBindingPathSpec = ocdResponse.result;

                if (!apmBindingPathSpec.____appdsl || !apmBindingPathSpec.____appdsl.apm || (apmBindingPathSpec.____appdsl.apm !==  "OWLoNENjQHOKMTCEeXkq2g")) {
                    errors.push(`Invalid apmBindingPath="${request_.context.apmBindingPath}" does not resolve to an active HolisticHTML5Service_DOMLocation cell as expected.`);
                    break;
                }

                // Retrieve the current (defaulted) value of the cell's OCD memory.
                ocdResponse = request_.context.ocdi.readNamespace(request_.context.apmBindingPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const cellMemory = ocdResponse.result;

                let actResponse = request_.context.act({
                    actorName: "HolisticHTML5Service_DOMLocation Initialize",
                    actorTaskDescription: "Attempting to parse the initial window.location.href value.",
                    actionRequest: {
                        holistic: {
                            app: {
                                client: {
                                    domLocation: {
                                        _private: {
                                            parseLocation: {
                                                href: window.location.href,
                                                routerEventNumber: 0,
                                                actor: "server"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                const routerEventDescriptor = actResponse.result.actionResult;

                cellMemory.private.locationHistory.push(routerEventDescriptor);
                cellMemory.private.routerEventCount++;

                ocdResponse = request_.context.ocdi.writeNamespace(request_.context.apmBindingPath, cellMemory);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                /* experiment


                const hashLength = !location.hash?0:location.hash.length;
                const hasHashRoute = (hashLength || location.href.endsWith("#"));


                   if (!hasHashRoute) {
                   location.replace("#");
                   }


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

                */

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

    if (!action.isValid()) {
        throw new Error(action.toJSON);
    }

    module.exports = action;

})();

