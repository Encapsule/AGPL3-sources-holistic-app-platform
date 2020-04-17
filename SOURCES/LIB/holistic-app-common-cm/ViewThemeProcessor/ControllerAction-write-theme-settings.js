const holarchy = require("@encapsule/holarchy");
const { ControllerAction } = holarchy;

const themeConfigSpec = JSON.parse(JSON.stringify(require("./iospecs/ThemeProcessor-ocd-input-spec")));

// Delete default values. If one of these is updated, then all the namespace keys needs to be supplied in the request or defaults
// will get applied for any namespaces not provided. This is needed so we can update specific sections of the style tree separately.
delete themeConfigSpec.____defaultValue;
for(let key in themeConfigSpec) {
    if(themeConfigSpec[key].hasOwnProperty("____defaultValue")) {
        if(themeConfigSpec[key].____types) {
            if(themeConfigSpec[key].____types instanceof Array ) {
                themeConfigSpec[key].____types.push("jsUndefined");
            }
            const type = themeConfigSpec[key].____types + "";
            themeConfigSpec[key].____types = [ type, "jsUndefined" ];
        } else {
            if(themeConfigSpec[key].____accept instanceof Array ) {
                themeConfigSpec[key].____accept.push("jsUndefined");
            }
            const type = themeConfigSpec[key].____accept + "";
            themeConfigSpec[key].____accept = [ type, "jsUndefined" ];
        }
        delete themeConfigSpec[key].____defaultValue;
    }
}

module.exports = new ControllerAction({

    id: "UK08qja3QiaHFGhl99fbmg",
    name: "Configure Theme Processor",
    description: "Writes theme configuration data to Theme Processor input namespace.",

    actionRequestSpec: {
        ____types: "jsObject",
        vp5: {
            ____types: "jsObject",
            view: {
                ____types: "jsObject",
                styles: {
                    ____types: "jsObject",
                    themeProcessor: {
                        ____types: "jsObject",
                        config: themeConfigSpec
                    }
                }
            }
        }
    },

    actionResultSpec: {
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

            const themeData = request_.actionRequest.vp5.view.styles.themeProcessor.config;

            const rpResponse = holarchy.ObservableControllerData.dataPathResolve({
                apmBindingPath: request_.context.apmBindingPath,
                dataPath: "#.inputs"
            });

            let ocdResponse = request_.context.ocdi.readNamespace(rpResponse.result);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
            }

            const themeInputs = JSON.parse(JSON.stringify(ocdResponse.result.themeInputs));
            for (let key in themeData) {
                themeInputs[key] = themeData[key];
            }

            const inputData = {
                revision: ocdResponse.result.revision + 1,
                themeInputs
            };

            ocdResponse = request_.context.ocdi.writeNamespace(rpResponse.result, inputData);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
            }

            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
        }

        if (errors.length) {
            response.error = errors.join(" ");
        }

        return response;
    }
});