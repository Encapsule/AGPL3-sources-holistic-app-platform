// holodeck-program-run-program-filter.js

const arccore = require("@encapsule/arccore");


const factoryResponse = arccore.filter.create({
    operationID: "F_vVdpzhSIaV9D4HgqUfPA",
    operationName: "Holodeck::runProgram Method Filter",
    operationDescription: "Execute the specified holodeck program via RMDR-pattern.",

    inputFilterSpec: require("./iospecs/holodeck-method-run-program-input-spec"),
    outputFilterSpec: require("./iospecs/holodeck-method-run-program-output-spec"),

    bodyFunction: (runProgramRequest_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const holodeckInstance = runProgramRequest_.HolodeckInstance;

            // TODO: We need to pass a reference to holodeck environment down through MDR to enable recursion.
            // So... this is just a temporary shim
            response = holodeckInstance._private.holodeckHarnessDispatcher.request(runProgramRequest_)


            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
