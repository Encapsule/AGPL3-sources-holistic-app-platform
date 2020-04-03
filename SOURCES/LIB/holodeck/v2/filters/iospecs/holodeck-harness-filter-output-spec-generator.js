// holodeck-harness-filter-base-output-spec.js


const holodeckHarnessFilterContextSpec = require("./holodeck-harness-filter-context-spec");


module.exports = function(pluginResultSpec_) {

    return {
        ____label: "Holodeck Harness Result",
        ____description: "Structure returned to Holodeck.runProgram method for further processing.",
        ____types: "jsObject",

        context: { ...holodeckHarnessFilterContextSpec },

        pluginResult: { ...pluginResultSpec_ },

        programRequest: {
            ____label: "Holodeck Subprogram Request",
            ____description: "Evaluation of a holodeck plug-in harness filter may produce a subprogram to be evaluated by holodeck environment using the environment context specified by //.context.",
            ____accept: [ "jsArray", "jsObject", "jsNull" ], // Holodeck will auto-flatten arrays into N harness requests w/shared context. And, then send the request(s) through RDMR to some specific tree of harness filter plug-ins for evaluation. So, no detailed spec needed here.
            ____defaultValue: null
        }

    };

};



