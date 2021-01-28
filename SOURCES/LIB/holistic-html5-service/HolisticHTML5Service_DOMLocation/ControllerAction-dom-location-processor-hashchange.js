// ControllerAction-dom-client-event-sink-hashchange.js

const holarchy = require("@encapsule/holarchy");

const dlpLib = require("./lib");

module.exports = new holarchy.ControllerAction({
    id: "peTmTek_SB64-ofd_PSGjg",
    name: "DOM Client Location Processor: 'hashchange'",
    description: "Accepts info about the 'hashchange' event and encapsulates the details of updating the DOM Client Locaiton Processor APM memory to record the event details.",
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
                            notifyEvent: {
                                ____types: "jsObject",
                                hashchange: {
                                    ____types: "jsObject",
                                    event: {
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

    actionResultSpec: { ____accept: "jsUndefined" }, // action returns no response.result
    bodyFunction: (request_) => {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            let libResponse = dlpLib.getStatus.request(request_.context);
            if (libResponse.error) {
                errors.push(libResponse.error);
                break;
            }
            const { cellMemory, cellProcess } = libResponse.result;

            libResponse = dlpLib.parseLocation.request({ actor: "user", href: window.location.href, routerEventNumber: cellMemory.locationHistory.length + 1});
            if (libResponse.error) {
                errors.push(libResponse.error);
                break;
            };
            const routerEventDescriptor = libResponse.result;

            cellMemory.locationHistory.push(routerEventDescriptor);

            let actResponse = request_.context.act({
                actorName: "DOMLocationProcessor",
                actionTaskDescription: "Informing the app client service of udpate to the current hashroute location data.",
                actionRequest: {
                    CellProcessor: {
                        cell: {
                            delegate: {
                                cell: cellMemory.derivedAppClientProcessCoordinates,
                                actionRequest: { holistic: { app: { client: { lifecycle: { hashroute: { ...routerEventDescriptor } } } } } }
                            }
                        }
                    }
                },
                apmBindingPath: request_.context.apmBindingPath
            });
            if (actResponse.error) {
                errors.push(actResponse.error);
                break;
            }

            break;

        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});
