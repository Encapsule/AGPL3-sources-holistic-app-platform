
const HolodeckHarness = require("../../HolodeckHarness");

const configHarnessFilter = new HolodeckHarness({
    createConfigHarness: {
        id: "ytwqXMfeQEu0E9wsObpfDg",

        name: "Filter",
        description: "Configures program for testing a specific arccore.filter instance.",

        programRequestSpec: {
            ____types: "jsObject",
            config: {
                ____types: "jsObject",
                filter: {
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

if (!configHarnessFilter.isValid()) {
    throw new Error(configHarnessFilter.toJSON());
}

module.exports = configHarnessFilter;

