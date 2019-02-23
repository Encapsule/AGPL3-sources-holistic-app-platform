// service-options-as-html-content.js
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
//
// This implementation will redirect the user if they are obviously not logged in.

const httpServiceFilterFactory = require("holism").service;
const serviceUtils = require("./../service-utils");
const common =  require("./common");
const constraints = common.constraints;
const contentTypeLUT = common.contentTypeLUT;

var factoryResponse = httpServiceFilterFactory.create({
    id: "_wdq6CuvTnGlW8MhbnddDA",
    name: "Options As HTML Content",
    description: "Passes the value registration-time options object through to the HTML render subsystem.",
    constraints: constraints,
    handlers: {
        request_handler: function(request_) {
            console.log("..... " + this.operationID + "::" + this.operationName);

            var errors = [];
            var inBreakScope = false;

            while (!inBreakScope) {
                inBreakScope = true;

                // Is this really authorization or authentication used temporarily in dual role?
                var isAuthorizedResponse = serviceUtils.isUserAuthorized(request_);
                if (isAuthorizedResponse.error) {
                    // We have to handle this.
                    errors.unshift(isAuthorizedResponse.error);
                    break;
                }
                var isAuthorized = isAuthorizedResponse.result;

                if (!isAuthorized) {
                    return serviceUtils.redirectToLogin(request_, undefined);
                }

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
                        content: { encoding: "utf8", type: contentTypeLUT[request_.request_descriptor.data.query.format] },
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
                        content: { encoding: "utf8", type: "text/html" },
                        data: {
                            error_message: message,
                            error_context: {
                                source_tag:  "rainier-ux-base-error-X5k_1ydzRvCa-_G56bdntg"
                            }
                        }
                    }
                });

                if (errorAttempt.error) {
                    return { error: errorAttempt.error };
                }
            }
            return { error: null, result: null };
        }
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
