// ObservableValueHelperMap/lib/get-status.js

(function() {

    const arccore = require("@encapsule/arccore");
    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const ovhmAPMID = cmasHolarchyCMPackage.mapLabels({ APM: "ObservableValueHelperMap" }).result.APMID;

    const factoryResponse = arccore.filter.create({
        operationID: "XlxMHlb4RW2G1vlIR-19ow",
        operationName: "ObservableValueHelperMap::getStatus",
        operationDescription: "Perform checks on apmBindingPath and retrieve a copy of the ObservableValueHelperMap cell's memory data.",
        inputFilterSpec: {
            ____types: "jsObject",
            ocdi: { ____accept: "jsObject" },
            apmBindingPath: { ____accept: "jsString" },
            path: { ____accept: "jsString" }
        },
        outputFilterSpec: {
            ____types: "jsObject",
            cellMemory: { ____accept: "jsObject" },
            ovhmBindingPath: { ____accept: "jsString" }
        },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                let ocdResponse = holarchy.ObservableControllerData.dataPathResolve({ apmBindingPath: request_.apmBindingPath, dataPath: request_.path });
                if (ocdResponse.error) {
                    errors.push(`Unable to resolve even basic information about path="${request_.path}" relative to apmBindingPath="${request_.apmBindingPath}" due to error:`);
                    errors.push(ocdResponse.error);
                    break;
                }
                const ovhmBindingPath = ocdResponse.result;

                ocdResponse = request_.ocdi.getNamespaceSpec(ovhmBindingPath);
                if (ocdResponse.error) {
                    errors.push(`Error obtaining filter specification for specified ObservableValueHelperMap cell at OCD path "${ovhmBindingPath}":`);
                    errors.push(ocdResponse.error);
                    break;
                }
                const cellMemorySpec = ocdResponse.result;

                if (!cellMemorySpec.____appdsl || !cellMemorySpec.____appdsl.apm || (cellMemorySpec.____appdsl.apm !== ovhmAPMID)) {
                    errors.push(`Invalid ObservableValueHelperMap cell path "${ovhmBindingPath}" does not resolve to a cell bound to the ObservableValueHelperWorker APM!`);
                    break;
                }

                ocdResponse = request_.ocdi.readNamespace(ovhmBindingPath);
                if (ocdResponse.error) {
                    errors.push(`Error reading ObservableValueHelperMap cell memory at "${ovhmBindingPath}":`);
                    errors.push(ocdResponse.error);
                }

                const cellMemory = ocdResponse.result;

                response.result = { cellMemory, ovhmBindingPath };

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

