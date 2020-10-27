// ControllerAction-app-client-kernel-deserialize-bootROM.js

const holarchy = require("@encapsule/holarchy");

const controllerAction = new holarchy.ControllerAction({
    id: "LLpxS5ZZTuubLhSSgWhQLw",
    name: "Holistic App Client Kernel: Deserialize Boot ROM",
    description: "Performs deserialization of the \"bootROM\" which is a base64-encoded JSON document written by the holistic app server process into the body of the syntheiszed HTML5 document.",

    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                client: {
                    ____types: "jsObject",
                    kernel: {
                        ____types: "jsObject",
                        private: {
                            ____types: "jsObject",
                            deserializeBootROM: {
                                ____types: "jsObject",
                                bootROMElementID: {
                                    ____accept: "jsString",
                                    ____defaultValue: "idClientBootROM"
                                }

                            }
                        }
                    }
                }
            }
        }
    },
    actionResultSpec: {
        // TODO:
        ____accept: "jsObject" // The deserialized contents of the boot ROM written by the holistic app server process.
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log(`[${this.operationID}::${this.operationName}]`);
            const messageBody = request_.actionRequest.holistic.app.client.kernel.private.deserializeBootROM;
            let ocdResponse = request_.context.ocdi.getNamespaceSpec(request_.context.apmBindingPath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            let namespaceSpec = ocdResponse.result;
            if (!namespaceSpec.____appdsl || !namespaceSpec.____appdsl.apm || namespaceSpec.____appdsl.apm !== "PPL45jw5RDWSMNsB97WIWg") {
                errors("Unexpected request on private holistic app client kernel ControllerAction.");
                break;
            }
            const bootROMElement = document.getElementById(messageBody.bootROMElementID);
            const bootDataBase64 = bootROMElement.textContent;
            const bootDataJSON = new Buffer(bootDataBase64, 'base64').toString('utf8');
            const bootROMData = JSON.parse(bootDataJSON);
            bootROMElement.parentNode.removeChild(bootROMElement); // delete the DOM node

            ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.private.bootROMData" }, bootROMData);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            response.result = bootROMData;
            console.log(bootROMData);
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
