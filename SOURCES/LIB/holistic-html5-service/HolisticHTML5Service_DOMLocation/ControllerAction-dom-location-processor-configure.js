// ControllerAction-dom-location-processor-configure.js

const holarchy = require("@encapsule/holarchy");

const dlpLib = require("./lib");

( function() {

    const action = new holarchy.ControllerAction({
        id: "9s71Ju3pTBmYwCe_Mzfkuw",
        name: "HolisticHTML5Service_DOMLocation Configure",
        description: "Used to set the runtime configuration of the process during service boot.",
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
                                configure: {
                                    ____types: "jsObject",
                                    httpResponseCode: { ____accept: "jsNumber" }
                                }
                            }
                        }
                    }
                }
            }
        },
        actionResultSpec: { ____accept: "jsUndefined" },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                const messageBody = request_.actionRequest.holistic.app.client.domLocation._private.configure;

                let libResponse = dlpLib.getStatus.request(request_.context);
                if (libResponse.error) {
                    errors.push(libResponse.error);
                    break;
                }
                const { cellMemory, cellProcess } = libResponse.result;

                cellMemory.httpResponseCode = messageBody.httpResponseCode;

                switch (cellMemory.httpResponseCode) {
                case 200:
                    // The HTML5 document synthesized by HolisticNodeService is a correctly serialized HolisticHTML5Service instance.
                    const serverRouterEvent = cellMemory.locationHistory[0];
                    if (!serverRouterEvent.hashrouteString) {
                        const hrefReplace = `${serverRouterEvent.hrefParse.href}#`;
                        // We have a correctly serialized HolisticHTML5Service instance. But, no hashroute specified in the original server router event descriptor.
                        libResponse = dlpLib.parseLocation.request({ actor: "app", href: hrefReplace, routerEventNumber: 0 });
                        if (libResponse.error) {
                            errors.push(libResponse.error);
                            break;
                        }
                        cellMemory.locationHistory[0] = libResponse.result;
                        window.location.replace(hrefReplace);
                    }
                    setTimeout(() => {
                        window.addEventListener("hashchange", (event_) => {
                            request_.context.act({
                                apmBindingPath: request_.context.apmBindingPath,
                                actorName: "DOMLocationProcessor:hashchange Event Handler",
                                actorTaskDescription: "Notifying the DOM Location Processor of hashchange/location update.",
                                actionRequest: { holistic: { app: { client: { domLocation: { _private: { notifyEvent: { hashchange: { event: event_ } } } } } } } }
                            });
                            event_.preventDefault();
                        });
                    },0);
                    break;
                default:
                    // TODO Move this into an even registration action for clarity.
                    setTimeout(() => {
                        window.addEventListener("hashchange", (event_) => {
                            window.location.reload();
                            event_.preventDefault();
                        });
                    }, 0); // next tick.
                    break;
                } // switch

                if (errors.length) {
                    break;
                }

                let ocdResponse = request_.context.ocdi.writeNamespace(cellProcess.apmBindingPath, cellMemory);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });

    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }

    module.exports = action;

})();

