
const HolodeckHarness = require("../HolodeckHarness");

const configHarnessMethod = new HolodeckHarness({
    createConfigHarness: {
        id: "6KD9fsk9S-2xaxaVetFEFw",
        name: "Method",
        description: "Configures program for testing a specific class method.",

        programRequestSpec: {
            ____types: "jsObject",
            config: {
                ____types: "jsObject",
                method: {
                    ____types: "jsObject",
                    filterName: { ____accept: "jsString" },
                    programRequest: {
                        ____accept: [ "jsObject", "jsArray", "jsNull" ],
                        ____defaultValue: null // missing sub-programRequest
                    }
                }
            }
        },

        programResultSpec: {
            ____accept: "jsObject"
        },

        harnessBodyFunction: (harnessRequest_) => {
            return { error: "Not implemented." };
        }
    }
});

if (!configHarnessMethod.isValid()) {
    throw new Error(configHarnessMethod.toJSON());
}

module.exports = configHarnessMethod;

