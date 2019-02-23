// sources/server/services/service-rainier-ux-data/gateway-filters/get-rainier-data-availability.js

const dataGatewayFilterFactory = require("../lib/data-gateway-filter-factory");

var factoryResponse = dataGatewayFilterFactory.request({

    id: "9fjjv20eRXG64ropOpIY2w",
    name: "GET Rainier Data Availability Info",
    description: "Retrieves information about which backend data sources are available. And, how recently they have been updated.",

    gatewayMessageSpec: {
        ____types: "jsObject",
        GET: {
            ____types: "jsObject",
            backend: {
                ____types: "jsObject",
                rainier: {
                    ____types: "jsObject",
                    dataAvailability: {
                        ____types: "jsObject",
                        // This is not currently used. But will be shortly we believe.
                        pcode: {
                            ____label: "Advertiser pcode",
                            ____description: "The current advertiser pcode to be included in the qaccount header",
                            ____accept: "jsString"
                        } //pcode
                    }
                } // rainier
            } // backend
        } // POST
    }, // gatewayMessageSpec

    gatewayMessageHandler: function(gatewayMessage_) {

        console.log("..... " + module.exports.filterDescriptor.operationID + "::" + module.exports.filterDescriptor.operationName);

        var response = { error: null , result: null };
        var errors = [];
        var inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            const gatewayServiceRequest = gatewayMessage_.gatewayServiceFilterRequest;
            const httpResponseFilters = gatewayServiceRequest.response_filters;

            var resultResponderResponse = httpResponseFilters.result.request({
                streams: gatewayServiceRequest.streams,
                integrations: gatewayServiceRequest.integrations,
                request_descriptor: gatewayServiceRequest.request_descriptor,
                response_descriptor: {
                    http: { code: 200 },
                    content: { encoding: "utf8", type: "application/json" },
                    data: {
                        youPassedMe: gatewayMessage_.gatewayMessage
                    }
                }
            });

            if (resultResponderResponse.error) {

                httpResponseFilters.result.request({
                    streams: gatewayServiceRequest.streams,
                    integrations: gatewayServiceRequest.integrations,
                    request_descriptor: gatewayServiceRequest.request_descriptor,
                    response_descriptor: {
                        http: { code: 500 },
                        content: { encoding: "utf8", type: "application/json" },
                        data: {
                            error_message: resultResponderResponse.error,
                            error_context: { source_tag: "rainier-ux-base::2L5ODEsBQsmEEayU-jZx5w" }
                        }
                    }
                });
            }

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
