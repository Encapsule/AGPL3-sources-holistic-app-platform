// holodeck-harness-filter-base-input-spec.js
//
// Defines the base filter specification used by all holodeck harness filters regardless of their type and function.


module.exports = {
    ____label: "Holodeck Program Request",
    ____description: "A root or branch of a \"holodeck program\" - a tree of HolodeckHarness request objects.",
    ____types: "jsObject",
    id: { ____accept: "jsString" },
    name: { ____accept: "jsString" },
    description: { ____accept: "jsString" },

    programRequest: {
        ____accept: "jsObject"
    }

};
