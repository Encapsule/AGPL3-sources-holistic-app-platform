
const arccore = require("@encapsule/arccore");

(function() {
    let cachedKernelProcessQuery = null;
    const factoryResponse = arccore.filter.create({
        operationID: "zDB8iqU9SzGPBYGxlWroXg",
        operationName: "HolisticHTML5Service Private Get Status Filter",
        operationDescription: "Retrieves the status and current cell memory for HolisticHTML5Service_Kernel process.",
        inputFilterSpec: {
            ____types: "jsObject",
            act: { ____accept: "jsFunction" },
            ocdi: { ____accept: "jsObject" }
        },
        outputFilterSpec: {
            ____label: "Holistic App Client Kernel Process Stats & Memory",
            ____types: "jsObject",
            cellMemory: { ____accept: "jsObject" },
            kernelProcess: { ____accept: "jsObject" }
        },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                if (!cachedKernelProcessQuery) {
                    // We need to determine the cellProcessPath of the holistic app client kernel process.
                    let actResponse = request_.act({
                        actorName: "Holistic App Client Kernel: Get Status",
                        actorTaskDescription: "Querying the CellProcessor to determine if and where in the cell plane the Holistic App Client Kernel process is activated.",
                        actionRequest: { CellProcessor: { cell: { cellCoordinates: { apmID: "PPL45jw5RDWSMNsB97WIWg" }, query: { } } } }
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
                    kernelProcess: cachedKernelProcessQuery
                };
                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        } // bodyFunciton
    });
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }
    module.exports = factoryResponse.result;
})();

