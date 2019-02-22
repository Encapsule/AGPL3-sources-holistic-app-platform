// sources/server/services/service-rainier-ux-data/gateway-filters/get-rainier-audience-verticals.js

const dataGatewayFilterFactory = require('../lib/data-gateway-filter-factory');

//Verticals are fixed list as shown here, there is no API call to get them so we have the list here.
const verticals = [
    {name: "Adult"},
    {name: "Associations & Advocacies"},
    {name: "Automotive"},
    {name: "CPG"},
    {name: "Education"},
    {name: "Financial Services"},
    {name: "Government"},
    {name: "Healthcare"},
    {name: "Media & Entertainment"},
    {name: "Other"},
    {name: "Restaurants" },
    {name: "Retail"},
    {name: "Services"},
    {name: "Technology"},
    {name: "Telecommunications"},
    {name: "Travel & Transportation"},
    {name: "Utilities"}
];

var factoryResponse = dataGatewayFilterFactory.request({

    id: "StjmRXcCSHK7Drkqb2LLIg",
    name: "GET Rainier Audience Verticals",
    description: "Retrieves a list of vertical segments that may be specified in an audience definition.",

    gatewayMessageSpec: {
        ____types: "jsObject",
        GET: {
            ____types: "jsObject",
            backend: {
                ____types: "jsObject",
                rainier: {
                    ____types: "jsObject",
                    audienceVerticals: {
                        ____types: "jsObject"
                    }
                } // rainier
            } // backend
        } // POST
    }, // gatewayMessageSpec
    gatewayMessageHandler: function(gatewayMessage_) {

        console.log('..... ' + module.exports.filterDescriptor.operationID + "::" + module.exports.filterDescriptor.operationName);

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
                    content: { encoding: 'utf8', type: 'application/json' },
                    data: {
                        youPassedMe: gatewayMessage_.gatewayMessage,
                        data: verticals
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
                        content: { encoding: 'utf8', type: 'application/json' },
                        data: {
                            error_message: resultResponderResponse.error,
                            error_context: { source_tag: "rainier-ux-base::IO1SZsa7Q-eW24juNNd4Kg" }
                        }
                    }
                });
            }

            break;
        }
        if (errors.length) {
            response.error = errors.join(' ');
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
