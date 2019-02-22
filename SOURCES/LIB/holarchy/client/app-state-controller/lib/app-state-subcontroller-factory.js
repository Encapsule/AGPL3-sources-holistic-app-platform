// app-state-controller-model-factory.js

const arccore = require('arccore');

// Accepts developer app state controller declaration input. Produces a DirectedGraph model of the app state controller.

var factoryResponse = arccore.filter.create({
    operationID: "XoPnz1p9REe-XO3mKGII3w",
    operationName: "App State Subcontroller Factory",
    operationDescription: "Accepts a declaration of an application state controller and produces a DirectedGraph-based model for inclusion in the application state system model.",
    inputFilterSpec: {
        ____label: "App State Subcontroller Factory Request",
        ____description: "Declaration of a application state controller's finite state machine model.",
        ____types: "jsObject",
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
        stateNamespace: {
            ____label: "State Namespace",
            ____description: "The ARCcore.filter namespace path of the mailbox in the app data store where this subcontroller's current state should be recorded for observation by other app subsystems.",
            ____accept: "jsString"
        },
        states: {
            ____label: "Controller States Declaration",
            ____description: "An array of controller state descriptors that declare this controller's supported states, transition conditions, and transition actions.",
            ____types: "jsArray",
            state: {
                ____label: "Controller State Declaration",
                ____description: "Declaration of a specific controller state.",
                ____types: "jsObject",
                name: {
                    ____label: "State Name",
                    ____description: "A unique name given to this controller state.",
                    ____accept: "jsString"
                },
                description: {
                    ____label: "State Description",
                    ____description: "Optional short description of the purpose, significance, role, and/or semantic(s) of this state in this controller model.",
                    ____accept: [ "jsUndefined", "jsString" ]
                },
                actions: {
                    ____label: "State Transition Actions",
                    ____description: "Optional worker subroutines (filters) registrations associated with this controller state.",
                    ____types: "jsObject",
                    ____defaultValue: {},
                    enter: {
                        ____label: "State Enter Actions Vector",
                        ____description: "Array of zero or more state actor command objects to be passed to the state actor dispatcher.",
                        ____types: "jsArray",
                        ____defaultValue: [],
                        stateActorCommandDescriptor: {
                            ____label: "State Enter State Actor Action",
                            ____description: "A state actor command descriptor object to dispatch to the app state actor subsystem when this state is entered.",
                            ____accept: [ "jsUndefined", "jsObject" ]
                        }
                    }, // enter
                    exit: {
                        ____label: "State Exit Actions Vector",
                        ____description: "Array of zero or more state actor command objects to be passed to the state actor dispatcher.",
                        ____types: "jsArray",
                        ____defaultValue: [],
                        stateActorCommandDescriptor: {
                            ____label: "State Exit State Actor Action",
                            ____description: "An optional inline state actor command descriptor object to dispatch to the app state actor subsywtem when this controller state is exitted.",
                            ____accept: [ "jsUndefined", "jsObject" ]
                        }
                    } // exit
                }, // actions
                transitions: {
                    ____label: "Controller State Transition Rules",
                    ____description: "A priority queue of controller state transition rules used to determine if a transition may occur between this state and another, " +
                        "when this transition should occur (i.e. under what conditions), and what actions should be taken to exit the current state and enter another.",
                    ____types: "jsArray",
                    ____defaultValue: [],
                    transition: {
                        ____label: "Controller State Transition Rule",
                        ____description: "Declaration of the conditions under which the controller should transition from one state to another state.",
                        ____types: "jsObject",
                        nextState: {
                            ____label: "Target State",
                            ____description: "The name of the controller state that the controller should transition to iff the transition operator returns Boolean true.",
                            ____accept: "jsString"
                        },
                        operator: {
                            ____label: "Transition Operator Declaration",
                            ____description: "A declarative specification of a Boolean expression that determines if a state transition should occur.",
                            ____accept: "jsObject"
                        }
                    } // transitionModel
                } // transitionsModel
            } // state
        } // states
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

            // Create vertices in the directed graph that represent the controller's set of finite states.
            for (var stateDescriptor of request_.states) {
                if (controllerModel.isVertex(stateDescriptor.name)) {
                    errors.push("Error while evaluating subcontroller state declarations.");
                    errors.push("Invalid duplicate state declaration '" + stateDescriptor.name + "'.");
                    break;
                }
                controllerModel.addVertex({
                    u: stateDescriptor.name,
                    p: {
                        actions: stateDescriptor.actions
                    }
                });
            } // end for

            // Create the edges in the directed graph that represent the controller's finite state transition matrix.
            for (var stateDescriptor of request_.states) {
                // Evaluate each of the declared transition models.

                var transitionPriority = 0;

                for (var transitionModel of stateDescriptor.transitions) {

                    if (!controllerModel.isVertex(transitionModel.nextState)) {
                        errors.push("Error while evalatuing state '" + stateDescriptor.name + "'.");
                        errors.push("Invalid transition model specifies unknown next state target '" + transitionModel.nextState + "'.");
                        break;
                    }

                    var transitionEdgeDescriptor = {
                        e: {
                            u: stateDescriptor.name,
                            v: transitionModel.nextState
                        },
                        p: {
                            priority: transitionPriority++,
                            operator: transitionModel.operator
                        }
                    };
                    controllerModel.addEdge(transitionEdgeDescriptor);
                } // end for transitionModel of stateDescriptor.transitions
            } // end for stateDescriptor of request_.states

            if (errors.length)
                break;

            // Attach the state namespace path (i.e. the namespace where this subcontroller's current state value will be written for observation by other subsystems)
            controllerModel.namespaceBindings = { stateNamespacePath: request_.stateNamespace };
            response.result = controllerModel;

            break;
        }

        if (errors.length) {
            errors.unshift("Error while evaluating subcontroller '" + request_.name + "' declaration.");
            response.error = errors.join(' ');
        }
        return response;
    },

    outputFilterSpec: {
        ____label: "Application State Controller Model",
        ____description: "A directed graph representation of an application state controller's finite state machine model.",
        ____accept: "jsObject"
    }

});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;

