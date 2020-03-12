// holodeck-intrinsic-config-harness-program.js

const HolodeckHarness = require("../../HolodeckHarness");

const configHarnessProgram = new HolodeckHarness({
    createConfigHarness: {
        id: "FDCaCMlJSLaBGeOlcbODIw",
        name: "Holodeck Program Logger",
        description: "Configures logging options for a holodeck program.",

        programRequestSpec: {
            ____types: "jsObject",
            programLogger: {
                ____types: "jsObject",
                options: {
                    ____types: "jsObject", // TODO: extend definition as required
                    ____defaultValue: {}
                },
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

if (!configHarnessProgram.isValid()) {
    throw new Error(configHarnessProgram.toJSON());
}

module.exports = configHarnessProgram;

