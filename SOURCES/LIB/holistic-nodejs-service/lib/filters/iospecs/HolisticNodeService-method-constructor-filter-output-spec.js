// app-server-service-method-constructor-output-spec.js

// We cherry pick a few namespaces from the input spec and splice them into the output spec
// for cases where the constructor filter retains a copy of the input request in this._private.
const inputFilterSpec = require("./HolisticAppServer-method-constructor-filter-input-spec");

// Similarly, we cherry pick a few namespaces from filters descriptors exported by the @encapsule/holism RTL.
const holism = require("@encapsule/holism");

module.exports = {

    ____label: "Holistic App Server Service Context Descriptor",
    ____description: "A developer-defined descriptor object containing the information required to synthesize and start the derived app server service process inside CellProcessor.",
    ____types: "jsObject",

    appServiceCore: { ... inputFilterSpec.appServiceCore },

    httpServerInstance: {
        ____label: "Embedded HTTP Server Instance",
        ____description: "Specialization details and runtime information pertinent to the app server's embedded HTTP request processor instance.",
        ____types: "jsObject",

        holismInstance: {
            ____label: "Holism HTTP Server Instance",
            ____description: "Embedded @encapsule/holism instance config, runtime stats, and OS-level process control API.",
            ____types: "jsObject",

            config: {
                ____label: "Runtime Instance Config",
                ____description: "Details about the specific specializations used to construct this @encapsule/holism HTTP request processor instance.",
                ____types: "jsObject",

                filters: {
                    ____label: "Config Filters",
                    ____description: "Filters created by HolisticAppServer constructor function to query your app server for its @encapsule/holism resource registrations.",
                    ____types: "jsObject",

                    getMemoryFileRegistrationMap: {
                        ____accept: "jsObject" // arccore.filter instance reference
                    },

                    getServiceFilterRegistrationMap: {
                        ____accept: "jsObject" // arccore.filter instance reference
                    }

                }, // ~.httpServerInstance.holismInstance.config.filters

                data: {
                    ____label: "Runtime Resource Registrations",
                    ____description: "The final resource registration set used to configure the embedded @encapsule/holism HTTP request processor instance.",
                    ____types: "jsObject",
                    memoryFileRegistrations: holism.filters.factories.server.filterDescriptor.inputFilterSpec.config.files,
                    serviceFilterRegistrations: holism.filters.factories.server.filterDescriptor.inputFilterSpec.config.services
                } // ~.httpServerInstance.holismInstance.config.data

            },

            integrations: holism.filters.factories.integrations.filterDescriptor.outputFilterSpec,

            httpRequestProcessor: holism.filters.factories.server.filterDescriptor.outputFilterSpec

        } // ~.httpServerInstance.holismInstance

    } // ~.httpServerInstance

};
