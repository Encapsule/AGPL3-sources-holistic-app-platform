// holodeck-intrinsic-config-subsystem-set.js

const HolodeckHarness = require("../HolodeckHarness");

const configHarnessVectorSet = new HolodeckHarness({
    createConfigHarness: {

        id: "fg0ohNe8Qx-sbc4mcPgcoA",
        name: "Subsystem",
        description: "Configures a named application/service subsystem.",

        programRequestSpec: {
            ____types: "jsObject",
            config: {
                ____types: "jsObject",
                subsystem: {
                    ____types: "jsObject",
                    subsystemName: { ____accept: "jsString" },
                    programRequest: {
                        ____accept: [ "jsObject", "jsArray", "jsNull" ],
                        ____defaultValue: null
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
if (!configHarnessVectorSet.isValid()) {
    throw new Error(configHarnessVectorSet.toJSON());
}

module.exports = configHarnessVectorSet;

