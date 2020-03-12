// holodeck-intrinsic-config-harness-test-set.js

const HolodeckHarness = require("../../HolodeckHarness");

const configHarnessTestSet = new HolodeckHarness({
    createConfigHarness: {

        id: "acKR_j0ARJq2oy0SyoADpg",
        name: "Test Set",
        description: "Configures a set of holodeck test requests.",

        programRequestSpec: {
            ____types: "jsObject",
            testSet: {
                ____types: "jsObject"
            }
        },

        programResultSpec: {
            ____types: "jsObject"
        },

        harnessBodyFunction: (harnessRequest_) => {

        }


    }
});

//  This is an intrinsic config harness. It has to be valid.
if (!configHarnessTestSet.isValid()) {
    throw new Error(configHarnessTestSet.toJSON());
}

module.exports = configHarnessTestSet;

