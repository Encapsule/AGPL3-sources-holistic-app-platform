// holodeck-intrinsic-config-harness-test-set.js

const HolodeckHarness = require("../HolodeckHarness");

const configHarnessTestSet = new HolodeckHarness({

    createConfigHarness: {

        id: "acKR_j0ARJq2oy0SyoADpg",
        name: "Test Set",
        description: "Define a set of related programRequests (typically test harness request(s)).",

        programRequestSpec: {
            ____types: "jsObject",
            config: {
                ____types: "jsObject",
                testSet: {
                    ____types: "jsObject",
                    testSetName: { ____accept: "jsString" },
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

//  This is an intrinsic config harness. It has to be valid.
if (!configHarnessTestSet.isValid()) {
    throw new Error(configHarnessTestSet.toJSON());
}

module.exports = configHarnessTestSet;

