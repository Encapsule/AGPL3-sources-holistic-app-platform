// ControllerAction-ocd-read-namespace-indirect.js

const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.ControllerAction({
    id: "Ve_kEFkGSMSgOqUWu9Yo_w",
    name: "OCD Read Namespace Indirect",
    description: "Reads and returns the value of OCD namespace via path indirection.",
    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            sml: {
                ____types: "jsObject",
                actions: {
                    ____types: "jsObject",
                    ocd: {
                        ____types: "jsObject",
                        readNamespaceIndirect: {
                            ____types: "jsObject",
                            path2: {
                                ____label: "Target Path Namespace Path",
                                ____description: "The OCD path of the string namespace containing the OCD path of the target namespace to read.",
                                ____accept: "jsString"
                            }
                        }
                    }
                }
            }
        }
    },
    actionResultSpec: {
        ____opaque: true // response.result is whatever is stored in the target OCD namespace
    },
    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const message = request_.actionRequest.holarchy.sml.actions.ocd.readNamespaceIndirect;
            let rpResponse = holarchy.ObservableControllerData.dataPathResolve({
                opmBindingPath: request_.context.opmBindingPath,
                dataPath: message.path2
            });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const targetPath2 = rpResponse.result;
            rpResponse = holarchy.ObservableControllerData.dataPathResolve({
                opmBindingPath: request_.context.opmBindingPath,
                dataPath: targetPath2
            });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const targetPath = rpResponse.result;
            const ocdResponse = request_.context.ocdi.readNamespace(targetPath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            response.result = ocdResponse.result;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});
