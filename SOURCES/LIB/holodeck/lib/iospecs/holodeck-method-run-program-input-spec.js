// holodeck-method-run-program-input-spec.js

module.exports = {
    ____label: "Holodeck::runProgram Request",
    ____types: "jsObject",

    // This reference is set by the calling Holodeck class instance overwriting any value specified by the caller of Holodeck::runProgram.
    HolodeckInstance: {
        ____label: "Holodeck Instance",
        ____description: "A reference to the calling Holodeck class instance's 'this'.",
        ____opaque: true
    },

    programVectors: {
        ____label: "Holodeck Vectors",
        ____description: "An array of holodeck vectors (object descriptor trees that are evaluated via recursive MDR-pattern via holodeck harness plug-in filters.",
        ____accept: [
            // In both cases below we ____accept w/out further verification because it would be redundant; MDR-pattern will sort it out and do the right thing or explain why not.
            "jsArray",  // If an array value is specified, it's assumed to be an array of holodeck vector request object descriptors.
            "jsObject", // If an object value is specified, it's assumed to be a holodeck vector request object descriptor.
        ]
    }

};
