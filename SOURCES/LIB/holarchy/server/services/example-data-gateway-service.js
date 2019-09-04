// sources/server/services/service-rainier-data.js

/*

NOTES TO SELF:
- Convert this module into a service filter factory that accepts an array of data gateway filters
- Encapsulate the instantiation of the embedded arccore.discriminator instance that affects the message-based routing
- Export the factory filter required for an application developer to instantiate / export their own data gateway filters that can be passed into the data gateway service filter factory (above).

*/



const httpServiceFilterFactory = require("@encapsule/holism").service;
const serviceRainierUxDataRouter = require("./rainier-ux-data/");

var factoryResponse = httpServiceFilterFactory.create({
    id: "5GJ8LaKGShCXySL1OvA2Qw",
    name: "Data Gateway Service",
    description: "This service filter implements a generic message-based routing system for AJAX request.",

    constraints: {
        request: {
            content: { encoding: "utf8", type: "application/json" },
            query_spec: { ____opaque: true },
            request_spec: { ____opaque: true },
            options_spec: { ____accept: "jsObject", ____defaultValue: {} }
        }, // request

        response: {
            content: { encoding: "utf8", type: "application/json" },
            error_context_spec: { ____opaque: true },
            result_spec: { ____opaque: true }
        } // response

    }, // constraints

    handlers: {
        request_handler: function(request_) {

            var response = { error: null, result: null };
            var errors = [];
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                var routerResponse = serviceRainierUxDataRouter.request({
                    gatewayServiceFilterRequest: request_,
                    gatewayMessage: request_.request_descriptor.data.body
                });

                console.log(JSON.stringify(routerResponse));

                if (routerResponse.error) {

                    request_.response_filters.result.request({
                        streams: request_.streams,
                        integrations: request_.integrations,
                        request_descriptor: request_.request_descriptor,
                        response_descriptor: {
                            http: { code: 400 },
                            content: { encoding: "utf8", type: "application/json" },
                            data: {
                                error_message: "Error processing data gateway request.",
                                error_context: {
                                    error: routerResponse.error,
                                    gatewayMessage: request_.request_descriptor.data.body,
                                    source_tag: "rainier-ux-base::Te6gN6IqQCiY-ffKTBDtug"
                                }
                            }
                        }
                    });
                }
                // We're done. It's the responsibility of the data gateway filter to complete successfully serviced requests.
                // We just mop up the errors _that may happen on the synchronous portion of the request initiation_.
                // If the data gateway filter itself performs async operations, then it has to communicate these errors
                // back to Encapsule/holism by calling the provided response filters.

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        } // request_handler
    } // handlers
}); // httpServiceFilterFactory.create

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
