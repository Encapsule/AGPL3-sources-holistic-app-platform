


(function() {

    const arccore = require("@encapsule/arccore");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");

    const apmID = cmasHolarchyCMPackage.mapLabels({ APM: "ObservableValueHelper" }).result.APMID;

    const factoryResponse = arccore.filter.create({
        operationID: "eKkJzE6USxqKPCmR3xmDdQ",
        operationName: "ObservableValueHelper Get Status",
        operationDescription: "Retrieves cell memory and process info for the ObservableValueHelper cell.",
        inputFilterSpec: {
            ____types: "jsObject",
            ocdi: { ____accept: "jsObject" },
            act: { ____accept: "jsFunction" },
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
                    errors.push(`Invalid apmBindingPath="${request_.apmBindingPath}" does not resolve to a ValueObserver cell!`);
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
