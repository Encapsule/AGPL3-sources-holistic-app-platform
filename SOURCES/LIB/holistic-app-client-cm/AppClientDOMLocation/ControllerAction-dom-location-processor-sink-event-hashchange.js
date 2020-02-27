// ControllerAction-dom-client-event-sink-hashchange.js

const holarchy = require("@encapsule/holarchy");

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
                    cm: {
                        ____types: "jsObject",
                        actions: {
                            ____types: "jsObject",
                            DOMLocationProcessor: {
                                ____types: "jsObject",
                                notifyEvent: {
                                    ____types: "jsObject",
                                    hashchange: {
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

            console.log(`Current value of location.href is '${location.href}'`);

            // Resolve the full path the DOM Location Processor outputs namespace.
            let rpResponse = holarchy.ObservableControllerData.dataPathResolve({
                apmBindingPath: request_.context.apmBindingPath,
                dataPath: "#.outputs"
            });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const pathOutputs = rpResponse.result;

            let ocdResponse = request_.context.ocdi.readNamespace(pathOutputs);
            if (ocdResponse.error) { errors.push(ocdResponse.error); break; }
            const outputs = ocdResponse.result;

            if (outputs.currentRoute && (outputs.currentRoute.href === location.href)) {
                console.log("This event will be ignored. It was induced by the DOM Location Processor's init action replacing the server's non-hashroute with the default, #.");
                break;
            }

            // Resolve the full path the DOM Location Processor _private namespace.
            rpResponse = holarchy.ObservableControllerData.dataPathResolve({
                apmBindingPath: request_.context.apmBindingPath,
                dataPath: "#._private"
            });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const pathPrivate = rpResponse.result;

            // Read the DOM Location Processor's _private OCD namespace.
            ocdResponse = request_.context.ocdi.readNamespace(pathPrivate);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const _private = ocdResponse.result;

            const routerEventDescriptor = {
                actor: ((_private.routerEventCount === _private.lastOutputEventIndex)?(_private.routerEventCount?"user":"server"):"app"),
                href: location.href, // capture the entire href serialization from the location object
                routerEventNumber: _private.routerEventCount
            };

            _private.locationHistory.push(routerEventDescriptor);

            _private.routerEventCount++; // total hashchange events

            if (_private.routerEventCount > _private.lastOutputEventIndex) {

                // Always re-written in the epilogue.
                _private.lastOutputEventIndex++;
                _private.updateObservers = true;

                // Resolve the full path the DOM Location Processor outputs.currentRoute namespace.
                let rpResponse = holarchy.ObservableControllerData.dataPathResolve({
                    apmBindingPath: request_.context.apmBindingPath,
                    dataPath: "#.outputs.currentRoute"
                });
                if (rpResponse.error) {
                    errors.push(rpResponse.error);
                    break;
                }
                const pathCurrentRoute = rpResponse.result;

                // Write the current route descriptor to the output.
                let ocdResponse = request_.context.ocdi.writeNamespace(pathCurrentRoute, routerEventDescriptor);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
            }

            ocdResponse = request_.context.ocdi.writeNamespace(pathPrivate, _private);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
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
