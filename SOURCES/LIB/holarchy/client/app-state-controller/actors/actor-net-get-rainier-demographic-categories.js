// sources/client/app-state-controller/actors/state-net-get-rainier-demographic-categories.js

const HttpGetRainierDataGateway = require('../../communication/http-get-rainier-data-gateway');

module.exports = {

    id: "4t9tnxigRqq3ADfU2lL2dQ",
    name: "Network Get Rainier Demographic Categories",
    description: "Initiates a data gateway request to the Rainier backend to get the set of supported demographic categories for a specific country.",

    namespaces: {
        //TODO read the selected country and pass it in the call to the gateway.
        read: [
            {
                filterBinding: { alias: 'selectedPCode', id: 'HYX6Qwn9T0KLQuAJAEhg1Q' },
                storePath: '~.base.RainierBaseController.selectedAdvertiser.pcode'
            }
        ],
        write: [
            {
                filterBinding: { alias: 'netRequest', id: "fBXLNjWXQg6GR1rVIDhGpm" },
                storePath: '~.base.RainierBaseController.network.GET_RainierDemographicCategories.request'
            },            
            {
                filterBinding: { alias: 'netResponse', id: 'e-0Lzbg-RcO3GJvYN4zN5w' },
                storePath: '~.base.RainierBaseController.network.GET_RainierDemographicCategories.response'
            }
        ]
    }, // namespaces

    commandSpec: {
        ____types: "jsObject",
        networkGetRainierDemographicCategories: {
            ____accept: "jsObject"
        }
    }, // commandSpec

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            var innerResponse = request_.namespaces.read.selectedPCode.request();

            if (innerResponse.error) {
                errors.push(innerRepsonse.error);
                break;
            }

            let pcode = innerResponse.result;
            var gatewayMessage = { GET: { backend: { rainier: { demographicCategories: {pcode: pcode} } } } };

            innerResponse = request_.namespaces.write.netRequest.request({
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
                    console.log("Got a response!");

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

