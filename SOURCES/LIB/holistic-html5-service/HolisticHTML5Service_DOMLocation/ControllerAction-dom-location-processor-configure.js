// ControllerAction-dom-location-processor-configure.js

const holarchy = require("@encapsule/holarchy");

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

                ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.httpResponseCode" }, messageBody.httpResponseCode);

                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                if (messageBody.httpResponseCode !== 200) {
                    window.addEventListener("hashchange", (event_) => {
                        window.location.reload();
                        event_.preventDefault();
                    });
                    break;
                }

                // Retrieve the current (defaulted) value of the cell's OCD memory.
                ocdResponse = request_.context.ocdi.readNamespace(request_.context.apmBindingPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const cellMemory = ocdResponse.result;

                const serverRouterEvent = cellMemory.private.locationHistory[0];

                const hrefReplace = serverRouterEvent.hrefParse.href;

                if (!serverRouterEvent.hashrouteString) {
                    hrefReplace += "#";
                    let actResponse = request_.context.act({
                        actorName: "HolisticHTML5Service_DOMLocation Configure",
                        actorTaskDescription: "Re-parsing the initial window.location.href exposed to the derived service.",
                        actionRequest: {
                            holistic: {
                                app: {
                                    client: {
                                        domLocation: {
                                            _private: {
                                                parseLocation: {
                                                    href: hrefReplace,
                                                    routerEventNumber: 0,
                                                    actor: "app"
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
                    cellMemory.private.locationHistory[0] = actResponse.result.actionResult;
                    ocdResponse = request_.context.ocdi.writeNamespace(request_.context.apmBindingPath, cellMemory);
                    if (ocdResponse.error) {
                        errors.push(ocdResponse.error);
                        break;
                    }
                }

                window.location.replace(hrefReplace);

                // Iff we call window.location.replace AND we also addEventListener in the _same_ execution context
                // then we generate a hashchange event. However, if we defer the addEventListener until the next
                // clock tick, then we'll only receive the hashchange event when the user actually changes the
                // window.location.href hash string. Which, isn't documented _anywhere_ that I can find.

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

