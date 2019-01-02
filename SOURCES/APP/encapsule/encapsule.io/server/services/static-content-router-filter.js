// static-content-router-filter.js
//
// Implements an Encapsule/holism service filter that
// accepts an opaque options object via its service registration
// signature. At runtime, the service implementation passes the
// unmodified (thus static content) registration options object
// to the service result response filter as `data`. This facility
// allows any React component registered with the dynamic content
// router to be called for a specific GET route simply by
// registering this service filter on the GET:pathname route,
// and specifying the content data of the target React component
// via the service registration options object.
//
// Many core site features rely on this facility. e.g. sitemap,
// search... any "page" feature for which there is no need to invoke
// server-side data wrangling in order to fullfill the page request.
//
// Note that the client application may always interact with the server
// and dynamically update itself independent how it was originally
// rendered by the server. So 'static content' is a bit misleading;
// it's rather that the server does not dynamically obtain content
// to render server-side.

const httpServiceFilterFactory = require('holism').service;

var factoryResponse = httpServiceFilterFactory.create({
    id: "_wdq6CuvTnGlW8MhbnddDA",
    name: "Static Content Service",
    description: "Routes statically-defined service registration options object through to the HTML rendering subsystem at runtime.",
    constraints: {
        request: {
            content: { encoding: 'utf8', type: 'text/plain' },
            query_spec: { ____opaque: true },
            request_spec: { ____opaque: true },
            options_spec: {
                ____label: "HTML Content Render Request Descriptor",
                ____description: "A HTML content render request descriptor to be passed directly to the HTML rendering " +
                    "subsystem at runtime.",
                ____accept: "jsObject",
                ____defaultValue: { "Kps06vfyRAergUeUGnFkCQ": { message: "YOU MUST SPECIFY AN SERVICE OPTIONS OBJECT!" }}
            }
        },
        response: {
            content: { encoding: 'utf8', type: 'text/html' },
            error_context_spec: { ____opaque: true },
            result_spec: { ____opaque: true }
        }
    },
    handlers: {
        request_handler: function(request_) {
            var response = { error: null, result: null };
            var errors = [];
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                console.log("..... " + this.operationID + "::" + this.operationName);
                var responseAttempt = request_.response_filters.result.request({
                    streams: request_.streams,
                    integrations: request_.integrations,
                    request_descriptor: request_.request_descriptor,
                    response_descriptor: {
                        http: { code: 200, message: "React!" },
                        content: { encoding: 'utf8', type: 'text/html' },
                        data: request_.options
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
