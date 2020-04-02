// holodeck-intrinisic-config-harness-package.js

const HolodeckHarness = require("../HolodeckHarness");

const configHarnessPackage = new HolodeckHarness({
    createConfigHarness: {

        id: "rGvH1YMLTxawuZtJwMD_eg",
        name: "Package",
        description: "Configures program for testing a specific npm/yarn package.",

        configCommandSpec: {
            ____types: "jsObject",
            package: {
                ____types: "jsObject",
                packageName: { ____accept: "jsString" },
                programRequest: {
                    ____accept: [ "jsObject", "jsArray", "jsNull" ],
                    ____defaultValue: null // missing sub-programRequest
                }
            }
        },

        configPluginBodyFunction: (harnessRequest_) => {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const message = harnessRequest_.programRequest.config.package;

                harnessRequest_.context.programRequestPath.push(harnessRequest_.programRequest.id);
                harnessRequest_.context.config.packageName = message.packageName;

                response.result = {
                    context: { ...harnessRequest_.context },
                    harnessResult: { test: "This should work fine because this object is declared ____accept." },
                    programRequest: message.programRequest
                }

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

