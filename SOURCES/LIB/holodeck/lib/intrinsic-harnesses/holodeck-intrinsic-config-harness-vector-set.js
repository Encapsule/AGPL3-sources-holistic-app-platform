// holodeck-intrinsic-config-harness-vectory-set.js

const HolodeckHarness = require("../../HolodeckHarness");

const configHarnessVectorSet = new HolodeckHarness({
    createConfigHarness: {

        id: "acKR_j0ARJq2oy0SyoADpg",
        name: "Holodeck Vector Set Harness",
        description: "Defines a named set of holodeck program request(s) as an ordered array.",

        configRequestInputSpec: {
            ____types: "jsObject",
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

