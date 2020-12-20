const holarchy = require("@encapsule/holarchy");
const { ControllerAction } = holarchy;

module.exports = new ControllerAction({

    id: "UK08qja3QiaHFGhl99fbmg",
    name: "ViewThemeProcessor::Write Settings",
    description: "Update the whole or part of the ViewThemeProcessor model's input theme settings document.",

    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            view: {
                ____types: "jsObject",
                theme: {
                    ____types: "jsObject",
                    write: {
                        ____types: "jsObject",
                        path: {
                            ____label: "Settings Path",
                            ____description: "An optional filter-style dot-delimited path into the themeSettings inputs document.",
                            ____accept: "jsString",
                            ____defaultValue: "~" // i.e. data is the entire settings document
                        },
                        data: {
                            ____label: "Settings Data",
                            ____description: "Settings data to write. Either the entire settings document (iff path is ~), or the subtree indicated by path.",
                            ____opaque: true
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____label: "Normalized Theme Settings",
        ____description: "A reference to a normalized copy of the current theme settings input data.",
        ____accept: "jsObject"
    },

    bodyFunction: function(request_) {

        const response = {
            error: null,
            result: {}
        };

        const errors = [];
        let inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            const message = request_.actionRequest.holistic.view.theme.write;

            // We resolve the fully-qualified path of #.inputs.version manually because we re-use the resolved address to read then write the same namespace.
            let rpResponse = holarchy.ObservableControllerData.dataPathResolve({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.inputs.version" });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const settingsVersionPath = rpResponse.result;

            // Read the current theme settings version number.
            let ocdResponse = request_.context.ocdi.readNamespace(settingsVersionPath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            let settingsVersion = ocdResponse.result;

            // Write the new theme settings data.
            ocdResponse = request_.context.ocdi.writeNamespace(
                {
                    apmBindingPath: request_.context.apmBindingPath,
                    dataPath:  [ "#", "inputs", "themeSettings", ...message.path.split(".").slice(1) ].join(".")
                },
                message.data
            );
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            response.result = ocdResponse.result; // normalized copy of the theme settings

            // Increment the theme settings version.
            ocdResponse = request_.context.ocdi.writeNamespace(settingsVersionPath, settingsVersion + 1);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
        }

        if (errors.length) {
            response.error = errors.join(" ");
        }

        return response;
    }
});
