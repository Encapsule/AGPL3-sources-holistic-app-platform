// app-server-method-constructor-input-spec.js

const holism = require("@encapsule/holism");

module.exports = {

    ____label: "HolisticAppServer::constructor Request Object",
    ____description: "A developer-defined descriptor object containing the information required to configure and initialize the derived app server service process.",
    ____types: "jsObject",

    appServiceCore: { // naming at this level is in flux. resisting the urge to play w/names until this is service HTTP requests again.
        ____label: "Holistic App Common Definition",
        ____description: "A reference to a HolisticAppCommon class instance. Or, a descriptor object from which we can construct a new instance of class HolisticAppCommon.",
        ____accept: "jsObject"
    },

    httpServerConfig: {
        ____label: "Embedded HTTP Server Config",
        ____description: "Information used to specialize a HolisticAppServer class instance's embedded HTTP request processor.",
        ____types: "jsObject",
        ____defaultValue: {},

        // Currently, we rely on our rather old and humble @encapsule/holism RTL to provide HTTP request processing services.
        // It doesn't totally suck as it is. But, it's difficult to follow as it's lots of async stream processing, a non-trivial
        // visitor pattern integration API, obstruse service plug-in model etc. Anyway, someday we'll move it into CellProcessor
        // and clean it up substantially. But, for now we stuff most of the sharp edges behind this ES6 fascade to make it
        // simpler for developers to customize their app server (less options === more better). And, simpler for me to maintain
        // and evolve the backend infrastructure over time w/out impact or disruption on derived app's (how the HTTP requests
        // are processed in detail is no longer fully exposed to derived apps. This is intentional. If you need further degrees
        // of flexibility let me know; do not simply build new stuff to try to work-around the limitation(s). It is likely there's
        // a plan for that on the roadmap for the app server...

        holismConfig: {
            ____label: "Holism HTTP Server Config",
            ____description: "Initialization options, type and runtime behavior specializations for runtime-type filtered @encapsule/holism embedded HTTP 1.1 server instance.",
            ____types: "jsObject",
            ____defaultValue: {},

            options: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.config.options },

            registrations: {
                ____label: "Derived App Service Server Integration Registrations",
                ____description: "Information used to specialize and customize the behavior of your derived app server service's embedded @encapsule/holism HTTP server.",
                ____types: "jsObject",
                ____defaultValue: {},

                resources: {
                    ____label: "Holism HTTP Server Config Integrations",
                    ____description: "Callback functions dispatched by HolisticAppServer constructor function to obtain configuration information from your derived app.",
                    ____types: "jsObject",
                    ____defaultValue: {},
                    // Where a resource is defined to be a URL-mapped file cached on the Node.js heap.
                    getMemoryFileRegistrationMap: {
                        ____label: "Memory-Cached File Registration Map Accessor Function",
                        ____description: "A synchronous callback function that is dispatched to obtain your app server's @encapsule/holism memory-cached registration map.",
                        ____accept: "jsFunction"
                    },
                    // Or, a service filter plug-in mapped to a URL.
                    getServiceFilterRegistrationMap: {
                        ____label: "Service Filter Plug-In Registration Map Accessor Function",
                        ____description: "A synchronous callback function that is dispatched to obtain your app server's @encapsule/holism service filter plug-in registration map.",
                        ____accept: "jsFunction"
                    }

                } // ~.httpServerConfig.holism.registrations.resources

            }, // ~.httpServerConfig.holism.registrations

            lifecycle: {
                ____label: "Holism HTTP Server Request Lifecycle Integrations",
                ____description: "Callback functions dispatched by @encapsule/holism during HTTP request processing to obtain and customize information passed to all registered service filter plug-ins so that they can use the information to customize their HTTP response behavior(s).",
                ____types: "jsObject",
                ____defaultValue: {},

                redirectPreprocessor: {
                    ____accept: [ "jsNull", "jsFunction" ],
                    ____defaultValue: null
                },

                getUserIdentityAssertion: {
                    ____accept: [ "jsNull", "jsFunction" ],
                    ____defaultValue: null
                },

                getUserLoginSession: {
                    ____accept: [ "jsNull", "jsFunction" ],
                    ____defaultValue: null
                }

            } // ~.httpServerConfig.holism.requestLifecycle

        } // ~.httpServerConfig.holismConfig

    }, // ~.httpServerConfig

};

