
const arccore = require("@encapsule/arccore");

const harnessFactoryInputSpec = require("./iospecs/holodeck-harness-factory-input-spec");
const harnessFactoryOutputSpec = require("./iospecs/holodeck-harness-factory-output-spec");

const factoryResponse = arccore.filter.create({
    operationID: "4LIYsbDbTJmVWEYgDLJ7Jw",
    operationName: "Holodeck Harness Factory",
    operationDescription: "A filter that generates a holdeck harness plug-in filter.",
    inputFilterSpec: harnessFactoryInputSpec,
    outputFilterSpec: harnessFactoryOutputSpec,

    bodyFunction: function(factoryRequest_) {
        const response = { error: null };
        const errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // This is the input filter spec for the inner plug-in filter - the harness that wraps
            // the developer's provided harness bodyFunction inside of a standardized filter that
            // is called by an outer proxy filter. The proxy handles the upstream interface details
            // of parsing incoming runner requests and dispatching them to the plug-in harness filter.
            // And, then boxing up the response received from the inner plug-in and returning it
            // back to the runner. This allows the developer-defined harness bodyFunction to be very
            // simple.

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

            const harnessPluginProxyName = `Harness Proxy::<${factoryRequest_.id}::${factoryRequest_.name}>`;
            const harnessPluginProxyFilterID = arccore.identifier.irut.fromReference(harnessPluginProxyName).result;
            const harnessPluginProxyFilterOutputSpec = {
                ____label: "Harness Proxy Result",
                ____description: "A descriptor object derived from the inner plug-in harness filter's response + options and analysis.",
                ____types: "jsObject",
                harnessOptions: harnessFactoryInputSpec.harnessOptions,
                harnessDispatch: {
                    ____types: "jsObject",
                    ____asMap: true,
                    harnessID: {
                        ____types: "jsObject",
                        ____asMap: true,
                        testID: factoryRequest_.testVectorResultOutputSpec
                    }
                }
            };

            innerResponse = arccore.filter.create({
                operationID: harnessPluginProxyFilterID,
                operationName: harnessPluginProxyName,
                operationDescription:
                `Wraps custom harness plug-in [${factoryRequest_.id}::${factoryRequest_.name}] in generic runtime proxy filter wrapper compatible with holodeck runner.`,
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
                            errors.push(`Unexpected harness filter exception: '${harnessException_.message}'.`);
                            console.error(harnessException_.stack);
                            break;
                        }
                        response.result = {
                            harnessOptions: { ...factoryRequest_.harnessOptions },
                            harnessDispatch: {}
                        };
                        response.result.harnessDispatch[factoryRequest_.id] = {};
                        response.result.harnessDispatch[factoryRequest_.id][testRequest_.id] = pluginResponse.result;
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
