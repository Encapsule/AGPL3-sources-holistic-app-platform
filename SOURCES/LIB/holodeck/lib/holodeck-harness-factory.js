
const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "4LIYsbDbTJmVWEYgDLJ7Jw",
    operationName: "Holistic Test Harness Factory",
    operationDescription: "A filter that generates a holistic test harness filter.",
    inputFilterSpec: require("./iospecs/holodeck-harness-factory-input-spec"),
    outputFilterSpec: require("./iospecs/holodeck-harness-factory-output-spec"),

    bodyFunction: function(factoryRequest_) {
        const response = { error: null };
        const errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const harnessPluginFilterInputSpec = {
                ____types: "jsObject",
                id: { ____accept: "jsString" },
                name: { ____accept: "jsString" },
                description: { ____accept: "jsString" },
                vectorRequest: factoryRequest_.testVectorRequestInputSpec
            };

            let innerResponse = arccore.filter.create({
                operationID: factoryRequest_.id,
                operationName: factoryRequest_.name,
                operationDescription: factoryRequest_.description,
                inputFilterSpec:  harnessPluginFilterInputSpec,
                outputFilterSpec: factoryRequest_.testVectorResultOutputSpec,
                bodyFunction: factoryRequest_.harnessBodyFunction
            });
            if (innerResponse.error) {
                errors.push(`Error attempting to construct plug-in harness filter [${factoryRequest_.id}::${factoryRequest_.name}]:`);
                errors.push(innerResponse.error);
                break;
            }
            const harnessPluginFilter = innerResponse.result;

            const harnessPluginProxyFilterID = arccore.identifier.irut.fromReference(`${factoryRequest_.id}::runtime filter`).result;
            const harnessPluginProxyName = `Harness Proxy::<${factoryRequest_.id}::${factoryRequest_.name}>`;
            const harnessPluginProxyFilterOutputSpec = {
                ____types: "jsObject",
                ____asMap: true,
                harnessID: {
                    ____types: "jsObject",
                    ____asMap: true,
                    testID: factoryRequest_.testVectorResultOutputSpec
                }
            };

            innerResponse = arccore.filter.create({
                operationID: harnessPluginProxyFilterID,
                operationName: harnessPluginProxyName,
                operationDescription: `Wraps custom harness plug-in [${factoryRequest_.id}::${factoryRequest_.name}] in generic runtime proxy filter wrapper compatible with holodeck runner.`,
                inputFilterSpec: harnessPluginFilterInputSpec,
                outputFilterSpec: harnessPluginProxyFilterOutputSpec,
                bodyFunction: function(testRequest_) {
                    let response = { error: null, result: undefined };
                    let errors = [];
                    let inBreakScope = false;
                    while (!inBreakScope) {
                        inBreakScope = true;
                        let pluginResponse;
                        try {
                            pluginResponse = harnessPluginFilter.request(testRequest_);
                            if (pluginResponse.error) {
                                errors.push(pluginResponse.error);
                                break;
                            }
                        } catch (harnessException_) {
                            errors.push(`Unexpected harness filter exception: ${harnessException_.message} (${harnessException_.stack}).`);
                            break;
                        }
                        response.result = {};
                        response.result[factoryRequest_.id] = {};
                        response.result[factoryRequest_.id][testRequest_.id] = pluginResponse.result;
                        break;
                    }
                    if (errors.length) {
                        errors.unshift(`Error attempting to dispatch plug-in harness filter [${factoryRequest_.id}::${factoryRequest_.name}]:`);
                        response.error = errors.join(" ");
                    }
                    return response;
                }
            });
            if (innerResponse.error) {
                errors.unshift(`Error attempting to construct plug-in harness proxy filter [${harnessPluginProxyFilterID}::${harnessPluginProxyName}]:`);
                errors.push(innerResponse.error);
                break;
            }
            const harnessPluginProxyFilter = innerResponse.result;
            response.result = harnessPluginProxyFilter;
            break;
        }

        if (errors.length) {
            errors.unshift(`Holodeck harness factory failed:`);
            response.error = errors.join(" ");
        }

        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
