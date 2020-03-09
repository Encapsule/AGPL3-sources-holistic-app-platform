// holodeck-intrinsic-config-subsystem-set.js

const HolodeckHarness = require("../../HolodeckHarness");

const configHarnessVectorSet = new HolodeckHarness({
    createConfigHarness: {

        id: "fg0ohNe8Qx-sbc4mcPgcoA",
        name: "Subsystem Config Harness",
        description: "Defines a named application/service subsystem.",

        configRequestInputSpec: {
            ____types: "jsObject",
            subsystem: {
                ____types: "jsObject"
            }
        },

        configResultOutputSpec: {
            ____types: "jsObject"
        },

        harnessBodyFunction: (harnessRequest_) => {

        }
    }
});

//  This is an intrinsic config harness. It has to be valid.
if (!configHarnessVectorSet.isValid()) {
    throw new Error(configHarnessVectorSet.toJSON());
}

module.exports = configHarnessVectorSet;

