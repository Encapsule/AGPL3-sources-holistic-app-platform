// vector-set-app-client-runtime.js

const clientSML = require("@encapsule/holistic-app-client-sml");
let response = clientSML.cml.getArtifact({ id: "ENENGxq1TkCa6Sk9YXaLlw", type: "CM" });
if (response.error) {
    throw new Error(response.error);
}
const HolisticAppClientRuntime = response.result;

module.exports = [

    {
        id: "sThxzN9-QuKCgErSNYhcQQ",
        name: "Holistic App Client Runtime CellModel Test",
        description: "Instantiate the Holistic App Client Runtime CellModel through the CellModel test harness.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    CellModel: {
                        constructorRequest: HolisticAppClientRuntime
                    }
                }
            }
        }
    },


];
