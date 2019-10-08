// app-state-controller-model-factory.js

const arccore = require("@encapsule/arccore");

// Accepts developer app state controller declaration input. Produces a DirectedGraph model of the app state controller.

var factoryResponse = arccore.filter.create({
    operationID: "XoPnz1p9REe-XO3mKGII3w",
    operationName: "App State Subcontroller Factory",
    operationDescription: "Accepts a declaration of an application state controller and produces a DirectedGraph-based model for inclusion in the application state system model.",
    inputFilterSpec: {
        ____label: "App State Subcontroller Factory Request",
        ____description: "Declaration of a application state controller's finite state machine model.",
        ____types: "jsObject",
        id: {
            ____label: "Controller ID",
            ____description: "A unique developer-assigned IRUT identifier. This value is used to bind controller data namespaces to observable process models.",
            ____accept: "jsString"
        },
        name: {
            ____label: "Controller Name",
            ____description: "A pascal-cased string name to be used to reference this specific controller in the context of the application state system model.",
            ____accept: "jsString"
        },
        description: {
            ____label: "Controller Description",
            ____description: "A short description of the function or subsystem that this controller models to help developers understand the application state system model partitioning.",
            ____accept: "jsString"
        },

        steps: {
            ____label: "Controller Steps Declaration",
            ____description: "An array of controller step descriptors that declare this controller's supported steps, transition conditions, and transition actions.",
            ____types: "jsArray",
            step: {
                ____label: "Controller Step Declaration",
                ____description: "Declaration of a specific controller step.",
                ____types: "jsObject",
                name: {
                    ____label: "Step Name",
                    ____description: "A unique name given to this controller step.",
                    ____accept: "jsString"
                },
                description: {
                    ____label: "Step Description",
                    ____description: "Optional short description of the purpose, significance, role, and/or semantic(s) of this step in this controller model.",
                    ____accept: [ "jsUndefined", "jsString" ]
                },
                actions: {
                    ____label: "Step Transition Actions",
                    ____description: "Optional worker subroutines (filters) registrations associated with this controller step.",
                    ____types: "jsObject",
                    ____defaultValue: {},
                    enter: {
                        ____label: "Step Enter Actions Vector",
                        ____description: "Array of zero or more step actor command objects to be passed to the step actor dispatcher.",
                        ____types: "jsArray",
                        ____defaultValue: [],
                        stateActorCommandDescriptor: {
                            ____label: "Step Enter State Actor Action",
                            ____description: "A state actor command descriptor object to dispatch to the app state actor subsystem when this step is entered.",
                            ____accept: [ "jsUndefined", "jsObject" ]
                        }
                    }, // enter
                    exit: {
                        ____label: "Step Exit Actions Vector",
                        ____description: "Array of zero or more state actor command objects to be passed to the state actor dispatcher.",
                        ____types: "jsArray",
                        ____defaultValue: [],
                        stepActorCommandDescriptor: {
                            ____label: "Step Exit State Actor Action",
                            ____description: "An optional inline state actor command descriptor object to dispatch to the app state actor subsywtem when this controller state is exitted.",
                            ____accept: [ "jsUndefined", "jsObject" ]
                        }
                    } // exit
                }, // actions
                transitions: {
                    ____label: "Controller Step Transition Rules",
                    ____description: "A priority queue of controller step transition rules used to determine if a transition should occur between this step and another, " +
                        "when this transition should occur (i.e. under what conditions), and what actions should be taken to exit the current step and enter another.",
                    ____types: "jsArray",
                    ____defaultValue: [],
                    transition: {
                        ____label: "Controller Step Transition Rule",
                        ____description: "Declaration of the conditions under which the controller should transition from one step to another step.",
                        ____types: "jsObject",
                        nextStep: {
                            ____label: "Target Step",
                            ____description: "The name of the controller step that the controller should transition to iff the transition operator returns Boolean true.",
                            ____accept: "jsString"
                        },
                        operator: {
                            ____label: "Transition Operator Declaration",
                            ____description: "A message request to a transition operator filter that evaluates to Boolean true iff a step transition should occur.",
                            ____accept: "jsObject"
                        }
                    } // transitionModel
                } // transitionsModel
            } // step
        } // steps
    },
    bodyFunction: function(request_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            var graphFactoryResponse = arccore.graph.directed.create({
                name: request_.name,
                description: request_.description
            });
            if (graphFactoryResponse.error) {
                errors.push("Error constructing directed graph container instance for subcontroller model.");
                errors.push(graphFactoryResponse.error);
                break;
            }
            var controllerModel = graphFactoryResponse.result;

            // Create vertices in the directed graph that represent the controller's set of finite states (called steps in an OPM).
            for (var stepDescriptor of request_.steps) {
                if (controllerModel.isVertex(stepDescriptor.name)) {
                    errors.push("Error while evaluating observable process model step declaration.");
                    errors.push("Invalid duplicate step declaration '" + stepDescriptor.name + "'.");
                    break;
                }
                controllerModel.addVertex({
                    u: stepDescriptor.name,
                    p: {
                        actions: stepDescriptor.actions
                    }
                });
            } // end for

            // Create the edges in the directed graph that represent the controller's finite state transition matrix.
            for (stepDescriptor of request_.steps) {
                // Evaluate each of the declared transition models.

                var transitionPriority = 0;

                for (var transitionModel of stepDescriptor.transitions) {

                    if (!controllerModel.isVertex(transitionModel.nextStep)) {
                        errors.push("Error while evalatuing step '" + stepDescriptor.name + "'.");
                        errors.push("Invalid transition model specifies unknown next step target '" + transitionModel.nextStep + "'.");
                        break;
                    }

                    var transitionEdgeDescriptor = {
                        e: {
                            u: stepDescriptor.name,
                            v: transitionModel.nextStep
                        },
                        p: {
                            priority: transitionPriority++,
                            operator: transitionModel.operator
                        }
                    };
                    controllerModel.addEdge(transitionEdgeDescriptor);
                } // end for transitionModel of stepDescriptor.transitions
            } // end for stepDescriptor of request_.steps

            if (errors.length) {
                break;
            }

            response.result = controllerModel;

            break;
        }

        if (errors.length) {
            errors.unshift("Error while evaluating subcontroller '" + request_.name + "' declaration.");
            response.error = errors.join(" ");
        }
        return response;
    },

    outputFilterSpec: {
        ____label: "Observable Process Model",
        ____description: "An @encapsule/arccore.graph.DirectedGraph container class instance reference that models a specific observable process.",
        ____accept: "jsObject"
    }

});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;

