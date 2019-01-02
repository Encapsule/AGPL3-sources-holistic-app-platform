// server-introspection-json-filter.js

const httpServiceFilterFactory = require('holism').service;

var factoryResponse = httpServiceFilterFactory.create({
    id: "7ZYbEQ49Q1mmcIO_srm8Og",
    name: "HTTP Server Introspection Service",
    description: "Provides developer access to HTTP server filter configuration, services, and integration details.",
    constraints: {
        request: {
            content: { encoding: 'utf8', type: 'application/json' }, // i.e. accept JSON-encoded query data
            query_spec: { ____accept: [ "jsUndefined", "jsObject" ] }, // i.e. accept any URL-encoded query presented by the client
            request_spec: { ____accept: [ "jsUndefined", "jsObject" ] }
        },
        response: {
            content: { encoding: 'utf8', type: 'application/json' }, // i.e. serialize the resonse to JSON
            error_context_spec: { ____opaque: true },
            result_spec: { ____accept: "jsObject" }
        }
    },
    handlers: {
        request_handler: function(request_) {
            var response = { error: null, result: null };
            var errors = [];
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                var introspectorResponse = request_.integrations.filters.get_server_context.request();
                if (introspectorResponse.error) {
                    errors.unshift(introspectorResponse.error);
                    break;
                }
                var serverContext = introspectorResponse.result;

                var responseAttempt = request_.response_filters.result.request({
                    streams: request_.streams, integrations: request_.integrations,
                    request_descriptor: request_.request_descriptor,
                    response_descriptor: {
                        http: { code: 200, message: "Because you're curious..." },
                        content: { encoding: 'utf8', type: 'application/json' },
                        data: serverContext
                    }
                });
                if (responseAttempt.error) {
                    errors.unshift(responseAttempt.error);
                    break;
                }
                break;
            }
            if (errors.length) {
                var message = errors.join(" ");

                // Whoops...
                var errorAttempt = request_.response_filters.error.request({
                    streams: request_.streams,
                    integrations: request_.integrations,
                    request_descriptor: request_.request_descriptor,
                    error_descriptor: {
                        http: { code: 500 },
                        content: { encoding: 'utf8', type: 'text/html' },
                        data: {
                            error_message: message,
                            error_context: {
                                source_tag:  "X5k_1ydzRvCa-_G56bdntg"
                            }
                        }
                    }
                });
                if (errorAttempt.error) {
                    return { error: errorAttempt.error };
                }
            }
            return response;
        }
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
