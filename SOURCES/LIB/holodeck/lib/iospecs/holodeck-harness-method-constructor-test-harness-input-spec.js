// holodeck-harness-method-constructor-test-harness-input-spec.js

module.exports = {
    ____types: "jsObject", // This is 1 of N possible harness types that may be created.
    createTestHarness: {
        ____label: "Holodeck::constructor Create Test Harness Request",
        ____types: "jsObject",
        id: { ____accept: "jsString" }, // the ID of the harness - not a test vector sent through the harness
        name: { ____accept: "jsString" }, // the name of the harness
        description: { ____accept: "jsString" }, // the description of the harness
        testVectorRequestInputSpec: {
            ____label: "Test Harness Request (Vector) Request Spec",
            ____description: "Developer-defined request filter spec for the holodeck plug-in harness filter.",
            ____accept: "jsObject"
        }, // request signature of generated harness filter
        testVectorResultOutputSpec: {
            ____label: "Test Harness Result Spec",
            ____description: "Developer-defined response.result filter spec for the holodeck plug-in harness filter.",
            ____accept: "jsObject"
        }, // spec constrains a portion of the harness output
        harnessOptions: {
            ____types: "jsObject",
            ____defaultValue: {},
            idempotent: {
                ____accept: "jsBoolean",
                ____defaultValue: true
            },
            gitDiffHunkSize: {
                ____accept: "jsNumber",
                ____defaultValue: 0,
                ____inRangeInclusive: { begin: 0, end: 64 }
            }
        },
        harnessBodyFunction: {
            ____label: "Test Harness Plug-In Filter bodyFunction",
            ____description: "Developer-defined bodyFunction used to contruct a holodeck plug-in harness filter capable of processing test vectors through a holodeck runner filter instance.",
            ____accept: "jsFunction"
        }
    }
};
