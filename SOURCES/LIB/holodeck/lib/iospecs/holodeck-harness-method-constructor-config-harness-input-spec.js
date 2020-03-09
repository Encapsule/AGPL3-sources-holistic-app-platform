// holodeck-harness-method-constructor-config-harness-input-spec.js

module.exports = {
    ____types: "jsObject",
    createConfigHarness: {
        ____types: "jsObject",

        id: { ____accept: "jsString" },
        name: { ____accept: "jsString" },
        description: { ____accept: "jsString" },

        configRequestInputSpec: {
            ____label: "Config Harness Request Spec",
            ____description: "Developer-defined request filter spec for the holodeck plug-in harness filter.",
            ____accept: "jsObject" // this is a filter specification
        },

        configResultOutputSpec: {
            ____label: "Config Harness Result Spec",
            ____description: "Developer-defined response.result filter spec for the holodeck plug-in harness filter.",
            ____accept: "jsObject" // this is a filter specification
        },

        harnessBodyFunction: {
            ____label: "Test Harness Plug-In Filter bodyFunction",
            ____description: "Developer-defined bodyFunction used to contruct a holodeck plug-in harness filter capable of processing test vectors through a holodeck runner filter instance.",
            ____accept: "jsFunction"
        }


    }
};
