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
                                        "jsUndefined", // If not specified then the this action will use its request_.context.apmBindingPath
                                        "jsString" // The apmBindingPath of the cell process that owns the display process indicated by renderData
                                    ]
                                }
                            },
                            renderData: {
                                // The routable portion of this.props bound to a <ComponentRouter/> instance
                                ____accept: "jsObject"
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

            const actorName = `[${this.operationID}::${this.operationName}]`;
            const messageBody = request_.actionRequest.holistic.app.client.display.update;
            console.log(`${actorName} attempting to activate the display process via ReactDOM.hydrate.`);

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

            const thisProps = {
                renderContext: {
                    renderEnvironment: "client",
                    ComponentRouter: displayAdapterCellData.config.ComponentRouter,
                    act: request_.context.act,
                    apmBindingPath: messageBody.renderContext.apmBindingPath?messageBody.renderContext.apmBindingPath:request_.context.apmBindingPath
                },
                renderData: messageBody.renderData
            };

            let d2r2Component = React.createElement(displayAdapterCellData.config.ComponentRouter, thisProps);
            ReactDOM.render(d2r2Component, displayAdapterCellData.config.targetDOMElement);

            displayAdapterCellData.displayUpdateCount += 1;
            const ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: displayAdapterStatus.displayAdapterProcess.apmBindingPath, dataPath: "#.displayUpdateCount" }, displayAdapterCellData.displayUpdateCount);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            console.log(`> d2r2/React display adapter render #${displayAdapterCellData.displayUpdateCount} completed.`);
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
