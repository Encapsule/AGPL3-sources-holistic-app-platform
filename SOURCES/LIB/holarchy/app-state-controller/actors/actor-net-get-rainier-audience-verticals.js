// sources/client/app-state-controller/actors/state-net-get-rainier-audience-verticals.js

const HttpGetRainierDataGateway = require("../../communication/http-get-rainier-data-gateway");

module.exports = {

    id: "VgBv-skxTFWtqq16fHImCA",
    name: "Network Get Rainier Audience Verticals",
    description: "Initiates a data gateway request to the Rainier backend to get the set of supported audience verticals.",

    namespaces: {
        read: [
        ],
        write: [
            {
                filterBinding:  { alias: "netRequest", id: "lIF8ndN9SaCGJFwbVq8XvQ" },
                storePath: "~.base.RainierBaseController.network.GET_RainierAudienceVerticals.request"
            },
            {
                filterBinding: { alias: "netResponse", id: "4-WKK1P6RmGUDPONyXThzg" },
                storePath: "~.base.RainierBaseController.network.GET_RainierAudienceVerticals.response"
            }
        ]
    }, // namespaces

    commandSpec: {
        ____types: "jsObject",
        networkGetRainierAudienceVerticals: {
            ____accept: "jsObject"
        }
    }, // commandSpec

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            var gatewayMessage = { GET: { backend: { rainier: { audienceVerticals: request_.command } } } };

            var innerResponse = request_.namespaces.write.netRequest.request({
                appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                writeData: gatewayMessage
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            innerResponse = HttpGetRainierDataGateway.request({
                request: gatewayMessage,
                resultHandler: function(result_) {
                    console.log("Got a response!");

                    var writerResponse = request_.namespaces.write.netResponse.request({
                        appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                        writeData: {
                            error: null,
                            result: result_
                        }
                    });

                    if (writerResponse.error) {
                        return { error: writerResponse.error };
                    }

                    request_.runtimeContext.appStateContext.appStateController.controllerRunFilter(); // Force App State Controller re-evaluation (TODO: FIX THE NAME)

                    return { error: null, result: undefined };
                },
                errorHandler: function(error_) {
                    console.log("Got an error!");

                    var writerResponse = request_.namespaces.write.netResponse.request({
                        appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                        writeData: {
                            error: error_,
                            result: null
                        }
                    });

                    if (writerResponse.error) {
                        return { error: writerResponse.error };
                    }

                    request_.runtimeContext.appStateContext.appStateController.controllerRunFilter(); // Force App State Controller re-evaluation (TODO: FIX THE NAME)

                    return { error: null, result: undefined };
                }
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    } // bodyFunction
};

