// sources/client/app-state-controller/actors/actor-net-get-rainier-geographic-categories.js

const HttpGetRainierDataGateway = require('../../communication/http-get-rainier-data-gateway');

module.exports = {

    id: "LK2DtZVCQAy4wRwIdhoylQ",
    name: "Network Get Rainier Geographic Categories",
    description: "Initiates a data gateway request to get the set of geographic categories.",

    namespaces: {
        write: [
            {
                filterBinding: { alias: 'netRequest', id: 'hWXm3a8VQJiDv5rpBLO1Tw' },
                storePath: '~.base.RainierBaseController.network.GET_RainierGeographicCategories.request'
            },
            {
                filterBinding: { alias: 'netResponse', id: 'Ajj7octqS6qsZ8_fGDj87A' },
                storePath: '~.base.RainierBaseController.network.GET_RainierGeographicCategories.response'
            }
        ]
    }, // namespaces

    commandSpec: {
        ____types: "jsObject",
        networkGetRainierGeographicCategories: {
            ____types: "jsObject"
        }
    }, // commandSpec

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            var gatewayMessage = { GET: { backend: { rainier: { geographicCategories: request_.command } } } };

            var innerResponse = request_.namespaces.write.netRequest.request({
                appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                writeData: gatewayMessage
            });
            if (innerResponse.error) {
                errors.push(innerRepsonse.error);
                break;
            }

            innerResponse = HttpGetRainierDataGateway.request({
                request: gatewayMessage,
                resultHandler: function(result_) {
                    console.log("Got geo categories response!");

                    var writerResponse = request_.namespaces.write.netResponse.request({
                        appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                        writeData: {
                            error: null,
                            result: result_
                        }
                    });

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
            response.error = errors.join(' ');
        }
        return response;
    } // bodyFunction
};

