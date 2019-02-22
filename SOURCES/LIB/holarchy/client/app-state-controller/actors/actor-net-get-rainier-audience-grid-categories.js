// sources/client/app-state-controller/actors/state-net-get-rainier-audience-grid-categories.js

const HttpGetRainierDataGateway = require('../../communication/http-get-rainier-data-gateway');

module.exports = {

    id: "HggGU_onQMiLK401hPai0g",
    name: "Network Get Rainier Audience Grid Categories",
    description: "Initiates a data gateway request to the Rainier backend to get the set of supported audience grid categories.",

    commandSpec: {
        ____types: "jsObject",
        networkGetRainierAudienceGridCategories: {
            ____accept: "jsObject"
        }
    }, // commandSpec

    namespaces: {
        read: [
            {
                filterBinding: { alias: 'selectedAdvertiser', id: 'nqcEyhiARuSjVbP9_exiqw' },
                storePath: '~.base.RainierBaseController.selectedAdvertiser.pcode'
            }
        ],
        write: [
            {
                filterBinding: { alias: 'netRequest', id: '_fS8pkfOTI6ST6HElz6FqQ' },
                storePath: "~.base.RainierBaseController.network.GET_RainierAudienceGridCategories.request"
            },
            {
                filterBinding: { alias: 'netResponse', id: 'lAFGRkKuQhinfe6aYek6ZQ' },
                storePath: '~.base.RainierBaseController.network.GET_RainierAudienceGridCategories.response'
            }
        ]
    }, // namespaces

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            var innerResponse = request_.namespaces.read.selectedAdvertiser.request();
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            const pcode = innerResponse.result;

            const gatewayMessage = { GET: { backend: { rainier: { audienceGridCategories: { pcode: pcode } } } } };

            innerResponse = request_.namespaces.write.netRequest.request({
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

