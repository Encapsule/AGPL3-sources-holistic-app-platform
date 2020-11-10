// ControllerAction-app-client-display-step-worker.js

const holarchy = require("@encapsule/holarchy");
const hacdLib = require("./lib");

const d2r2 = require("@encapsule/d2r2");
const d2r2ComponentsMap = require("@encapsule/d2r2-components");
const d2r2ComponentsAppPlatform = [];
Object.keys(d2r2ComponentsMap.components).forEach((key_) => {
    d2r2ComponentsAppPlatform.push(d2r2ComponentsMap.components[key_]);
});

const controllerAction = new holarchy.ControllerAction({

    id: "U3iqspa5TKGXeLfES-6hXA",
    name: "Holistic App Client Display Adapter: Process Step Worker",
    description: "Performs actions on behalf of the Holistic App Client Display Adapter process.",

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
                        _private: {
                            ____types: "jsObject",
                            stepWorker: {
                                ____types: "jsObject",
                                action: {
                                    ____accept: "jsString",
                                    ____inValueSet: [
                                        "noop",
                                        "initialize-display-adapter"
                                    ],
                                    ____defaultValue: "noop"
                                }
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
            const messageBody = request_.actionRequest.holistic.app.client.display._private.stepWorker;
            console.log(`${actorName} processing "${messageBody.action}" request on behalf of app client kernel process.`);

            let hacdLibResponse = hacdLib.getStatus.request(request_.context);
            if (hacdLibResponse.error) {
                errors.push(hacdLibResponse.error);
                break;
            }
            const displayAdapterStatus = hacdLibResponse.result;
            let displayAdapterCellData = displayAdapterStatus.cellMemory;

            let ocdResponse;

            switch (messageBody.action) {

            case "noop":
                break;

            case "initialize-display-adapter":
                if (displayAdapterCellData.config !== undefined) {
                    errors.push("The display adapter has already been initialized!");
                    break;
                }
                const targetDOMElement = document.getElementById(displayAdapterCellData.construction.idTargetDOMElement);
                if (!targetDOMElement) {
                    errors.push(`Cannot initialize the display adapter because the DOM element ID "${displayAdapterCellData.construction.idTargetDOMElement}" does not exist.`);
                    break;
                }
                const factoryResponse = d2r2.ComponentRouterFactory.create({
                    d2r2ComponentSets: [
                        d2r2ComponentsAppPlatform,
                        displayAdapterCellData.construction.d2r2Components
                    ]
                });
                if (factoryResponse.error) {
                    errors.push("Cannot initialize the display adapter because an error occurred d2r2 <ComponentRouter/> construction:");
                    errors.push(factoryResponse.error);
                    break;
                }
                const ComponentRouter = factoryResponse.result;
                ocdResponse = request_.context.ocdi.writeNamespace(
                    { apmBindingPath: request_.context.apmBindingPath, dataPath: "#.config" },
                    { targetDOMElement, ComponentRouter }
                );
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                break;

            default:
                errors.push(`Internal error: unhandled action "${messageBody.action}".`);
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

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;

