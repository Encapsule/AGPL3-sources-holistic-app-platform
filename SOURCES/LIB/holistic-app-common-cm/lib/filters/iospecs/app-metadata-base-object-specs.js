// app-metadata-base-object-specs.js

// v0.0.49-spectrolite
// We're going with this prior work from v0.0.48-kyanite. This is okay I think
// Here we sketch out app metadata in as much detail as we need/care to know about it.
// Having ONE CENTRAL PLACE where this information is analyzed, indexed, and then made
// available via a CellModel for use in app server or app client service is essential
// for my sanity. It is also essential that I be able to add/remove items that are
// needed by the platform and not have to edit any platform code or any derived app
// code for non-breaking schema changes (e.g. add something new).

module.exports = {

    base: { // platform base definitions for app-extensible static metadata types.

        input: {

            // These specs are combined with specs specified by the derived app to set the runtime metadata formats allowed.
            org: {
                ____label: "Organization Metadata Input",
                ____description: "Information about the group/organization/company that produced this derived app service.",
                ____types: "jsObject"
            },

            app: {
                ____label: "App Metadata Input",
                ____description: "Information about this specific app service.",
                ____types: "jsObject"
            },

            page: {
                ____label: "App Page Metadata Input",
                ____description: "Information about a specific HTML5 document (aka derived app client) synthesized by the derived app server in response to a request to https://xyzzy.com/<URI>.",
                ____types: "jsObject"
            },

            hashroute: {
                ____label: "App Hashroute Metadata Input",
                ____description: "Information about a specific dynamically-generated browser page view that may be displayed to the user by the derived app client service under various programmatically-determined conditions.",
                ____types: "jsObject"
            }

        },

        // These are spliced over the input specs to allow values (e.g. topological sort data) to be added by the platform during construction of the metadata store.
        output: {
            org: {
                ____label: "Organization Metadata Value",
                ____description: "Information about the group/organization/company that produced this derived app service.",
                ____types: "jsObject"
            },

            app: {
                ____label: "App Metadata Value",
                ____description: "Information about this specific app service.",
                ____types: "jsObject"
            },

            page: {
                ____label: "App Page Metadata Value",
                ____description: "Information about a specific HTML5 document (aka derived app client) synthesized by the derived app server in response to a request to https://xyzzy.com/<URI>.",
                ____types: "jsObject"
            },

            hashroute: {
                ____label: "App Hashroute Metadata Value",
                ____description: "Information about a specific dynamically-generated browser page view that may be displayed to the user by the derived app client service under various programmatically-determined conditions.",
                ____types: "jsObject"
            }


        }

    }

};
