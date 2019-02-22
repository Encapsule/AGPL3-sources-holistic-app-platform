// sources/client/app-state-controller/actors/state-net-get-rainier-query-date-range.js

const HttpGetRainierDataGateway = require('../../communication/http-get-rainier-data-gateway');

module.exports = {

    id: "_B6e1cUUScaA0JfVUPW5_w",
    name: "Network Get Rainier Query Data Range",
    description: "Initiates a data gateway request to the Rainier backend to get permissible range of query dates.",

    namespaces: {
        read: [
            {
                filterBinding: { alias: 'selectedAdvertiser', id: "hc0X5ay8QzWU87u82WKtEw" },
                storePath: "~.base.RainierBaseController.selectedAdvertiser.pcode"
            }
        ],
        write: [
            {
                filterBinding: { alias: 'netRequest', id: "cs54Lh0ETxqoUzdW3Qe_Fw" },
                storePath: "~.base.RainierBaseController.network.GET_RainierQueryDateRange.request"
            },
            {
                filterBinding: {  alias: 'netResponse', id: "ZbTzvev_R8uy0pWryryAuQ" },
                storePath: "~.base.RainierBaseController.network.GET_RainierQueryDateRange.response"
            }
        ]
    }, // namespaces

    commandSpec: {
        ____types: "jsObject",
        networkGetRainierQueryDateRange: {
            ____accept: "jsObject"
        }
    }, // commandSpec

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

            var gatewayMessage = {
                GET: {
                    backend: {
                        rainier: {
                            queryDateRange: {
                                pcode: pcode
                            }
                        }
                    }
                }
            };

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

