// cp-method-act-filter.js

const arccore = require("@encapsule/arccore");

const opcMethodActInputSpec = require("./iospecs/opc-method-act-input-spec");
const opcMethodActOutputSpec = require("./iospecs/opc-method-act-output-spec");

(function() {

    const filterDeclaration = {
        operationID: "izxx6c96QCu0g8jl6TjAlw",
        operationName: "CellProcessor::act Filter",
        operationDescription: "Executes a synchronous action request made by an external actor (some function/subsystem outside of CellProcessor).",
        inputFilterSpec: {
            ...opcMethodActInputSpec,
            ____label: "CellProcessor.act Method Request",
            ____description: "Defines the request format accepted by CellProcessor.act method."
        },
        outputFilterSpec: {
            ...opcMethodActOutputSpec,
            ____label: "CellProcessor.act Method Result",
            ____description: "Defines the result format returned by the CellProcessor.act method."
        },
        bodyFunction: function(externalActorRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                const actorName = `[${this.operationID}::${this.operationName}]`;
                const opcActResponse = externalActorRequest_.opcRef.act(externalActorRequest_);
                let opcActResponse2 = null;
                response = opcActResponse; // Change no external API behavior.
                break;
            } // while

            if (errors.length) {
                response.error = errors.join(" ");
            }

            return response;

        } // bodyFunction

    }; // filterDeclaration

    const factoryResponse = arccore.filter.create(filterDeclaration);
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }
    module.exports = factoryResponse.result;

})();
