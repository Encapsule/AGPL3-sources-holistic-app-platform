// about-page-html-filter.js
//
// An HTTP server service filter responsible for rendering
// an HTML document on the server that describes the version,
// and configuration of the HTTP server filter.

const arccore = require('arccore');
const httpServiceFilterFactory = require('holism').service;

var factoryResponse = httpServiceFilterFactory.create({
    id: "8T1siF2XTKmuA47NfwFytg",
    name: "About Server Page Service",
    description: "Renders an HTML document on the server describing the HTTP server filter version, and configuration.",
    constraints: {
        request: {
            content: { encoding: 'utf8', type: 'text/plain' },
            query_spec: { ____types: "jsUndefined" },
            request_spec: { ____types: "jsString" }
        },
        response: {
            content: { encoding: 'utf8', type: 'text/html' },
            error_context_spec: { ____opaque: true },
            result_spec: { ____opaque: true },
        }
    },
    handlers: {
        request_handler: function(request_) {
            // Call the result response filter manufactured for us
            // by the service filter factory.

            var errors = [];
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                console.log("..... " + this.operationID + "::" + this.operationName);

                var introspectorResponse = request_.integrations.filters.get_server_context.request();
                if (introspectorResponse.error) {
                    errors.unshift(introspectorResponse.error);
                    break;
                }
                var serverContext = introspectorResponse.result;

                var responseAttempt = request_.response_filters.result.request({
                    streams: request_.streams,
                    integrations: request_.integrations,
                    request_descriptor: request_.request_descriptor,
                    response_descriptor: {
                        http: { code: 200 },
                        content: { encoding: 'utf8', type: 'text/html' },
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
            return { error: null, result: null }
        }
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;




