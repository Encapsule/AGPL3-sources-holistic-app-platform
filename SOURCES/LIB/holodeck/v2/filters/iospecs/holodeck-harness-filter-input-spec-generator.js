// holodeck-harness-filter-input-spec-generator.js

const holodeckHarnessFilterContextSpec = require("./holodeck-harness-filter-context-spec");

module.exports = function(programCommandSpec_) {

    return {
        ____label: "Holodeck Harness Request",
        ____description: "Defines the outer format of all holodeck harness plug-in filter requests.",
        ____types: "jsObject",
        context: { ...holodeckHarnessFilterContextSpec },
        programRequest: {

            ____label: "Holodeck Program Request",
            ____description: "A holodeck program request descriptor object to be evaluated via a holodeck harness plug-in filter call.",
            ____types: "jsObject",

            id: {
                ____label: "Program Request ID",
                ____description: "A unique IRUT ID used to identify this program request object.",
                ____accept: "jsString"
            },
            name: {
                ____label: "Program Request Name",
                ____description: "A short descriptive name to be used in log files.",
                ____accept: "jsString"
            },
            description: {
                ____label: "Program Request Description",
                ____description: "A short description of the program request (e.g. what it does in brief/why).",
                ____accept: "jsString"
            },

            ...programCommandSpec_ // is defined by each specific type of harness factory

        }
    };

};
