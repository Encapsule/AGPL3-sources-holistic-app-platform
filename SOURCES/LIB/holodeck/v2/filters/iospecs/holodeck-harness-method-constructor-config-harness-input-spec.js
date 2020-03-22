// holodeck-harness-method-constructor-config-harness-input-spec.js

module.exports = {
    ____types: "jsObject",
    createConfigHarness: {
        ____types: "jsObject",

        // assigned to constructed harness filter
        id: { ____accept: "jsString" },
        name: { ____accept: "jsString" },
        description: { ____accept: "jsString" },

        programRequestSpec: {
            ____accept: "jsObject" // this is a filter specification
        },

        programResultSpec: {
            ____accept: "jsObject" // this is a filter specification
        },

        harnessBodyFunction: {
            ____label: "Config Harness Plug-in bodyFunction",
            ____description: "Some specific program configuration operation.",
            ____accept: "jsFunction"
        }


    }
};
