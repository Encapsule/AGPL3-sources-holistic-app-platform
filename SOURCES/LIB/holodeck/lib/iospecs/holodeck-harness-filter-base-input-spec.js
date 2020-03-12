// holodeck-harness-filter-base-input-spec.js
//
// Defines the base filter specification used by all holodeck harness filters regardless of their type and function.


module.exports = {
    ____types: "jsObject",

    context: {
        ____types: "jsObject",
        holodeck: {
            ____accept: "jsObject" // TODO: lock this down
        },
        program: {
            ____accept: "jsObject" // TODO lock this down
        }
    },

    /*
    programRequest: {
        ____opaque: true; // replaced by every specialization of harness.
    }
    */

};
