// markdown-content-reader-filter.js

const fs = require('fs');
const path = require('path');
const arccore = require('arccore');
const httpServiceFilterFactory = require('holism').service;
const contentViewRenderMarkdownSpec = require('../common/iospecs/view/content-view-render-markdown-spec');

var appRootPath = path.normalize(path.join(__dirname, '../'));
console.log(appRootPath);

var factoryResponse = httpServiceFilterFactory.create({
    id: "Pq8tbuhVSPCsdqkD_kmvtg",
    name: "Markdown Content Reader Service",
    description: "Reads a Markdown-type file from local disk and returns the string content to the HTML render engine.",
    constraints: {
        request: {
            content: { encoding: 'utf8', type: 'text/plain' },
            query_spec: { ____accept: "jsUndefined" /*i.e. reject requests that specify URL-encoded query parameters*/ },
            request_spec: { ____opaque: true },
            options_spec: {
                ____label: "Markdown Content Reader Service Options",
                ____description: "Service registration options descriptor object.",
                ____types: "jsObject",
                path: {
                    ____label: "Markdown File Path",
                    ____description: "Local file system path of the Markdown file relative to the application's deploy directory.",
                    ____accept: "jsString"
                },
                remarkable: {
                    ____label: "Remarkable Render Options",
                    ____description: "Remarkable module render options (optional)",
                    ____accept: [ "jsUndefined", "jsObject" ],
                }
            }
        },
        response: {
            content: { encoding: 'utf8', type: 'text/html' },
            error_context_spec: { ____opaque: true },
            result_spec: contentViewRenderMarkdownSpec
        }
    },
    handlers: {
        request_handler: function(request_) {

            var response = { error: null , result: null };
            var errors = [];
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                // Go get the source Markdown-type content from the filesystem.
                var resourcePath = path.join(appRootPath, request_.options.path);

                // TODO: Make this async at least or move it into Redis as we're
                // optimizing for speed and convenience; not mega-scale. And, this
                // synchronous file read with no ETag caching shit has got to go...
                var markdownSource = fs.readFileSync(resourcePath).toString('utf8');

                // Call the response result filter to complete the request.
                var innerResponse = request_.response_filters.result.request({
                    integrations: request_.integrations,
                    streams: request_.streams,
                    request_descriptor: request_.request_descriptor,
                    response_descriptor: {
                        http: { code: 200, message: "Session Open" },
                        content: { encoding: 'utf8', type: 'text/html' },
                        headers: {},
                        data: {
                            holisticView_Markdown: {
                                markdownSource: [ markdownSource ]
                            }
                        }
                    }
                });
                if (innerResponse.error) {
                    // ERROR 500:
                    var message = "Result response request was rejected by the result response filter! " + innerResponse.error;
                    var errorResponse = request_.response_filters.error.request({
                        integrations: request_.integrations,
                        streams: request_.streams,
                        request_descriptor: request_.request_descriptor,
                        error_descriptor: {
                            http: { code: 500, message: "Markdown Content Reader Service Error" },
                            content: { encoding: 'utf8', type: 'text/html' },
                            data: {
                                error_message: message,
                                error_context: {
                                    source_tag: "II2lzIMQQ7ecBNLKciOo7g"
                                }
                            }
                        }
                    });
                    if (errorResponse.error) {
                        throw new Error(errorResponse.error);
                    }
                    break;
                }

                response.result = "Okay";
                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
