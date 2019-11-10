
const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "4LIYsbDbTJmVWEYgDLJ7Jw",
    operationName: "Holistic Test Harness Factory",
    operationDescription: "A filter that generates a holistic test harness filter.",
    inputFilterSpec: {
        ____types: "jsObject",
        id: { ____accept: "jsString" }, // the ID of the harness - not a test vector sent through the harness
        name: { ____accept: "jsString" }, // the name of the harness
        description: { ____accept: "jsString" }, // the description of the harness
        harnessRequestInputSpec: { ____accept: "jsObject" }, // request signature of generated harness filter
        harnessBodyFunction: { ____accept: "jsFunction" }, // the generated harness filter's bodyFunction
        harnessResultOutputSpec: { ____accept: "jsObject" } // spec constrains a portion of the harness output
    },
    bodyFunction: function(request_) {
        const response = { error: null };
        const errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const harnessRuntimeInputSpec = {
                ____types: "jsObject",
                id: { ____accept: "jsString" },
                name: { ____accept: "jsString" },
                description: { ____accept: "jsString" },
                // expectedOutcome: { ____accept: "jsString", ____inValueSet: [ "pass", "fail" ] },
                harnessRequest: request_.harnessRequestInputSpec
            };

            const harnessRuntimeOutputSpec = {
                ... harnessRuntimeInputSpec,
                harnessResponse: {
                    ____types: "jsObject",
                    error: { ____accept: [ "jsNull", "jsString" ] },
                    result: request_.harnessResultOutputSpec // your harness output filter spec must be optional descriptor object
                }
            };

            const innerResponse = arccore.filter.create({
                operationID: request_.id,
                operationName: request_.name,
                operationDescription: request_.description,
                inputFilterSpec:  harnessRuntimeInputSpec,
                outputFilterSpec: harnessRuntimeOutputSpec,
                bodyFunction: request_.harnessBodyFunction

            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            response.result = innerResponse.result;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    },
    outputFilterSpec: { ____accept: "jsObject" } // filter instance


});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
