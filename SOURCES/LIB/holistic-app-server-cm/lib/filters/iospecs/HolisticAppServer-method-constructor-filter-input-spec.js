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
        ____label: "Holistic App Server Embedded HTTP Server Config",
        ____description: "Information used to specialize a HolisticAppServer class instance's embedded HTTP request processor.",
        ____types: "jsObject",
        ____defaultValue: {},

        // Currently, we rely on our rather old and humble @encapsule/holism RTL to provide HTTP request processing services.
        // It doesn't totally suck as it is. But, it's difficult to follow as it's lots of async stream processing, a non-trivial
        // visitor pattern integration API, obstruse service plug-in model etc. Anyway, someday we'll move it into CellProcessor,
        // abstract the problem w/actions and operators, and then replace it a better external module (we can still maintain boundary
        // filtering through actions). Or, decide that its worthwhile to turn holism into a CellModel and move all its snarl to APM's.
        // There would be performance vs simplicity tradeoffs to consider when this time comes. Fastify is another possibility? We will see.
        // Primary current use case relies heavily on our localhost:8080 interface for most day-to-day development where performance of
        // the HTTP server is not an issue (it's fast actually). In the cloud the per-request overhead of our current HTTP server isn't
        // really a factor (assertion) as most of the overall time taken to process a request is consumed by quering for session, performing
        // authorization, and accessing storage layer resources.

        holism: {
            ____label: "Holism HTTP Server Extensions",
            ____description: "Legacy @encapsule/holism HTTP server library extension API encapsulated enough so we maybe don't care it's not on the cellplane yet.",
            ____types: "jsObject",
            ____defaultValue: {},

            configIntegrations: {
                ____label: "Holism HTTP Server Config Integrations",
                ____description: "Synchronous callback functions called during HolisticAppServer class instance construction to obtain configuration information.",
                ____types: "jsObject",
                ____defaultValue: {},
                getMemCachedFilesConfigMap: {
                    ____label: "Memory-Cached Files Config Map Accessor Function",
                    ____description: "A function you supply that's dispatched to obtain your specific @encapsule/holism memory-cached file assets and their associated routing, headers, and options metadata.",
                    ____accept: "jsFunction"
                },
                getServiceFilterConfigMap: {
                    ____label: "Service Filter Plug-In Config Map Accessor Function",
                    ____description: "A function you supply that's dispatched to obtain your specific @encapsule/holism service filter plug-in registrations and their associated routing, headers, and options metadata.",
                    ____accept: "jsFunction"
                },

                // config: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.config }

            } // ~.httpServerConfig.holism.configIntegrations
        },




    }

};

