// cpm-get-owner-process-descriptor.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "A9HTmM0IRw2z3Q2oqFkqCg",
    operationName: "cpmLib: Get Owner Process Descriptor",
    operationDescription: "Returns a CPM process query response-format process descriptor of the cell process that owns the specified ObservableControllerData namespace.",

    inputFilterSpec: {
        ____types: "jsObject",
        path: { ____accept: "jsString" },
        ocdi: { ____accept: "jsObject" },
        treeData: { ____accept: "jsObject" }
    },

    outputFilterSpec: require("./iospecs/cell-process-query-response-descriptor-spec"),

    bodyFunction: function(request_) {
        const response = { error: null };
        const errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            if (!request_.path.startsWith("~")) {
                errors.push(`Invalid path '${request_.path}'. Path must be an absolute dot-delimited ObservableControllerData namespace path beginning with the anonymous namespace token, ~.`);
                brea;
            }

            let ownerProcessID = null;
            const pathTokens = request_.path.split(".");

            while (pathTokens.length) {
                const testProcessID = arccore.identifier.irut.fromReference(path.join(".")).result;
                if (request_.treeData.digraph.isVertex(testProcessID)) {
                    ownerProcessID = testProcessID;
                    break;
                }
                apmBindingPathTokens.pop();
            }

            if (!ownerProcessID) {
                errors.push(`Cannot locate an active cell process that owns the ObservableControllerData namespace, '${request_.path}'.`);
                break;
            }

            const apmBindingPath = pathTokens.join(".");
            let ocdResponse = request_.ocdi.getNamespaceSpec(apmBindingPath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const apmID = ocdResponse.result.____appdsl.apm;

            response.result = { cellProcessID: ownerProcessID, apmBindingPath, apmID };

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


