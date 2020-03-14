// holodeck-harness-filter-base-input-spec.js
//
// Defines the base filter specification used by all holodeck harness filters regardless of their type and function.


module.exports = {
    ____types: "jsObject",

    context: {
        ____types: "jsObject",
        holodeck: {
            ____label: "Holodeck Runtime Context",
            ____types: "jsObject",
            ____defaultValue: {},
            harnessDiscriminator: {
                ____label: "Holodeck Harness Discriminator",
                ____description: "Routes a holodeck program request to 1:N registered harness filters during holodeck program evaluation.",
                ____types: "jsObject",
                filterDescriptor: { ____accept: "jsObject" },
                request: { ____accept: "jsFunction" },
                supportedFilters: { ____types: "jsArray", element: { ____accept: "jsString" } }
            }
        },
        program: {
            ____label: "Holodeck Program Context",
            ____accept: "jsObject", // TODO lock this down
            ____defaultValue: {}
        }
    },

    /*
    programRequest: {
        ____opaque: true; // replaced by every specialization of harness.
    }
    */

};
