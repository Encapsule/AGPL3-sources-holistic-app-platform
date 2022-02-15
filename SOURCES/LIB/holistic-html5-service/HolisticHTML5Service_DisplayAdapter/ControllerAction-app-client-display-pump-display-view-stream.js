// ControllerAction-app-client-display-pump-display-view-stream.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolisticHTML5ServicePackage = require("../cmasHolisticHTML5ServicePackage");
    const hacdLib = require("./lib");
    const React = require("react");
    const ReactDOM = require("react-dom");
    const cmLabel = require("./cell-label");
    const actionLabel =  "pumpDisplayViewStream";
    const actionName = `${cmLabel} Pump Display View Stream`;

    const action = new holarchy.ControllerAction({

        id: cmasHolisticHTML5ServicePackage.mapLabels({ CM: cmLabel, ACT: actionLabel }).result.ACTID,
        name: actionName,
        description: "Dispatched to read an updated DisplayStreamMessage from our ObservableValueHelper and call React.",

        actionRequestSpec: {
            ____types: "jsObject",
            holistic: {
                ____types: "jsObject",
                app: {
                    ____types: "jsObject",
                    client: {
                        ____types: "jsObject",
                        display: {
                            ____types: "jsObject",
                            _private: { // We're going to trigger this from APM step transition rule
                                ____types: "jsObject",
                                pumpDisplayStream: {
                                    ____types: "jsObject",
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

        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                console.log("================================================================");
                console.log("================================================================");
                console.log("================================================================");
                console.log("================================================================");
                console.log(`[${this.filterDescriptor.operationID}::${this.filterDescriptor.operationName}] attempting to update display layout due to detected chanage(s)...`);

                // Get our cell memory and process data.

                let hacdLibResponse = hacdLib.getStatus.request(request_.context);
                if (hacdLibResponse.error) {
                    errors.push(hacdLibResponse.error);
                    break;
                }
                console.log("> HolisticHTML5Service_DisplayAdapter has located its process and read its cell memory...");
                const { cellMemory, cellProcess } = hacdLibResponse.result;

                // Read the updated DisplayStreamMessage from our ObservableValueHelper input.

                let actResponse = request_.context.act({
                    actorName: actionName,
                    actorTaskDescription: "Attempting to read a new DisplayStreamMessage from our ObservableValueHelper input...",
                    actionRequest: { holarchy: { common: { actions: { ObservableValueHelper: { readValue: { path: "#.inputs.displayViewStream" } } } } } },
                    apmBindingPath: request_.context.apmBindingPath // because we're triggered by APM step transition rule
                });

                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                // Okay, got it!
                const displayStreamMessage = actResponse.result.actionResult;

                console.log("> HolisticHTML5Service_DisplayAdapter has read a new DisplayStreamMessage from its registered DisplayView cell...");

                // Now, build an object to bind to a React.Component class to create a React.Element instance.

                // ATTENTION: THIS IS THE FINAL OUTPUT CONTRACT SENT INTO <ComponentRouter/>.
                // Changes made here must be reflected (very very carefully) through d2r2 and the all DisplayView* <-> ViewDisplay* codepaths.

                const thisProps = {
                    renderContext: {
                        // NOTE: serverRender Boolean flag is not set here; it is only ever set during initial server-side rendering and initial client-side display activation.
                        ...displayStreamMessage.value.renderContext,
                        //displayPath: `${displayStreamMessage.value.renderContext.displayPath}.${displayStreamMessage.value.renderContext.displayInstance}`,
                        d2r2BusState: "dv-root-active-vd-root-pending",
                        ComponentRouter: cellMemory.config.ComponentRouter,
                        act: request_.context.act
                    },
                    renderData: {
                        ...displayStreamMessage.value.renderData,
                        revision: displayStreamMessage.revision,
                    }
                };

                // Now, create us a React.Element --- Note that this _appears_ simple.
                // It's a bridge between two worlds; here we have no idea what's inside thisProps.
                // And, <ComponentRouter/> maps thisProps to 1:N registered d2r2Components.
                // So, basically this can render anything into display process land.

                const reactElement = React.createElement(cellMemory.config.ComponentRouter, thisProps);

                console.log("> HolisticHTML5Service_DisplayAdapter has manufactured a React.Element from request data via d2r2 <ComponentRouter/>...");

                // SO, AFTER ALL THAT ...
                // Replace the currently user-visible DOM contents (indirectly), by making an "action request" on ReactDOM.render.
                // We presume that whomever provided the DisplayStreamMessage was smart enough to send along enough info
                // so that whatever React.Element(s) they mount in the React VDOM can communicate back to to the CellProcessor
                // via thisProps.renderContext.act function.

                ReactDOM.render(reactElement, cellMemory.config.targetDOMElement);

                console.log("> HolisticHTML5Service_DisplayAdapter has udpated/replaced the current set of ViewDisplay process(es) (aka mounted React.Element) in the React-managed VDOM...");

                cellMemory.displayUpdateCount += 1;
                const ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: cellProcess.apmBindingPath, dataPath: "#.displayUpdateCount" }, cellMemory.displayUpdateCount);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                console.log(`[${this.filterDescriptor.operationID}::${this.filterDescriptor.operationName}] display process tree update ${cellMemory.displayUpdateCount} complete.`);
                console.log("================================================================");
                console.log("================================================================");
                console.log("================================================================");
                console.log("================================================================");

                // And, we're out.
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

