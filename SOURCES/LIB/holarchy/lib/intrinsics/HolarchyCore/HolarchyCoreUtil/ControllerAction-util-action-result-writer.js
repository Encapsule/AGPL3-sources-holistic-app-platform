
const ControllerAction = require("../../../../ControllerAction");
const ObservableControllerData = require("../../../ObservableControllerData");

const controllerAction = new ControllerAction({
    id: "aXju3wSBQnufe0r51Y04wg",
    name: "Holarchy Core Util: Action Response Writer",
    description: "A low-level utility action that dispatches a subaction returning the response to the caller and writing it also to the indicated OCD response namespace.",

    actionRequestSpec: {
        ____types: "jsObject",
        CellProcessor: {
            ____types: "jsObject",
            util: {
                ____types: "jsObject",
                writeActionResponseToPath: {
                    ____types: "jsObject",
                    actionRequest: { ____accept: "jsObject" },
                    dataPath: { ____accept: "jsString" }
                }
            }
        }
    },

    actionResultSpec: { ____accept: "jsObject" },

    bodyFunction: function(request_) {

        let response = { error: null };
        let errors =  [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const messageBody = request_.actionRequest.CellProcessor.util.writeActionResponseToPath;
            const rpResponse = ObservableControllerData.dataPathResolve({
                dataPath: messageBody.dataPath,
                apmBindingPath: request_.context.apmBindingPath
            });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const writeResponsePath = rpResponse.result; // resolved to absolute OCD path (that may be invalid).

            let ocdResponse = request_.context.ocdi.getNamespaceSpec(writeResponsePath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            // Dispatch the subaction...
            const subactionResponse = request_.context.act({
                actorName: "Write Subaction Response",
                actorTaskDescription: "Dispatching caller-specified subaction in order to write the response to a caller-specified OCD namespace.",
                actionRequest: messageBody.actionRequest,
                apmBindingPath: request_.context.apmBindingPath
            });
            if (subactionResponse.error) {
                errors.push(subactionResponse.error);
            } else {
                response.result = subactionResponse.result.actionResult;
            }

            // Attempt to write the subaction response to the indicated namespace path.
            ocdResponse = request_.context.ocdi.writeNamespace(writeResponsePath, response);
            if (ocdResponse.error) {
                errors.push(`Failed to write subaction response to dataPath '${writeResponsePath}'. Operation failed with error:`);
                errors.push(ocdResponse.error);
                errors.push("See response.result for the actual subaction response that we were not able to write."); // TODO?
                response.result = subactionResponse;
            }
            break;
        } // end while
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }


});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;