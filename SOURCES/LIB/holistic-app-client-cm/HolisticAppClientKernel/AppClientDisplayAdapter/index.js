
const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");
const hacdLib = require("./lib");

(function() {

    const factoryResponse = arccore.filter.create({
        operationID: "IN0xuhS8RQ6F3_M5uXiadg",
        operationName: "Holistic Tab Service Display Adapter CellModel Factory",
        operationDescription: "Used to synthesize a specialized HolisticTabService display adapter CellModel for use by HolisticTabService instance.",
        inputFilterSpec: {
            ____types: "jsObject",
            appBuild: {
                ____accept: "jsObject"
            },
            appModels: {
                ____types: "jsObject",
                display: {
                    ____label: "Holistic Tab Service Display Adapter Specializations",
                    ____types: "jsObject",
                    targetDOMElementID: {
                        ____accept: "jsString" // This is the platform's selected DOM element id string value used by the caller to obtain targetDOMElement from the DOM.
                    },
                    d2r2Components: {
                        ____label: "Holistic Tab Service Display Adapter d2r2 Components",
                        ____description: "This is the final aggregated array of d2r2 components assembled by the tab service kernel during HolisticTabService class instance construction.",
                        ____types: "jsArray",
                        d2r2Component: {
                            ____accept: "jsObject" // This is an @encapsule/d2r2 component element generator filter object
                        }
                    }
                }
            }
        },
        outputFilterSpec: {
            ____accept: "jsObject" // This is an @encapsule/holarchy CellModel (the DisplayAdapter CellModel specifically).
        },
        bodyFunction: function(request_) {

            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const appBuild = request_.appBuild;

                const targetDOMElementID = request_.appModels.display.targetDOMElementID;
                const targetDOMElement = document.getElementById(targetDOMElementID);

                // We just do what we're told at this level... We're fly by data from the tab service kernel.

                if (!targetDOMElement) {
                    errors.push(`Cannot locate the specified targetDOMElementID "${targetDOMElementID}" in the DOM?!`);
                    break;
                }

                var factoryResponse = d2r2.ComponentRouterFactory.create({ d2r2ComponentSets: [ request_.appModels.display.d2r2Components ] });
                if (factoryResponse.error) {
                    errors.push(`Cannot construct a d2r2 <ComponentRouter/> instance due to error:`);
                    errors.push(factoryResponse.error);
                }

                const ComponentRouter = factoryResponse.result;


                module.exports = new holarchy.CellModel({
                    id: "UX7JquBhSZO0QyEk7u9-sw",
                    name: "d2r2/React Display Adapter",
                    description: "Manages the DOM display via @encapsule/d2r2 and React.",
                    apm: require("./AbstractProcessModel-app-client-display-adapter"),
                    actions: [
                        {
                            id: "o24IDZhRRA6MbUoOcT15EQ",
                            name: "d2r2/React Display Adapter: Load Config",
                            description: "Bootstraps information from CellModel construction scope into the cell's memory.",
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
                                                    loadConfig: { ____accept: "jsObject" }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: {
                                ____accept: "jsString",
                                ____defaultValue: "Okay"
                            },
                            bodyFunction: function(request_) {
                                let response = { error: null };
                                let errors = [];
                                let inBreakScope = false;
                                while (!inBreakScope) {
                                    inBreakScope = true;
                                    let hacdLibResponse = hacdLib.getStatus.request(request_.context);
                                    if (hacdLibResponse.error) {
                                        errors.push(hacdLibResponse.error);
                                        break;
                                    }
                                    const displayAdapterStatus = hacdLibResponse.result;
                                    let displayAdapterCellData = displayAdapterStatus.cellMemory;

                                    displayAdapterCellData.config = {
                                        targetDOMElementID,
                                        targetDOMElement,
                                        ComponentRouter
                                    };

                                    let ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: displayAdapterStatus.displayAdapterProcess.apmBindingPath, dataPath: "#.config" }, { targetDOMElementID, targetDOMElement, ComponentRouter });
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
                        }, // holistic.app.client.display._private.loadConfig
                        // require("./ControllerAction-app-client-display-step-worker"),
                        require("./ControllerAction-app-client-display-activate"),
                        require("./ControllerAction-app-client-display-update")
                    ],
                    subcells: [ ]
                });


                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        } // bodyFunction
    });
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }
    module.exports = factoryResponse.result; // This is an @encapsule/arccore.filter (specifically its a HolisticTabService kernel CellModel factory).

})();

