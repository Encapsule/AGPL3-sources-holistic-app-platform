// apm-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

const inputFilterSpec = require("./iospecs/apm-method-constructor-input-spec");
const outputFilterSpec = require("./iospecs/apm-method-constructor-output-spec");

// Accepts developer app state controller declaration input. Produces a DirectedGraph model of the app state controller.

const factoryResponse = arccore.filter.create({
    operationID: "XoPnz1p9REe-XO3mKGII3w",
    operationName: "APM Constructor Request Processor",
    operationDescription: "Filter used to normalize the request descriptor object passed to AbstractProcessModel::constructor function.",
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
                errors.push("Error while validating developer-specified id. Not an IRUT:");
                if (irutCheckResponse.error) {
                    errors.push(irutCheckResponse.error);
                } else {
                    errors.push(irutCheckResponse.guidance);
                }
                break;
            }

            let filterFactoryResponse = arccore.filter.create({
                operationID: request_.id,
                operationName: "APM Filter Spec Validator",
                operationDescription: "Validates the developer-defined ocdDataSpec.",
                inputFilterSpec: request_.ocdDataSpec
            });
            if (filterFactoryResponse.error) {
                errors.push("Error while validating developer-specified ocdDataSpec value for APM:");
                errors.push(filterFactoryResponse.error);
                break;
            }
            let ocdDataFilter = filterFactoryResponse.result;

            request_.ocdDataSpec = ocdDataFilter.filterDescriptor.inputFilterSpec; // take the normalized version

            let graphFactoryResponse = arccore.graph.directed.create({
                name: `[${request_.id}::${request_.name}] APM Digraph`,
                description: request_.description
            });
            if (graphFactoryResponse.error) {
                errors.push("Error while constructing directed graph container instance for APM:");
                errors.push(graphFactoryResponse.error);
                break;
            }
            let apmDigraph = graphFactoryResponse.result;

            // Create vertices in the directed graph that represent the controller's set of finite states (called steps in an APM).
            for (let stepName_ in request_.steps) {
                let stepDescriptor = request_.steps[stepName_];
                if (apmDigraph.isVertex(stepName_)) {
                    errors.push("Error while evaluating APM step declaration:");
                    errors.push("Invalid duplicate step declaration '" + stepName_ + "'.");
                    break;
                }
                apmDigraph.addVertex({
                    u: stepName_,
                    p: {
                        description: stepDescriptor.description,
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

                    if (!apmDigraph.isVertex(transitionModel.nextStep)) {
                        errors.push("Error while evalatuing APM step '" + stepName_ + "' declaration:");
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
                    apmDigraph.addEdge(transitionEdgeDescriptor);
                } // end for transitionModel of stepDescriptor.transitions
            } // end for stepDescriptor of request_.steps

            if (errors.length) {
                break;
            }


            response.result = {
                declaration: request_,
                digraph: apmDigraph,
            };
            const vdid = arccore.identifier.irut.fromReference(response.result).result;
            response.result.vdid = vdid;

            break;
        }

        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    } // inputFilterSpec
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

