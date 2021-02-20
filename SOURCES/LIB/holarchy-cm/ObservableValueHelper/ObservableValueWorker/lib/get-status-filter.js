// ObservableValueHelper/ObservableValueWorker/lib/get-status-filter.js

(function() {

    const arccore = require("@encapsule/arccore");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const cmLabel = require("../cell-label");
    const filterLabel = `${cmLabel}::getStatus`;
    const apmID = cmasHolarchyCMPackage.mapLabels({ APM: cmLabel }).result.APMID;
    const filterID = cmasHolarchyCMPackage.mapLabels({ OTHER: filterLabel }).result.OTHERID;

    const factoryResponse = arccore.filter.create({
        operationID: filterID,
        operationName: filterLabel,
        operationDescription: `Verifies that the caller is asking about an ${cmLabel} cell and returns its cell memory data.`,
        inputFilterSpec: {
            ____types: "jsObject",
            act: { ____accept: "jsFunction" },
            ocdi: { ____accept: "jsObject" },
            apmBindingPath: { ____accept: "jsString" }
        },
        outputFilterSpec: {
            ____types: "jsObject",
            cellMemory: { ____accept: "jsObject" }
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

                if (!apmBindingPathSpec.____appdsl || !apmBindingPathSpec.____appdsl.apm || (apmBindingPathSpec.____appdsl.apm !== apmID)) {
                    errors.push(`Invalid apmBindingPath="${request_.apmBindingPath}" does not resolve to an ${cmLabel} cell!`);
                    break;
                }

                ocdResponse = request_.ocdi.readNamespace(request_.apmBindingPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                response.result = { cellMemory: ocdResponse.result };

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            console.log(response);
            return response;
        }
    });
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result;

})();

