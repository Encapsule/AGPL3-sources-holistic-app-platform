// holodeck-intrinisic-config-harness-package.js

const HolodeckHarness = require("../HolodeckHarness");

const configHarnessPackage = new HolodeckHarness({
    createConfigHarness: {

        id: "rGvH1YMLTxawuZtJwMD_eg",
        name: "Package",
        description: "Configures program for testing a specific npm/yarn package.",

        programRequestSpec: {
            ____types: "jsObject",
            config: {
                ____types: "jsObject",
                package: {
                    ____types: "jsObject",
                    packageName: { ____accept: "jsString" },
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
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const message = harnessRequest_.programRequest.config.package;




                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        } // harnessBodyFunction

    } // createConfigHarness

});

if (!configHarnessPackage.isValid()) {
    throw new Error(configHarnessPackage.toJSON());
}

module.exports = configHarnessPackage;

