// ControllerAction-app-client-display-update.js

const holarchy = require("@encapsule/holarchy");
const hacdLib = require("./lib");
const React = require("react");
const ReactDOM = require("react-dom");

const controllerAction = new holarchy.ControllerAction({
    id: "RlNHSKNBT32xejFqjsiZyg",
    name: "Holistic App Client Display Adapter: Update Display Layout",
    description: "Performs a programmatic re-rendering of the display adapter's DIV target using d2r2 <ComponentRouter/>.",

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
                        update: {
                            ____types: "jsObject",
                            renderContext: {
                                ____types: "jsObject",
                                ____defaultValue: {},
                                apmBindingPath: {
                                    ____accept: [
                                        "jsUndefined", // If not specified then this action will use its request_.context.apmBindingPath
                                        "jsString" // The apmBindingPath of the cell process that owns the display process indicated by renderData
                                    ]
                                }
                            },
                            renderData: {
                                // DEPRECATED
                                // The routable portion of this.props bound to a <ComponentRouter/> instance
                                ____accept: [
                                    "jsUndefined", // Prefer to use thisProps that will be made mandatory in a short time.
                                    "jsObject"
                                ]
                            },
                            thisProps: {
                                ____label: "Component Props",
                                ____description: "If specified, this is assumed to be the entirety of the actor's d2r2 render request descriptor bound to the <1:N/> resolved by <ComponentRouter/>. Note that you cannot influence the values sent via thisProps.renderContext except via overrides allowed by this request.",
                                ____accept: "jsObject",
                                ____defaultValue: { renderData: { forceDisplayError: "You didn't specify any renderData!" } }
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

            try {

                const actorName = `[${this.operationID}::${this.operationName}]`;
                const messageBody = request_.actionRequest.holistic.app.client.display.update;
                console.log(`${actorName} attempting add/remove active display processes via Data-Driven ReactDOM.render (@encapsule/d2r2).`);

                let hacdLibResponse = hacdLib.getStatus.request(request_.context);
                if (hacdLibResponse.error) {
                    errors.push(hacdLibResponse.error);
                    break;
                }
                const displayAdapterStatus = hacdLibResponse.result;
                let displayAdapterCellData = displayAdapterStatus.cellMemory;

                if (displayAdapterCellData.__apmiStep !== "display-adapter-service-ready") {
                    errors.push("This action may only be called once the app client display adapter process is in its \"display-adapter-service-ready\" step.");
                    break;
                }

                let thisProps = {
                    ...messageBody.thisProps,
                    renderContext: {
                        // NOTE: serverRender Boolean flag is not set here; it is only ever set during initial server-side rendering and initial client-side display activation.
                        ComponentRouter: displayAdapterCellData.config.ComponentRouter,
                        act: request_.context.act,
                        apmBindingPath: messageBody.renderContext.apmBindingPath?messageBody.renderContext.apmBindingPath:request_.context.apmBindingPath
                    }
                };

                if (messageBody.renderData) {
                    thisProps.renderData = messageBody.renderData;
                }

                let d2r2Component = React.createElement(displayAdapterCellData.config.ComponentRouter, thisProps);
                ReactDOM.render(d2r2Component, displayAdapterCellData.config.targetDOMElement);

                displayAdapterCellData.displayUpdateCount += 1;
                const ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: displayAdapterStatus.displayAdapterProcess.apmBindingPath, dataPath: "#.displayUpdateCount" }, displayAdapterCellData.displayUpdateCount);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                console.log(`> d2r2/React display process update #${displayAdapterCellData.displayUpdateCount} completed.`);
                break;
            } catch (exception_) {
                errors.push("AN EXCEPTION OCCURRED INSIDE THE APP CLIENT DISPLAY ADAPATER UPDATE ACTION:");
                errors.push(exception_.message);
            }
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;