
const arccore = require("@encapsule/arccore");
const holodeck = require("@encapsule/holodeck");
const holarchy = require("@encapsule/holarchy");

const factoryResponse = holodeck.harnessFactory.request({
    id: "FAvFLw0XQN6yomNs13r21g",
    name: "CellModel Harness",
    description: "Constructs an instance of ES6 class CellModel and serializes it for inspection. There's a lot more we plan to do with this later.",
    harnessOptions: { idempotent: true },
    testVectorRequestInputSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                CellModel: {
                    ____types: "jsObject",
                    constructorRequest: {
                        // Either a CellModel constructor request object or pre-constructed CellModel class instance reference.
                        ____opaque: true // accept any request and let SCM sort it out
                    }
                }
            }
        }
    },
    testVectorResultOutputSpec: {
        ____types: "jsObject",
        isValid: { ____accept: "jsBoolean" },
        summary: {
            ____accept: [
                "jsString", // invalid instance constructor error
                "jsObject" // valid instance data
            ]
        },
        toJSON: {
            ____accept: [
                "jsString", // invalid instance constructor error
                "jsObject",  // valid instance data
            ]
        },
        opcConfig: {
            ____accept: [ "jsString", "jsObject" ]
        }
    },
    harnessBodyFunction: (vectorRequest_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const messageBody = vectorRequest_.vectorRequest.holistic.holarchy.CellModel;
            const cell = (messageBody.constructorRequest instanceof holarchy.CellModel)?messageBody.constructorRequest:new holarchy.CellModel(messageBody.constructorRequest);

            let summary = cell.isValid()?{}:cell.toJSON();

            if (cell.isValid()) {

                summary.counts = {
                    vertices:cell._private.digraph.verticesCount(),
                    edges: cell._private.digraph.edgesCount(),
                    artifacts: {
                        cm: cell._private.digraph.outDegree("INDEX_CM"),
                        apm: cell._private.digraph.outDegree("INDEX_APM"),
                        top: cell._private.digraph.outDegree("INDEX_TOP"),
                        act: cell._private.digraph.outDegree("INDEX_ACT")
                    }
                };

            } // if cell.isValid()

            response.result = {
                isValid: cell.isValid(),
                summary,
                toJSON: cell.toJSON(),
                opcConfig: cell.getConfigOPC()
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
}

module.exports = factoryResponse.result;
