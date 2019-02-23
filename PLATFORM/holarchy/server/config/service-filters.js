// server/config/service-filters.js

const buildTag = require("../../../../../build/_build-tag");
const BASE_SERVICES = require("../services");

var RUXBASE_SERVICE_FILTERS = [

    // JSON GET:/advertise/rainier/data
    {
        // GET:/advertise/rainier/data
        filter: BASE_SERVICES.RainierUXBaseDataGateway, // this service filter discriminates its input and routes to an appropriate data gateway filter
        request_bindings: { method: "GET", uris: [ "/advertise/rainier/data" ] },
        response_properties: { contentEncoding: "utf8", contentType: "application/json" }
    },

    // JSON POST:/advertise/rainier/data
    {
        // POST:/advertise/rainier/data
        filter: BASE_SERVICES.RainierUXBaseDataGateway, // this service filter discriminates its input and routes to an appropriate data gateway filter
        request_bindings: { method: "POST", uris: [ "/advertise/rainier/data" ] },
        response_properties: { contentEncoding: "utf8", contentType: "application/json" }
    },

    // JSON GET:/health
    // JSON GET:/advertise/rainier/health (not authenticated)
    {
        filter: BASE_SERVICES.HealthCheck,
        request_bindings: { method: "GET", uris: [ "/health", "/advertise/rainier/health" ] },
        response_properties: { contentEncoding: "utf8", contentType: "application/json" }
    }

];

