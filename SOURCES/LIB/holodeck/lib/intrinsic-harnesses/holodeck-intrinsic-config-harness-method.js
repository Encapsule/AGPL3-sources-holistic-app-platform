

const HolodeckHarness = require("../../HolodeckHarness");

const configHarnessMethod = new HolodeckHarness({
    createConfigHarness: {
        id: "6KD9fsk9S-2xaxaVetFEFw",
        name: "Method",
        description: "Configures program for testing a specific class method.",

        programRequestSpec: {
            ____types: "jsObject",
            method: {
                ____types: "jsObject",
                filterName: { ____accept: "jsString" },
                program: { ____opaque: true } // evaluated via RMDR
            }
        },

        programResultSpec: {
            ____types: "jsObject"
        },

        harnessBodyFunction: (harnessRequest_) => {

        }
    }
});

if (!configHarnessMethod.isValid()) {
    throw new Error(configHarnessMethod.toJSON());
}

module.exports = configHarnessMethod;

