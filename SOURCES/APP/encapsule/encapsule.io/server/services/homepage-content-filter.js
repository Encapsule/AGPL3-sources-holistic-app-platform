// homepage-content-filter.js

const httpServiceFilterFactory = require('holism').service;
const contentViewRenderMarkdownSpec = require('../common/iospecs/view/content-view-render-markdown-spec');

var factoryResponse = httpServiceFilterFactory.create({
    id: "UBBoGJwbSJe7SXUTt7T_qw",
    name: "Homepage Content Service",
    description: "Services incoming GET requests routed through the view store and HTML rendering subsystem.",
    constraints: {
        request: {
            content: {
                encoding: 'utf8',
                type: 'text/plain'
            },
            query_spec: {
                ____opaque: true
            },
            request_spec: {
                ____opaque: true
            }
        },
        response: {
            content: {
                encoding: 'utf8',
                type: 'text/html'
            },
            error_context_spec: {
                ____opaque: true
            },
            result_spec: contentViewRenderMarkdownSpec
        }
    },
    handlers: {
        request_handler: function(request_) {
            var response = { error: null, result: null };
            var errors = [];
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                var responseAttempt = request_.response_filters.result.request({
                    streams: request_.streams,
                    integrations: request_.integrations,
                    request_descriptor: request_.request_descriptor,
                    response_descriptor: {
                        http: { code: 200, message: "React!" },
                        content: { encoding: 'utf8', type: 'text/html' },
                        data: {
                            MarkdownContent: {
                                source: "# Hello!\n\n" +
                                    "This is markdown-encoded string content inlined into the homepage " +
                                    "content service filter's result response.\n\n" +
                                    "The fact that you're seeing this as HTML inside the main <HolisticPage/> " +
                                    "means that dynamic routing of messages via ARCcore.discriminator is working :)"
                            }
                        }
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
