// HolisticAppCommon-method-constructor-filter-input-spec.js

module.exports = {
    ____label: "HolisticAppCommon::constructor Request Object",
    ____types: "jsObject",
    ____defaultValue: {},

    // v0.0.49-spectrolite
    // Can we simply replace app metadata with the build?
    // I want to untangle this shit once and for now now that I'm in here tearing it up again.

    appBuildMetadata: {
        ____label: "Holistic App Build Metadata",
        ____description: "A reference to the app-build.json manifest created by the app Makefile.",
        ____accept: "jsObject", // TODO: schematize this slippery sucker once and for all and be done with it.
    },

    appMetadata: {
        ____label: "App Service Metadata",
        ____description: "Holistic app platform defines four extensible application metadata categories. App-specific type definition extension + all of your static build-time app metadata values are passed in here.",
        ____types: "jsObject",
        ____defaultValue: {},
        specs: {
            ____label: "App Service Metadata Extensions Specs",
            ____description: "Optional filter specifications that add properties to holistic platform-defined base objects defined for each of the four metadata categories.",
            ____types: "jsObject",
            ____defaultValue: {},
            org: {
                ____label: "Org Metadata Extension Props Spec",
                ____description: "An optional filter spec that defines top-level properties to be added to organization metadata base spec to ensure platform + app-specific org metadata property values are available consistently throughout the app runtime.",
                ____accept: "jsObject", // This is an arccore.filter specification
                ____defaultValue: {} // no app-specific extension properties
            },
            app: {
                ____label: "App Metadata Extension Props Spec",
                ____description: "An optional filter spec that defines top-level properties to be added to app metadata base spec to ensure platform + app-specific app metadata property values are available consistently throughout the app runtime.",
                ____accept: "jsObject", // This is an arccore.filter specification
                ____defaultValue: {} // no app-specific extension properties
            },
            page: {
                ____label: "Page Metadata Extension Props Spec",
                ____description: "An optional filter spec that defines top-level properties to be added to page metadata base sepc to ensure platform + app-specific page metadata property values are available consistently throughout the app runtime.",
                ____types: "jsObject",
                ____defaultValue: {}
            },
            hashroute: {
                ____label: "Hashroute Metadata Extension Props Spec",
                ____description: "An optional filter spec that defined top-level properties to be added to hashroute metadata base spec to ensure platform + app-specific hashroute metadata property values are available consistently through the app runtime.",
                ____types: "jsObject",
                ____defaultValue: {},
            }
        }, // ~.apppMetadata.specs
        values: {
            ____label: "App Service Metadata Values",
            ____description: "App metadata runtime property values by holistic platform-defined metadata category.",
            ____types: "jsObject",
            ____defaultValue: {},

            org: {
                ____label: "App Service Org Metadata",
                ____description: "Values that define attributes about publisher and presumed owner of the copyright on this specific app service.",
                ____accept: "jsObject", // We don't know the type before we stitch it together. So, the value filtering occurs inside the constructor function and not here at the API boundary. Same for the other values specified here.
                ____defaultValue: {},

            },

            app: {
                ____label: "App Service App Metadata",
                ____description: "We may just replace this w/no input at all from the app developer here. Instead asking them to provide this information via holistic-app.json and picking it up from app-build.json",
                ____accept: "jsObject", // Filtered inside the constructor function.
                ____defaultValue: {}
            },

            pages: {
                ____label: "App Service Pages Metadata",
                ____description: "Page views are defined as reserved GET:/URI routes implemented by the app server service's embedded HTTP 1.1 server that return Content-Encoding: utf-8 Content-Type: text/html response containing a serialized app client service process to be started in the browser tab.",
                ____types: "jsObject",
                ____asMap: true,
                ____defaultValue: {},
                pageURI: { // e.g. "/", "/reports", "/login", ...
                    ____label: "Page URI App Metadata",
                    ____description: "Data used to determine details about which page views are supported by the app server process. And, to allow any specific initial configuration of the app client service to learn of alternate configurations of the app that may be available.",
                    ____accept: "jsObject" // Filtered inside the constructor function.
                }
            },

            hashroutes: {
                ____label: "App Service Hashroutes Metadata",
                ____description: "Hashroutes are UTF-8 strings starting with the # character appened on the end of an app server HTTP request URL that we interpret as secondary resource request URI's to be serviced by the app client service once it has booted.",
                ____types: "jsObject",
                ____asMap: true,
                ____defaultValue: {},
                hashroutePathname: {
                    ____label: "Hashroute Pathname App Metadata",
                    ____description: "Data used to determine details about which page view and what specific behaviors the app client service should invoke in response to an initial or subsequent user/programmatic update the location.href's hashroute string (UTF-8 string beginning w/# appended at tail of location.href).",
                    ____accept: "jsObject" // Filtered inside the constructor function
                }
            }

        } // ~.appMetadata.values

    } // ~.appMetadata

};
