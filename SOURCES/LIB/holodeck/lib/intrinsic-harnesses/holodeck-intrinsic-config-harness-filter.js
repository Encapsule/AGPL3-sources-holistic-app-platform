
const HolodeckHarness = require("../../HolodeckHarness");

const configHarnessFilter = new HolodeckHarness({
    createConfigHarness: {
        id: "ytwqXMfeQEu0E9wsObpfDg",

        name: "Package",
        description: "Configures program for testing a specific npm/yarn package.",

        programRequestSpec: {
            ____types: "jsObject",
            filter: {
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

if (!configHarnessFilter.isValid()) {
    throw new Error(configHarnessFilter.toJSON());
}

module.exports = configHarnessFilter;

