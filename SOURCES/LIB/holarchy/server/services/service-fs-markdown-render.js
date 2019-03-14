// service-fs-markdown-render.js

const arccore = require("@encapsule/arccore");
const fs = require("fs");
const httpServiceFilterFactory = require("@encapsule/holism").service;

const packageMeta = require("../../package");


// NOT USED? var etagCache = {};


var factoryResponse = httpServiceFilterFactory.create({
    id: "GLwKkBTXRzqYHHr9Gdak-Q",
    name: "Markdown Filesystem Resource Render Service",
    description: "Reads Markdown resource from filesystem location in the server application's static resource directory structure specified via service registration options object." +
        " Calculates ETag hash on construction, suports If-None-Match/HTTP 304 cache validation (i.e. download only when resource is actually updated).",
    constraints: {
        request: {
            content: { encoding: "utf8", type: "text/plain" },
            query_spec: { ____opaque: true },
            request_spec: { ____opaque: true },
            options_spec: {
                ____label: "Service Registration Options",
                ____types: "jsObject",
                markdownFilename: {
                    ____label: "Markdown Resource Filename",
                    ____description: "The base filename (no path) of the markdown file resource to render. It is assumed this resource can be resolved relative to the directory" +
                        " where the server-app-bundle.js module is located in the _resources/markdown/ directory.",
                    ____accept: "jsString"
                },
                markdownOptions: {
                    ____label: "Markdown Options",
                    ____description: "An options object to pass through to the underlying <ReactMarkdown/> component.",
                    ____accept: "jsObject",
                    ____defaultValue: {}
                },
                viewOptions: {
                    ____label: "View Options",
                    ____description: "An options object used to customize the React rendering of the wrapper around the hosted <Markdown/> component.",
                    ____types: "jsObject",
                    ____defaultValue: {},
                    useContainerStyles: {
                        ____label: "Use Container Styles Flag",
                        ____description: "Indicates if RUXBase_PageContent_Markdown should use its programmatic container styles or just a plain <DIV/>.",
                        ____accept: "jsBoolean",
                        ____defaultValue: false
                    }
                }
            }
        },
        response: {
            content: { encoding: "utf8", type: "text/html" },
            error_context_spec: { ____opaque: true },
            result_spec: { ____opaque: true }
        }
    },
    handlers: {
        request_handler: function(request_) {

            var response = { error: null, result: null };
            var inBreakScope = false;

            while (!inBreakScope) {
                inBreakScope = true;

                console.log("> processing request for markdown file resource '" + request_.options.markdownFilename);

                fs.readFile(request_.options.markdownFilename, "utf8", function(error_, data_) {

                    if (error_) {

                        var message = [];
                        message.push("Fatal error loading request markdown file resource '" + request_.options.markdownFilename + "'.");
                        message.push(error_.toString());

                        // Trombones...
                        var errorAttempt = request_.response_filters.error.request({
                            streams: request_.streams,
                            integrations: request_.integrations,
                            request_descriptor: request_.request_descriptor,
                            error_descriptor: {
                                http: { code: 500 },
                                content: { encoding: "utf8", type: "text/html" },
                                data: {
                                    error_message: message.join(" "),
                                    error_context: { source_tag: "EzDer0taRlC-iYIjziXukg" }
                                }
                            }
                        });

                        if (errorAttempt.error) {
                            // Oh no - a fatal error in the HTML rendering subsystem exposed while trying to report an error!
                            throw new Error(errorAttempt.error); // You broke the render subsystem!
                        } //

                    } // end if error_
                    else {
                        // success - we have the markdown file resource loaded into memory now.
                        // The IRUT hash is based on the content, and build identifiers. We include the build identifiers because it's
                        // possible that the manner in which the content will be presented has somehow changed build-to-build. However,
                        // this is actually pretty difficult to track. So, we just use the build identifiers and send a freshly-rendered
                        // view of the content to each client for every new build regardless if if the content itself has been updated
                        // or not.

                        var contentIRUT = arccore.identifier.irut.fromReference(data_.toString("utf8") + packageMeta.buildID + packageMeta.buildTime).result;
                        var contentETag = packageMeta.name + ":" + contentIRUT;
                        const requestDescriptor = request_.request_descriptor;
                        var lastETag =
                            requestDescriptor.headers["if-none-match"] ||
                            requestDescriptor.headers["If-None-Match"] ||
                            requestDescriptor.headers["if-match"] ||
                            requestDescriptor.headers["If-Match"];

                        if (!lastETag) {
                            console.log("It appears the user agent did not specify an ETag via If-None-Match header.");
                        }
                        if (lastETag === contentETag) {
                            // Resource has not changed since last request! Respond w/HTTP code 304
                            // informing the user agent that it's okay to use its cached copy of the resource.
                            console.log("Browser asserts ETag should be '" + lastETag + "' which is the LATEST! Responding w/304");
                            var innerResponse = request_.response_filters.result.request({
                                streams: request_.streams,
                                integrations: request_.integrations,
                                request_descriptor: requestDescriptor,
                                response_descriptor: {
                                    http: { code: 304, message: "Good to go!" },
                                    headers: {
                                        ETag: contentETag,
                                        "Cache-Control": "must-revalidate"
                                    },
                                    content: { encoding: "utf8", type: "text/plain" },
                                    data: ""
                                }
                            });
                            if (innerResponse.error) {
                                throw new Error(innerResponse.error); // You broke the render subsystem
                            }

                        } else {

                            var responseAttempt = request_.response_filters.result.request({
                                streams: request_.streams,
                                integrations: request_.integrations,
                                request_descriptor: request_.request_descriptor,
                                response_descriptor: {
                                    http: { code: 200, message: "React!" },
                                    content: { encoding: "utf8", type: "text/html" },
                                    headers: {
                                        ETag: contentETag,
                                        "Cache-Control": "must-revalidate"
                                    },
                                    // The `data` is immediately passed into <ComponentRouter/> by react-ux-base
                                    // allowing us to effectively control the layout of the page view with the
                                    // namespace/type signature of object we pass into the HTML render subsystem.
                                    data: {
                                        HolisticMarkdownContentData_HcZRCebVREq15DNzsjLRsw: {
                                            markdownContent: [ data_.toString("utf8") ],
                                            markdownOptions: request_.options.markdownOptions,
                                            viewOptions: request_.options.viewOptions
                                        }
                                    }
                                }
                            });
                            if (responseAttempt.error) {
                                // Trombones...
                                errorAttempt = request_.response_filters.error.request({
                                    streams: request_.streams,
                                    integrations: request_.integrations,
                                    request_descriptor: request_.request_descriptor,
                                    error_descriptor: {
                                        http: { code: 500 },
                                        content: { encoding: "utf8", type: "text/html" },
                                        data: {
                                            error_message: responseAttempt.error,
                                            error_context: { source_tag: "jdZWnfq9SoCuZwim2EX1nA" }
                                        }
                                    }
                                });
                                if (errorAttempt.error) {
                                    // Oh no - a fatal error in the HTML rendering subsystem exposed while trying to report an error!
                                    throw new Error(errorAttempt.error); // >:/ you broke the render subsystem. go fix it!
                                }
                            }
                        } // end else serve the resource
                    } // end if data_ (success)
                }); // fs.readFile (markdown file resource)

                break;

            } // while(inBreakScope)

            return response;
        }
    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
