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
        cpmDataDescriptor: { ____accept: "jsObject" }
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
                break;
            }
            let owner = { cellProcessID: null, apmBindingPath: null, apmID: null };
            const pathTokens = request_.path.split(".");
            const ownedCellProcesses = request_.cpmDataDescriptor.data.ownedCellProcesses;
            while (pathTokens.length) {
                const currentPath = pathTokens.join(".");
                const testProcessID = arccore.identifier.irut.fromReference(pathTokens.join(".")).result;
                if (ownedCellProcesses.digraph.isVertex(testProcessID)) {
                    const vertexProp = ownedCellProcesses.digraph.getVertexProperty(testProcessID);
                    // TODO: Why isn't the apmID on the vertex prop? laziness...
                    owner.cellProcessID = testProcessID;
                    owner.apmBindingPath = (currentPath !== "~")?vertexProp.apmBindingPath:request_.cpmDataDescriptor.path;
                    const ocdResponse = request_.ocdi.getNamespaceSpec(owner.apmBindingPath);
                    if (ocdResponse.error) {
                        errors.push(ocdResponse.error);
                        break;
                    }
                    owner.apmID = ocdResponse.result.____appdsl.apm;
                    break;
                }
                apmBindingPathTokens.pop();
            }
            if (errors.length) {
                break;
            }
            response.result = owner;
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


