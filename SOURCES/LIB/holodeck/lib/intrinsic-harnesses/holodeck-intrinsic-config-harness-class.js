
const HolodeckHarness = require("../../HolodeckHarness");

const configHarnessClass = new HolodeckHarness({
    createConfigHarness: {
        id: "bSx3jlWlSqSOBzlsIHvHZg",
        name: "Package",
        description: "Configures program for testing a specific npm/yarn package.",

        configRequestInputSpec: {
            ____types: "jsObject",
            class: {
                ____types: "jsObject",
                className: { ____accept: "jsString" },
                program: { ____opaque: true } // evaluated via RMDR
            }
        },

        configResultOutputSpec: {
            ____types: "jsObject"
        },

        harnessBodyFunction: (harnessRequest_) => {

        }
    }
});

if (!configHarnessClass.isValid()) {
    throw new Error(configHarnessClass.toJSON());
}

module.exports = configHarnessClass;

