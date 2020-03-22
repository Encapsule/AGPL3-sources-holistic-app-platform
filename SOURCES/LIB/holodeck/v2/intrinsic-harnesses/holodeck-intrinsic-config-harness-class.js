
const HolodeckHarness = require("../HolodeckHarness");

const configHarnessClass = new HolodeckHarness({
    createConfigHarness: {
        id: "bSx3jlWlSqSOBzlsIHvHZg",
        name: "Class",
        description: "Configures program for testing a specific class.",

        programRequestSpec: {
            ____types: "jsObject",
            config: {
                ____types: "jsObject",
                class: {
                    ____types: "jsObject",
                    className: { ____accept: "jsString" },
                    programRequest: {
                        ____accept: [ "jsObject", "jsArray", "jsNull" ],
                        ____defaultValue: null // missing sub-programRequest
                    }
                }
            }
        },

        programResultSpec: {
            ____accept: "jsObject" // TODO: review this for all harness instances in the intrinsic set
        },

        harnessBodyFunction: (harnessRequest_) => {
            return { error: "Not implemented." };
        }
    }
});

if (!configHarnessClass.isValid()) {
    throw new Error(configHarnessClass.toJSON());
}

module.exports = configHarnessClass;