switch (buildTag.buildConfig.deployConfig.appDeployEnvironment) {
case "local":
case "development":
    ([
        // HTML5 GET:/developer
        {
            filter: BASE_SERVICES.OptionsAsContentNoAuth,
            request_bindings: { method: "GET", uris: [ "/developer" ] },
            response_properties: { contentEncoding: "utf8", contentType: "text/html" },
            options: {
                RUXBase_Page: {
                    pageContentEP: {
                        RUXBase_PageContent_SubviewSummary: {
                            contentEP: [
                                {
                                    RUXBase_PageContent_Spinner: {
                                        viewOptions: {
                                            containerStyles: {
                                                position: "relative",
                                                height: "128px"
                                            }
                                        }
                                    }
                                },
                                {
                                    RUXBase_PageContent_Markdown: {
                                        markdownContent: [
                                            "Developer pages is a collection of tests, experiments, and demos related to the implementation of this project.\n",
                                            "\n",
                                            "These pages will be removed from production builds of this application."
                                        ]
                                    }
                                },
                            ]
                        }
                    }
                }
            }
        },

        // HTML5 GET:/developer/integrations
        {
            filter: BASE_SERVICES.OptionsAsContentNoAuth,
            request_bindings: { method: "GET", uris: [ "/developer/integrations" ] },
            response_properties: { contentEncoding: "utf8", contentType: "text/html" },
            options: {
                RUXBase_Page: {
                    pageContentEP: {
                        RUXBase_PageContent_SubviewSummary: {
                            contentEP: [
                                {
                                    RUXBase_PageContent_Markdown: {
                                        markdownContent: [
                                            "# Overview\n",
                                            "Collection of developer-defined page views for conducting integration tests."
                                        ]
                                    }
                                } // RUXBase_PageContent_Markdown
                            ]
                        }
                    }
                }
            }
        },

        // HTML5 GET://developer/views
        {
            filter: BASE_SERVICES.OptionsAsContentNoAuth,
            request_bindings: { method: "GET", uris: [ "/developer/views" ] },
            response_properties: { contentEncoding: "utf8", contentType: "text/html" },
            options: {
                RUXBase_Page: {
                    pageContentEP: {
                        RUXBase_PageContent_SubviewSummary: {
                            contentEP: [
                                {
                                    RUXBase_PageContent_Markdown: {
                                        markdownContent: [
                                            "A collection of temporary test pages, and notes created to test and demo various view layout options, and integration with application data model."
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },

        // HTML5 GET:/sitemap
        {
            filter: BASE_SERVICES.OptionsAsContentNoAuth,
            request_bindings: { method: "GET", uris: [ "/sitemap" ] },
            response_properties: { contentEncoding: "utf8", contentType: "text/html" },
            options: { RUXBase_Page: { pageContentEP: { RUXBase_PageContent_Sitemap: {} } } }
        },

        // HTML5 GET:/user
        {
            filter: BASE_SERVICES.OptionsAsContentNoAuth,
            request_bindings: { method: "GET", uris: [ "/user" ] },
            response_properties: { contentEncoding: "utf8", contentType: "text/html" },
            options: {
                RUXBase_Page: {
                    pageContentEP: {
                        RUXBase_PageContent_SubviewSummary: {
                            contentEP: [
                                {
                                    RUXBase_PageContent_Markdown: {
                                        markdownContent: [
                                            "# User [Placeholder]\n",
                                            "\n",
                                            "_This is not the environment you're looking for..._\n",
                                            "\n",
                                            "Hello. You're seeing this placeholder instead of the Quantcast environment-specific user landing page because you're not talking to the app server",
                                            "in a Quantcast application deployment environment. Rather, you are communicating with the app server directly (e.g. on localhost or your",
                                            "team's hosting AWS EB).\n",
                                            "\n",
                                            "Under these circumstances, this is the expected result. Had you instead accessed this same URL replacing the domain with that of a",
                                            "Quantcast application environment (e.g. wst.quantcast.com, wqa.quantcast.com, www.quantcast.com) then the request would have been",
                                            "procesed by the actual user landing page."

                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },

        // HTML5 GET:/user/login
        {
            filter: BASE_SERVICES.OptionsAsContentNoAuth,
            request_bindings: { method: "GET", uris: [ "/user/login" ] },
            response_properties: { contentEncoding: "utf8", contentType: "text/html" },
            options: {
                RUXBase_Page: {
                    pageContentEP: {
                        RUXBase_PageContent_SubviewSummary: {
                            contentEP: [
                                {
                                    RUXBase_PageContent_Markdown: {
                                        markdownContent: [
                                            "# User Login [Placeholder]\n",
                                            "\n",
                                            "_This is not the environment you're looking for..._\n",
                                            "\n",
                                            "Hello. You're seeing this placeholder instead of the Quantcast environment-specific user login page because you're not talking to the app server",
                                            "in a Quantcast application deployment environment. Rather, you are communicating with the app server directly (e.g. on localhost or your",
                                            "team's hosting AWS EB).\n",
                                            "\n",
                                            "Under these circumstances, this is the expected result. Had you instead accessed this same URL replacing the domain with that of a",
                                            "Quantcast application environment (e.g. wst.quantcast.com, wqa.quantcast.com, www.quantcast.com) then the request would have been",
                                            "procesed by the actual user authentication service."
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },

        // HTML5 GET:/user/logout
        {
            filter: BASE_SERVICES.OptionsAsContentNoAuth,
            request_bindings: { method: "GET", uris: [ "/user/logout" ] },
            response_properties: { contentEncoding: "utf8", contentType: "text/html" },
            options: {
                RUXBase_Page: {
                    pageContentEP: {
                        RUXBase_PageContent_SubviewSummary: {
                            contentEP: [
                                {
                                    RUXBase_PageContent_Markdown: {
                                        markdownContent: [
                                            "# User Logout Placeholder\n",
                                            "\n",
                                            "_This is not the environment you're looking for..._\n",
                                            "\n",
                                            "Hello. You're seeing this placeholder instead of the Quantcast environment-specific user logout page because you're not talking to the app server",
                                            "in a Quantcast application deployment environment. Rather, you are communicating with the app server directly (e.g. on localhost or your",
                                            "team's hosting AWS EB).\n",
                                            "\n",
                                            "Inside a Quantcast deployment environment, the global URL map is brokered via HAProxy that forward specific namespaces to specific backends.\n",
                                            "\n",
                                            "This means that this same request issued in a Quantcast environment is routed elsewhere (to the actual user logout) and never reaches this app server."
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }

    ]).forEach(function(serviceFilterRegistration_) { RUXBASE_SERVICE_FILTERS.push(serviceFilterRegistration_); });
    break;
default:
    break;
} // switch deploy environment


module.exports = RUXBASE_SERVICE_FILTERS;
