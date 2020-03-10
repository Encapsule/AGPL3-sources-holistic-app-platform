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

    runProgramRequest: {
        ____label: "Holodeck Program Request",
        ____opaque: true // we don't care what they send, we're going to route it through RMDR.
    }

};
