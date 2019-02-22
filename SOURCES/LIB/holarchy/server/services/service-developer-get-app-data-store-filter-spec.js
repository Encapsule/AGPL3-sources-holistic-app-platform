// sources/server/services/service-developer-get-app-data-store-filter-spec.js

const httpServiceFilterFactory = require("holism").service;

var factoryResponse = httpServiceFilterFactory.create({
    id: "7UbLdCY0SI-Whs_xinwvHw",
    name: "Rainier UX App Data Store Filter Spec Accessor",
    description: "Retrieves a copy of the application data store filter specification and returns it to the client HTML5 application as either HTML or JSON.",
    constraints: {
        request: {
            content: { encoding: "utf8", type: "text/plain" },
            query_spec: {
                ____types: "jsObject",
                ____defaultValue: {},
                format: {
                    ____accept: "jsString",
                    ____defaultValue: "html",
                    ____inValueSet: [ "html", "json" ]
                }
            },
            request_spec: { ____opaque: true }, // i.e. don't care
            options_spec: { ____accept: "jsUndefined" } // i.e. disabled
        },
        response: {
            content: { encoding: "utf8", type: "text/html" },
            error_context_spec: { ____opaque: true },
            result_spec: { ____opaque: true }
        }
    },
    handlers: {

        request_handler: function(request_) {

            var response = { error: null, result: null }; // not meaningful

            var responseAttempt;

            switch (request_.request_descriptor.data.query.format) {
            case "html":
                responseAttempt = request_.response_filters.result.request({
                    streams: request_.streams,
                    integrations: request_.integrations,
                    request_descriptor: request_.request_descriptor,
                    response_descriptor: {
                        http: { code: 200, message: "React!" },
                        content: { encoding: "utf8", type: "text/html" },
                        data: {
                            RUXBase_Page: {
                                pageContentEP: {
                                    RUXBase_PageContent_SubviewSummary: {
                                        contentEP: [
                                            {
                                                RUXBase_PageContent_Markdown: {
                                                    markdownContent: [
                                                        "# Application Data Store Filter Specification\n",
                                                        "This page provdes access to the application data store [filter specification](https://encapsule.io/docs/ARCcore/filter/specs)\n",
                                                        "that controls the validation and normalization of shared truth state read and written from the application data store.\n",
                                                        "\n",
                                                        "[View as raw JSON](?format=json)\n",
                                                        "\n",
                                                        "```\n",
                                                        JSON.stringify(request_.integrations.appStateContext.appDataStoreConstructorFilter.filterDescriptor.inputFilterSpec, undefined, 4) + "\n",
                                                        "```\n",
                                                        "---\n"
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                });
                break;
            case "json":
                responseAttempt = request_.response_filters.result.request({
                    streams: request_.streams,
                    integrations: request_.integrations,
                    request_descriptor: request_.request_descriptor,
                    response_descriptor: {
                        http: { code: 200, message: "JSON!" },
                        content: { encoding: "utf8", type: "application/json" },
                        data: request_.integrations.appStateContext.appDataStoreConstructorFilter.filterDescriptor.inputFilterSpec
                    }
                });
                break;
            default:
                throw new Error("If you extend the set of values allowed for query param `format`, you need to handle it here.");
            }

            if (!responseAttempt.error)
                return response;

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
                            source_tag:  "X5k_1ydzRvCa-_G56bdntg"
                        }
                    }
                }
            });

            if (errorAttempt.error)
                response.error = errorAttempt.error;

            return response;
        }
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
