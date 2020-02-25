// vector-set-d2r2-react-processor.js

const holarchy = require("@encapsule/holarchy");
const clientSML = require("@encapsule/holistic-app-client-sml");

if (!clientSML.cml.isValid()) {
    throw new Error(clientSML.cml.toJSON());
}

let response = clientSML.cml.getArtifact({ id: "UX7JquBhSZO0QyEk7u9-sw", type: "CM" });
if (response.error) {
    throw new Error(response.error);
}

const HolisticAppClientDisplayAdapter = response.result;

module.exports = [

    {
        id: "fzuITg9BQbyV7jNv39Gv6w",
        name: "d2r2/React Client Output Processor OPC #1",
        description: "Attempt to apply the d2r2/React Client Display Adaptor APM inside of an OPC instance.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessController: {
                        constructorRequest: {
                            id: "fzuITg9BQbyV7jNv39Gv6w",
                            name: "d2r2/React Client Display Adaptor OPC #1",
                            description: "Attempt to apply the d2r2/React Client Display Adaptor APM inside of an OPC instance.",

                            ocdTemplateSpec: {
                                ____types: "jsObject",
                                d2r2ReactClientOutputProcessor: {
                                    ____types: "jsObject",
                                    ____appdsl: { apm: "IxoJ83u0TXmG7PLUYBvsyg" }
                                }
                            },
                            abstractProcessModelSets: [
                                HolisticAppClientDisplayAdapter.getCMConfig({ type: "APM" })
                            ],
                            transitionOperatorSets: [
                                HolisticAppClientDisplayAdapter.getCMConfig({ type: "TOP" })
                            ],
                            controllerActionSets: [
                                HolisticAppClientDisplayAdapter.getCMConfig({ type: "ACT" })
                            ]
                        }
                    },
                    actionRequest: []
                }
            }
        }
    }




];
