// holodeck-harness-filter-base-input-spec.js
//
// Defines the base filter specification used by all holodeck harness filters regardless of their type and function.


module.exports = {
    ____types: "jsObject",

    context: {
        ____types: "jsObject",
        logRootDir: { ____accept: "jsString" },
        logCurrentDirPath: { ____types: "jsArray", ____defaultValue: [], directoryName: { ____accept: "jsString" }},
        programRequestPath: { ____types: "jsArray", ____defaultValue: [], requestPathToken: { ____accept: "jsString" }},
        config: {
            ____types: "jsObject",
            ____asMap: true,
            ____defaultValue: {},
            configName: { ____accept: "jsObject" /* TODO */ }
        }
    }

    /*
    programRequest: {
        ____opaque: true; // replaced by every specialization of harness.
    }
    */

};
