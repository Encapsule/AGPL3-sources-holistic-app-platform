// content-digraph-node-reader-filter.js

const httpServiceFilterFactory = require('holism').service;

var factoryResponse = httpServiceFilterFactory.create({
    id: "uwNtsiqzTzSi9-fqHqk0bw",
    name: "Content Digraph Node Reader Service",
    description: "Renders a view of the content digraph model and route the node's content data through to the HTML rendering subsystem.",
    constraints: {
        request: {
            content: { encoding: 'utf8', type: 'text/plain' },
            query_spec: { ____accept: "jsUndefined" }, // reject all URL-encoded queries
            request_spec: { ____accept: "jsString", ____inValueSet: [ "" ] }, // reject all data body request info
            options_spec: {
                ____label: "Document Library Page Viewer Options",
                ____description: "Static options specified at service registration that are passed to every invocation of the service.",
                ____types: "jsObject",
                vertexID: {
                    ____label: "Document Library Vertex ID",
                    ____description: "The IRUT identifier of the document library vertex to use as the root vertex of the generated page view.",
                    ____accept: "jsString"
                } // vertexID
            } // options_spec
        }, // request
        response: {
            content: { encoding: 'utf8', type: 'text/html' },
            error_context_spec: { ____opaque: true },
            result_spec: {
                ____label: "Variant HTML Render Request",
                ____description: "A descriptor object routed through an ARCcore.discriminator filter for inside the HTML rendering subsystem.",
                ____accept: "jsObject"
            }
        } // response
    }, // constraints

    handlers: {

        request_handler: function(request_) {
            var response = { error: null, result: null };
            var errors = [];
            var inBreakScope = false;

            while (!inBreakScope) {
                inBreakScope = true;

                // This service filter is registered to handle server-side retrieval of content from
                // the in-memory document libary (content graph) using the specific vertex identifier
                // specified by the registrant.

                var docLibVertexProps = request_.integrations.appStateContext.contentDigraph.getVertexProperty(request_.options.vertexID);
                var pageRenderRequest = docLibVertexProps.content.data;

                // Call the response result filter to complete the request.
                var innerResponse = request_.response_filters.result.request({
                    integrations: request_.integrations,
                    streams: request_.streams,
                    request_descriptor: request_.request_descriptor,
                    response_descriptor: {
                        http: { code: 200 },
                        content: { encoding: 'utf8', type: 'text/html' },
                        headers: {},
                        data: pageRenderRequest
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
                            http: { code: 500, message: "Doc Lib Error" },
                            content: { encoding: 'utf8', type: 'text/html' },
                            data: {
                                error_message: message,
                                error_context: {
                                    source_tag: "xNJx_WAhRCyBeR2DJtQVMw"
                                }
                            }
                        }
                    });

                    if (errorResponse.error) {
                        throw new Error(errorResponse.error);
                    }

                    break;

                } // if innerResponse.error




                response.result = "Okay";
                break;
            }
            if (errors.length)
                response.error = errors.join(" ");
            return response;
        } // request_handler

    } // handlers
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
