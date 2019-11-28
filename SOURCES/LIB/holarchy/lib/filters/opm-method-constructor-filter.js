// opm-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

const inputFilterSpec = require("./iospecs/opm-method-constructor-input-spec");
const outputFilterSpec = require("./iospecs/opm-method-constructor-output-spec");

// Accepts developer app state controller declaration input. Produces a DirectedGraph model of the app state controller.

const factoryResponse = arccore.filter.create({
    operationID: "XoPnz1p9REe-XO3mKGII3w",
    operationName: "App State Subcontroller Factory",
    operationDescription: "Accepts a declaration of an application state controller and produces a DirectedGraph-based model for inclusion in the application state system model.",
    inputFilterSpec,
    outputFilterSpec,

    bodyFunction: function(request_) {
        let response = { error: null, result: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const irutCheckResponse = arccore.identifier.irut.isIRUT(request_.id);
            if (irutCheckResponse.error || !irutCheckResponse.result) {
                errors.push("Error validating developer-specified id. Not an IRUT:");
                if (irutCheckResponse.error) {
                    errors.push(irutCheckResponse.error);
                } else {
                    errors.push(irutCheckResponse.guidance);
                }
                break;
            }

            let filterFactoryResponse = arccore.filter.create({
                operationID: request_.id,
                operationName: "OPM Filter Spec Validator",
                operationDescription: "Validates the developer-defined opmDataSpec.",
                inputFilterSpec: request_.opmDataSpec
            });
            if (filterFactoryResponse.error) {
                errors.push("Error validating developer-specified OPM filter spec.");
                errors.push(filterFactoryResponse.error);
                break;
            }
            let opmDataFilter = filterFactoryResponse.result;

            let graphFactoryResponse = arccore.graph.directed.create({
                name: request_.name,
                description: request_.description
            });
            if (graphFactoryResponse.error) {
                errors.push("Error constructing directed graph container instance for subcontroller model.");
                errors.push(graphFactoryResponse.error);
                break;
            }
            let opmDigraph = graphFactoryResponse.result;

            // Create vertices in the directed graph that represent the controller's set of finite states (called steps in an OPM).
            for (let stepName_ in request_.steps) {
                let stepDescriptor = request_.steps[stepName_];
                if (opmDigraph.isVertex(stepName_)) {
                    errors.push("Error while evaluating observable process model step declaration.");
                    errors.push("Invalid duplicate step declaration '" + stepName_ + "'.");
                    break;
                }
                opmDigraph.addVertex({
                    u: stepName_,
                    p: {
                        actions: stepDescriptor.actions
                    }
                });
            } // end for

            // Create the edges in the directed graph that represent the controller's finite state transition matrix.
            for (let stepName_ in request_.steps) {
                let stepDescriptor = request_.steps[stepName_];
                // Evaluate each of the declared transition models.

                let transitionPriority = 0;

                for (let transitionModel of stepDescriptor.transitions) {

                    if (!opmDigraph.isVertex(transitionModel.nextStep)) {
                        errors.push("Error while evalatuing step '" + stepName_ + "'.");
                        errors.push("Invalid transition model specifies unknown next step target '" + transitionModel.nextStep + "'.");
                        break;
                    }

                    let transitionEdgeDescriptor = {
                        e: {
                            u: stepName_,
                            v: transitionModel.nextStep
                        },
                        p: {
                            priority: transitionPriority++,
                            operator: transitionModel.transitionIf
                        }
                    };
                    opmDigraph.addEdge(transitionEdgeDescriptor);
                } // end for transitionModel of stepDescriptor.transitions
            } // end for stepDescriptor of request_.steps

            if (errors.length) {
                break;
            }

            response.result = {
                declaration: request_,
                digraph: opmDigraph,
                opmDataFilter: opmDataFilter
            };

            break;
        }

        if (errors.length) {
            errors.unshift("Error while evaluating subcontroller '" + request_.name + "' declaration.");
            response.error = errors.join(" ");
        }
        return response;
    } // inputFilterSpec
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

