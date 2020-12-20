
const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");
const d2r2 = require("@encapsule/d2r2");
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
                        ____description: "This is derived app service's d2r2 component set. The display adapter merges platform-provided d2r2 components prior to creating <ComponentRouter/>.",
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

                if (!targetDOMElement) {
                    errors.push(`Cannot locate the specified targetDOMElementID "${targetDOMElementID}" in the DOM?!`);
                    break;
                }

                // Let's build us a specialized instance of React.Component <ComponentRouter/>
                // Think of it like this: <AnyComponent {...this.props} renderData={ ...magic } />
                // Where, the value of magic determines which d2r2 component is used to generate
                // the React.Element synthesized by <AnyComponent/> (aka <ComponentRouter/> by
                // calling React.createElement w/this.props ={ ...this.props, renderData={filtered(magic)}
                // and React.Component constructor function = 1 of the N React.Component constructor functions
                // ... magic. Use it for dynamic layout and decoupling - not game animation kids; that's not what it's for ;-)

                let factoryResponse = d2r2.ComponentRouterFactory.request({ d2r2ComponentSets: [ request_.appModels.display.d2r2Components ] });
                if (factoryResponse.error) {
                    errors.push(`Unable to construct an @encapsule/d2r2 <ComponentRouter/> for use by ${appBuild.app.name} tab service due to error:`);
                    errors.push(factoryResponse.error);
                    break;
                }
                const ComponentRouter = factoryResponse.result;

                const cellModel = new holarchy.CellModel({
                    id: "UX7JquBhSZO0QyEk7u9-sw",
                    name: "d2r2/React Display Adapter",
                    description: "Manages the DOM display via @encapsule/d2r2 and React.",
                    apm: require("./AbstractProcessModel-app-client-display-adapter"),
                    actions: [
                        {
                            // v0.0.49-spectrolite this is interesting. But, this means to the end is suspect. Come back and stare at this later; this should easy all the time for everyone everywhere.
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

                if (!cellModel.isValid()) {
                    errors.push(`Unable to synthesize d2r2/React display adapater CellModel for use in ${appBuild.app.name} tab service due to error:`);
                    errors.push(cellMode.toJSON());
                    break;
                }

                response.result = cellModel;

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

