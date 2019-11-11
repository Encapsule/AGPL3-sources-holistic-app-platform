
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
    bodyFunction: function(factoryRequest_) {
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
                harnessRequest: factoryRequest_.harnessRequestInputSpec
            };

            let innerResponse = arccore.filter.create({
                operationID: factoryRequest_.id,
                operationName: factoryRequest_.name,
                operationDescription: factoryRequest_.description,
                inputFilterSpec:  harnessRuntimeInputSpec,
                outputFilterSpec: factoryRequest_.harnessResultOutputSpec,
                bodyFunction: factoryRequest_.harnessBodyFunction
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            const harnessPluginFilter = innerResponse.result;

            const runtimeHarnessFilterID = arccore.identifier.irut.fromReference(`${factoryRequest_.id}::runtime filter`).result;

            const harnessRuntimeOutputSpec = {
                ____types: "jsObject",
                ____asMap: true,
                harnessID: {
                    ____types: "jsObject",
                    ____asMap: true,
                    testID: factoryRequest_.harnessResultOutputSpec
                }
            };

            innerResponse = arccore.filter.create({
                operationID: runtimeHarnessFilterID,
                operationName: `[${factoryRequest_.id}::${factoryRequest_.name}] Runtime Host`,
                operationDescription: "Wraps custom harness plug-in [${factoryRequest_.id}::${factoryRequest_.name} in generic runtime filter wrapper compatible with holodeck runner.",
                inputFilterSpec: harnessRuntimeInputSpec,
                outputFilterSpec: harnessRuntimeOutputSpec,
                bodyFunction: function(testRequest_) {
                    let response = { error: null, result: undefined };
                    let errors = [];
                    let inBreakScope = false;
                    while (!inBreakScope) {
                        inBreakScope = true;

                        const pluginResponse = harnessPluginFilter.request(testRequest_);
                        if (pluginResponse.error) {
                            errors.push(pluginResponse.error);
                            break;
                        }
                        response.result = {};
                        response.result[factoryRequest_.id] = {};
                        response.result[factoryRequest_.id][testRequest_.id] = pluginResponse.result;
                        break;
                    }
                    if (errors.length) {
                        response.error = errors.join(" ");
                    }
                    return response;
                }
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            const harnessRuntimeFilter = innerResponse.result;
            response.result = harnessRuntimeFilter;
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
