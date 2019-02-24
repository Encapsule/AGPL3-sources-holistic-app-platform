// service-health-check.js

const httpServiceFilterFactory = require("@encapsule/holism").service;

// NOT USED? const serviceUtils = require("./service-utils");

var factoryResponse = httpServiceFilterFactory.create({
    id: "6sHrn7n8QaSqb9Sv9gt4Ug",
    name: "Health check service filter",
    description: "Passes the value registration-time options object through to the HTML render subsystem.",
    constraints: {
        request: {
            content: { encoding: "utf8", type: "text/plain" },
            query_spec: {
                ____types: "jsObject",
                ____defaultValue: {},
                format: {
                    ____accept: "jsString",
                    ____defaultValue: "json",
                }
            },
            request_spec: { ____opaque: true },
        },
        response: {
            content: { encoding: "utf8", type: "text/html" },
            error_context_spec: { ____opaque: true },
            result_spec: { ____opaque: true }
        }
    },
    handlers: {
        request_handler: function(request_) {

            var responseAttempt = request_.response_filters.result.request({
                streams: request_.streams,
                integrations: request_.integrations,
                request_descriptor: request_.request_descriptor,
                response_descriptor: {
                    http: { code: 200, message: "Ok" },
                    content: { encoding: "utf8", type: "application/json" },
                    data: {
                        online: true
                    }
                }
            });

            return { error: null, result: responseAttempt };
        }
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
