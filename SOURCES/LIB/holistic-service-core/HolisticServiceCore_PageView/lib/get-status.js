// SOURCES/COMMON/vp5/models/view/ViewpathPageView/lib/ViewpathPageViewLib-get-status.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "UTfw0VK1TQa3wvxsx52WPQ",
    operationName: "ViewpathPageViewLib Get Status",
    operationDescription: "Retrieves cell process information and a copy of the activation's cell memory.",
    inputFilterSpec: {
        ____types: "jsObject",
        context: { ____accept: "jsObject" } // action bodyFunction request.context reference
    },
    outputFilterSpec: {
        ____types: "jsObject",
        cellMemory: { ____accept: "jsObject" },
        activationProcess: { ____accept: "jsObject" }
    },
    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // Query OCD for the filter spec associated with request.context.apmBindingPath.
            // If it checks out, then this is where we're activated. Otherwise, it's an error.
            let ocdResponse = request_.context.ocdi.getNamespaceSpec(request_.context.apmBindingPath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const bindingSpec = ocdResponse.result;
            if (!bindingSpec.____appdsl || !bindingSpec.____appdsl.apm || !(bindingSpec.____appdsl.apm === "t2enVksXSqmytntLA5KVzA")) {
                errors.push("No ViewpathPageView process activation status available.");
                errors.push(`The data at apmBindingPath="${request_.context.apmBindingPath}" does not resolve to an active ViewpathPageView cell!`);
                break;
            }
            // Checks out.

            // TODO: Use local-module cache to speed this up. It's an optimization only. Don't worry about it now.

            // Get information about this process activation from cell process manager.

            const actorName = `[${this.operationID}::${this.operationName}]`;

            let actResponse = request_.context.act({
                actorName,
                actorTaskDescription: "Querying cell process manager for this activation's status.",
                actionRequest: { CellProcessor: { cell: { query: {}, cellCoordinates: request_.context.apmBindingPath } } }
            });
            if (actResponse.error) {
                errors.push(actResponse.error);
                break;
            }
            const activationProcess = actResponse.result.actionResult;

            // Read the activation's memory.
            ocdResponse = request_.context.ocdi.readNamespace(request_.context.apmBindingPath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            const cellMemory = ocdResponse.result;

            response.result = {
                cellMemory,
                activationProcess
            };


            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
};

module.exports = factoryResponse.result;
