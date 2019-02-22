// service-options-as-html-content-no-auth.js
//
// See <service-options-as-html-content-.js>
//
// options as content service filter to be used for routes
// that do not require authorization and will never return
// a redirect.

const httpServiceFilterFactory = require('holism').service;
const common =  require('./common');
const constraints = common.constraints;
const contentTypeLUT = common.contentTypeLUT;

var factoryResponse = httpServiceFilterFactory.create({
    id: "93EwF-HbRoupakjfv3XuSQ",
    name: "Options As HTML Content No Auth",
    description: "Passes the value registration-time options object through to the HTML render subsystem.",
    constraints: constraints,
    handlers: {
        request_handler: function(request_) {
            console.log("..... " + this.operationID + "::" + this.operationName);

            var response = { error: null, result: null };
            var errors = [];
            var inBreakScope = false;

            while (!inBreakScope) {
                inBreakScope = true;
                // This method does not return a result. Rather, if an error occurs while it's executing,
                // it directs the error to the Encapsule/holism orange-screen-or-death. And, I consider
                // this a bug in Encapsule/holism - at least minus points for inconsistency. Hmm. I need
                // to do some work in the basement?

                request_.response_filters.result.request({
                    streams: request_.streams,
                    integrations: request_.integrations,
                    request_descriptor: request_.request_descriptor,
                    response_descriptor: {
                        http: { code: 200, message: "React!" },
                        content: { encoding: 'utf8', type: contentTypeLUT[request_.request_descriptor.data.query.format] },
                        data: request_.options // <--- options value from service filter registration passed through to HTML render subsystem as static content
                    }
                });
                // Here, response.error === null.
                break;
            }

            if (errors.length) {
                var message = errors.join(" ");
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
                                source_tag:  "rainier-ux-base-error-nMCofa58QZqm28kkYjDMvw"
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
    console.log("Error in options as content no auth");
    console.log(factoryResponse.error);
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
