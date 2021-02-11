(function() {

    const arccore = require("@encapsule/arccore");

    const factoryResponse = arccore.filter.create({
        operationID: "Xe_Bwp4WQ2iw60rNtRGdzw",
        operationName: "ObservableValue::getStatus",
        operationDescription: "Obtains cell memory and process info.",
        inputFilterSpec: {
            ____types: "jsObject",
            act: { ____accept: "jsFunction" },
            ocdi: { ____accept: "jsObject" },
            apmBindingPath: { ____accept: "jsObject" },
            apmID: { ____accept: "jsString" }
        },
        outputFilterSpec: {
            ____types: "jsObject",
            cellMemory: { ____accept: "jsObject" },
            cellProcess: { ____accept: "jsObject" },
        },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                let ocdResponse = request_.ocdi.getNamespaceSpec(request_.apmBindingPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const apmBindingPathSpec = ocdResponse.result;
                if (!apmBindingPathSpec.____appdsl || !apmBindingPathSpec.____appdsl.apm || (apmBindingPathSpec.____appdsl.apm !== request_.apmID)) {
                    errors.push(`Invalid apmBindingPath value specified. Value "${request_.apmBindingPath}" does not resolve to a cell bound to APM ID="${request_.apmID}".`);
                    break;
                }
                let actionResponse = request_.act({
                    actorName: "ObservableValue::getStatus",
                    actorTaskDescription: "Querying the CellProcessor to obtain cell process information.",
                    actionRequest: { CellProcessor: { cell: { cellCoordinates: { apmBindingPath: request_.apmBindingPath }, query: {} } } }
                });
                if (actionResponse.error) {
                    errors.push(actionResponse.error);
                    break;
                }
                const cellProcess = actionResponse.result.actionResult;
                ocdResponse = request_.ocdi.readNamespace(request_.apmBindingPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const cellMemory = ocdResponse.result;
                response.result = { cellMemory, cellProcess };
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

