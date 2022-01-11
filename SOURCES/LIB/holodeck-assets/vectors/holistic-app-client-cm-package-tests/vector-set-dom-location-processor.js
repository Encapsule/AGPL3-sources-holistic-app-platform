// vector-set-dom-location-processor.js

const clientCM = require("@encapsule/holistic-app-client-cm");

let response = clientCM.cml.getArtifact({ id: "qzMWhMstQ4Ki06O75y5hMA", type: "CM" });
if (response.error) {
    throw new Error(response.error);
}

const HolisticAppClientDOMLocationProcessor = response.result;



module.exports = [

    {
        id: "y3Jy2d56QI63admJOy1tZw",
        name: "DOM Location Processor APM #1",
        description: "Attempt to instantiate the current DOM Location Processor APM via our test harness.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    CellModel: {
                        constructorRequest:HolisticAppClientDOMLocationProcessor
                    }
                }
            }
        }
    }

];
