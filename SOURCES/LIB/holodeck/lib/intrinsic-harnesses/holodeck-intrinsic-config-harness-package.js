// holodeck-intrinisic-config-harness-package.js


const HolodeckHarness = require("../../HolodeckHarness");

const configHarnessPackage = new HolodeckHarness({
    createConfigHarness: {
        id: "rGvH1YMLTxawuZtJwMD_eg",
        name: "Package",
        description: "Configures program for testing a specific npm/yarn package.",

        configRequestInputSpec: {
            ____types: "jsObject",
            package: {
                ____types: "jsObject",
                packageName: { ____accept: "jsString" },
                program: { ____opaque: true } // evaluated via RMDR
            }
        },

        configResultOutputSpec: {
            ____types: "jsObject"
        },

        harnessBodyFunction: (harnessRequest_) => {

        }
    }
});

if (!configHarnessPackage.isValid()) {
    throw new Error(configHarnessPackage.toJSON());
}

module.exports = configHarnessPackage;

