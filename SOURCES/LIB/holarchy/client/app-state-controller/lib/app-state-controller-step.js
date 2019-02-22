// app-state-controller-step.js

const arccore = require('arccore');

const transitionOperatorsDiscriminator = require('./toperators');

var processStepCount = 0;

var factoryResponse = arccore.filter.create({

    operationID: "KeJU6K_vS0OGWW9NJad35g",
    operationName: "Application State Controller:Step",
    operationDescription: "Performs a step operation on the application state system model.",

    inputFilterSpec: {
        ____types: "jsObject",
        appStateControllerModel: {
            ____accept: "jsObject"
        },
        appStateActorDispatcher: {
            ____label: "App State Actor Dispatcher",
            ____description: "A reference to the app state actor dispather discriminator filter.",
            ____accept: "jsObject"
        },
        appDataStore: {
            ____accept: "jsObject"
        }
    },

    bodyFunction: function(request_) {

        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            console.log(">>> BEGIN: APP STATE CONTROLLER STEP:  " + processStepCount);

            var result = [];

            var controllerMap = request_.appStateControllerModel.controllerMap;
            var controllerStateModels = request_.appStateControllerModel.controllerStateModels;

            var rowControllerNames = [];
            var rowControllerStateInitial = [];
            var rowControllerStateFinal = [];
            var rowControllerStateChange = [];

            // Iterate the subcontroller models.
            for (var digraphModel of controllerStateModels) {

                var controllerModelName = digraphModel.getGraphName();
                var currentState = controllerMap[controllerModelName].state;
                var currentStateNamespacePath = controllerMap[controllerModelName].stateNamespacePath;
                var transitionModelEdges = digraphModel.outEdges(currentState);
                var warnTerminalInitialState = ((currentState === 'uninitialized') && !transitionModelEdges.length);
                var stateType = (transitionModelEdges.length?((currentState === 'uninitialized')?'initial':'current'):'terminal')

                var transitionModels =
                    transitionModelEdges.map(function(edge_) { return ({ e: edge_, p: digraphModel.getEdgeProperty(edge_) }); }).sort(function(a_, b_) { return (a_.priority - b_.priority); });

                var transitionModelProcess = null;

                rowControllerNames.push(controllerModelName);
                rowControllerStateInitial.push(currentState);

                if (!transitionModels.length) {
                    var message = [];
                    message.push("..... Skip x " + controllerModelName + ":" + currentState + " (" + stateType + ").");
                    if (warnTerminalInitialState)
                        message.push(" ! Terminal initial state 'uninitialized'? Did you mean to do this?");
                    // console.log(message.join(' '));
                    rowControllerStateFinal.push(currentState);
                    rowControllerStateChange.push(false);

                    continue;
                } // end if

                // console.log("..... Evaluate - " + controllerModelName + ":" + currentState + " (" + stateType + "):");

                // Iterate over the subcontroller state's transition models.
                for (var transitionModel of transitionModels) {

                    const transitionOperatorRequest = {
                        context: {
                            appStateModel: request_.appStateControllerModel,
                            appDataStore: request_.appDataStore,
                            transitionOperatorsDiscriminator: transitionOperatorsDiscriminator
                        },
                        operator: transitionModel.p.operator
                    };

                    var transitionOperatorResponse = transitionOperatorsDiscriminator.request(transitionOperatorRequest);
                    // Transition operator errors are fatal because they should not normally occur.
                    if (transitionOperatorResponse.error) {
                        errors.push("While attempting to step subcontroller '" + controllerModelName + "':");
                        errors.push("Transition operator response error: " + transitionOperatorResponse.error);
                        errors.push("During evaluation of state transition model: '" + JSON.stringify(transitionModel) + "'");
                        break;
                    }

                    if (transitionOperatorResponse.result === true) {
                        // SUBCONTROLLER STATE TRANSITION
                        transitionModelProcess = transitionModel;
                    }

                    if (transitionModelProcess) {
                        // Transitions are evaluated in the order that they are declared in the subcontroller model.
                        // The first transition operator returning true is taken and subsequent transition operator(s) are ignored.
                        console.log("---> TRANSITION " +
                                    controllerModelName + ":" + transitionModel.e.u +
                                    " ---> " +
                                    controllerModelName + ":" + transitionModel.e.v
                                   );
                        break;
                    }

                } // end for transitionModels

                if (errors.length) {
                    rowControllerStateFinal.push("*ERROR*");
                    rowControllerStateChange.push(false);
                    break;
                }

                if (!transitionModelProcess) {
                    rowControllerStateFinal.push(currentState);
                    rowControllerStateChange.push(false);
                    continue; // on to evaluate the next subcontroller
                }

                // SUBCONTROLLER STATE TRANSITION

                var currentStateModel = digraphModel.getVertexProperty(currentState);

                var onCurrentStateExitFilterResponses = [];
                var onNextStateEnterFilterResponses = [];

                if (currentStateModel.actions.exit.length) {
                    for (var stateActorCommand_ of currentStateModel.actions.exit) {
                        var stateActorResponse = request_.appStateActorDispatcher.request(stateActorCommand_);
                        if (stateActorResponse.error) {
                            errors.push("While attempting to step subcontroller '" + controllerModelName + "':");
                            errors.push("During attempt to dispatch state exit action the actor filter dispatch failed:");
                            errors.push("Actor command: '" + JSON.stringify(stateActorCommand_) + "'");
                            errors.push("Actor error: " + stateActorResponse.error);
                            errors.push("Transition model: '" + JSON.stringify(transitionModelProcess) + "'");
                            break;
                        }
                        onCurrentStateExitFilterResponses.push(stateActorResponse);
                    }
                } // end if state exit action(s).
                if (errors.length) break;

                var nextState = transitionModelProcess.e.v;
                var nextStateModel = digraphModel.getVertexProperty(nextState);

                if (nextStateModel.actions.enter.length) {
                    for (var stateActorCommand_ of nextStateModel.actions.enter) {
                        var stateActorResponse = request_.appStateActorDispatcher.request(stateActorCommand_);
                        if (stateActorResponse.error) {
                            errors.push("While attempting to step subcontroller '" + controllerModelName + "':");
                            errors.push("During attempt to dispatch state enter action the actor filter dispatch failed:");
                            errors.push("Actor command: '" + JSON.stringify(stateActorCommand_) + "'");
                            errors.push("Actor error: " + stateActorResponse.error);
                            errors.push("Transition model: '" + JSON.stringify(transitionModelProcess) + "'");
                            break;
                        } // end if
                        onNextStateEnterFilterResponses.push(stateActorResponse);
                    } // end for
                } // end if state enter action(s)
                if (errors.length) break;

                // Project the new state to this subcontroller's state namespace in the app data store.
                var writeFilterResponse = controllerMap[controllerModelName].stateNamespaceWriteFilter.request({
                    appDataStore: request_.appDataStore,
                    writeData: nextState
                });

                if (writeFilterResponse.error) {
                    errors.push(writeFilterResponse.error);
                    break;
                }

                // Set the next state.
                controllerMap[controllerModelName].state = nextState;
                rowControllerStateFinal.push(nextState);
                rowControllerStateChange.push(true);
                result.push({
                    controller: controllerModelName,
                    transitionModel: transitionModelProcess,
                    exitFilterResponses: onCurrentStateExitFilterResponses,
                    enterFilterResponses: onNextStateEnterFilterResponses
                });

            } // for digraphModel of controllerStateModels

            if (errors.length) {
                console.log("! ABORTING APP STATE CONTROLLER STEP " + processStepCount + " DUE TO FATAL ERROR");
                break;
            }

            request_.appStateControllerModel.writeStepCountFilter.request({
                appDataStore: request_.appDataStore,
                writeData: processStepCount
            }); // best effort for now

            var control = arccore.identifier.irut.fromReference([
                processStepCount,
                "lTKqtYRqSHuisuHNVJEsAg",
                processStepCount,
                "9pZ3YJuFTvGGsRuYNqDz1Q",
                processStepCount
            ].join('')).result;

            request_.appStateControllerModel.writeStepControlFilter.request({
                appDataStore: request_.appDataStore,
                writeData: control
            }); // best effort for now


            /*
            for (var i = 0 ; i < rowControllerNames.length ; i++) {
                var controllerName = rowControllerNames[i];
                var controllerStateInitial = rowControllerStateInitial[i];
                var controllerStateFinal = rowControllerStateFinal[i];
                var controllerStateChange = rowControllerStateChange[i];
                var message = [];
                if (!controllerStateChange)
                    continue;
                message.push(controllerStateChange?'>':'-');
                message.push(controllerName + ":");
                message.push(controllerStateInitial);
                message.push(controllerStateChange?'>':'-');
                message.push(controllerStateFinal);
                message.push(controllerStateChange?'TRANSITION':'NO-OP');
                console.log(message.join(' '));
            }
            */

            console.log("<<< END: APP STATE CONTROLLER STEP: " + processStepCount++);

            response.result = result;
            break;
        }
        if (errors.length) {
            response.error = errors.join(' ');
            console.log("**********************************************************************");
            console.log("FATAL ERROR IN APP STATE CONTROLLER STEP " + processStepCount);
            console.log(response.error);
            console.log("**********************************************************************");
        }
        return response;
    },

    outputFilterSpec: {
        ____types: "jsArray",
        transition: {
            ____accept: "jsObject"
        }
    }

});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
