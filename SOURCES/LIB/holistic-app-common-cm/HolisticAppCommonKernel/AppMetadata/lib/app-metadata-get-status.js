// AppMetadata/lib/app-metadata-get-status.js

const arccore = require("@encapsule/arccore");

(function() {
    let cachedKernelProcessQuery = null;
    const factoryResponse = arccore.filter.create({
        operationID: "oZaCkQNOR7i0cXs5mNHL1g",
        operationName: "appMetadataLib: Get Status",
        operationDescription: "Locates the app metadata cell process and reads and returns its current cell memory.",
        inputFilterSpec: {
            ____types: "jsObject",
            act: { ____accept: "jsFunction" },
            ocdi: { ____accept: "jsObject" }
        },
        outputFilterSpec: {
            ____types: "jsObject",
            cellMemory: { ____accept: "jsObject" },
            appMetadataProcess: { ____accept: "jsObject" }
        },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                if (!cachedKernelProcessQuery) {
                    // We need to determine the cellProcessPath of the holistic app client display adapter process.
                    let actResponse = request_.act({
                        actorName: "Holistic App Metadata: Get Status",
                        actorTaskDescription: "Querying the CellProcessor to determine if and where in the cell plane the Holistic App Metadata process is activated.",
                        actionRequest: { CellProcessor: { cell: { cellCoordinates: { apmID: "srjZAO8JQ2StYj07u_rgGg" }, query: { } } } }
                    });
                    if (actResponse.error) {
                        errors.push(actResponse.error);
                        break;
                    }
                    cachedKernelProcessQuery = actResponse.result.actionResult.query;
                } // if cache miss
                let ocdResponse = request_.ocdi.readNamespace(cachedKernelProcessQuery.apmBindingPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                response.result = {
                    cellMemory: ocdResponse.result,
                    appMetadataProcess: cachedKernelProcessQuery
                };
                break;

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
    }
    module.exports = factoryResponse.result;
})();