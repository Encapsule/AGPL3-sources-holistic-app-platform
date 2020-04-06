/*
  O       o O       o O       o
  | O   o | | O   o | | O   o |
  | | O | | | | O | | | | O | |
  | o   O | | o   O | | o   O |
  o       O o       O o       O
*/

// @encapsule/holarchy - the keystone of holistic app platform
// Copyright (C) 2020 Christopher D. Russell for Encapsule Project

const arccore = require("@encapsule/arccore");
const SimpleStopwatch = require("../util/SimpleStopwatch");
const logger = require("../util/holarchy-logger-filter");

const opcMethodActInputSpec = require("./iospecs/opc-method-act-input-spec");
const opcMethodActOutputSpec = require("./iospecs/opc-method-act-output-spec");

const factoryResponse = arccore.filter.create({
    operationID: "PgH0_QIhSs2c6nsw53uCjQ",
    operationName: "OPC Act Filter",
    operationDescription: "Implements OPC's algorithm for routing an action request from an actor through to a specific ControllerAction based on request signature. And, for then orchestrating the cellular processes hosted in the OPC so that they can respond to the action.",

    inputFilterSpec: opcMethodActInputSpec,
    outputFilterSpec: opcMethodActOutputSpec,

    bodyFunction: function(request_) {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        let initialActorStackDepth = 0; // default

        let stopwatch = new SimpleStopwatch("OPC::act");

        const opcRef = request_.opcRef;

        try {

            while (!inBreakScope) {
                inBreakScope = true;

                if (!opcRef.isValid()) {
                    // Retrieve just the error string, not the entire response.
                    errors.push("Zombie instance:");
                    errors.push(opcRef.toJSON().error);
                    break;
                }


                // Prepare the controller action plug-in filter request descriptor object.
                const controllerActionRequest = {
                    context: {
                        apmBindingPath: request_.apmBindingPath,
                        ocdi: opcRef._private.ocdi,
                        act: opcRef.act
                    },
                    actionRequest: request_.actionRequest
                };

                // Push the actor stack.
                initialActorStackDepth = opcRef._private.opcActorStack.length; // save the initial stack depth
                opcRef._private.opcActorStack.push({
                    actorName: request_.actorName,
                    actorTaskDescription: request_.actorTaskDescription
                });

                // Log the start of the action.
                logger.request({
                    opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name,
                           evalCount: opcRef._private.evalCount, frameCount: 0, actorStack: opcRef._private.opcActorStack },
                    subsystem: "opc", method: "act", phase: "prologue",
                    message: "START ACTION..."
                });

                logger.request({
                    opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name,
                           evalCount: opcRef._private.evalCount, frameCount: 0, actorStack: opcRef._private.opcActorStack },
                    subsystem: "opc", method: "act", phase: "body",
                    message: `ACTOR: ${request_.actorName}`
                });

                logger.request({
                    opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name,
                           evalCount: opcRef._private.evalCount, frameCount: 0, actorStack: opcRef._private.opcActorStack },
                    subsystem: "opc", method: "act", phase: "body",
                    message: `WANTS TO: ${request_.actorTaskDescription}`
                });

                // Dispatch the action on behalf of the actor.
                let actionResponse = null;
                try {
                    // Dispatch the actor's requested action.
                    actionResponse = opcRef._private.actionDispatcher.request(controllerActionRequest);
                    if (actionResponse.error) {
                        actionResponse = {
                            error: "ControllerAction request rejected by MDR phase 1 discrimintor. Bad request format; this request cannot be processed by any of the ControllerAction's registered.",
                            result: actionResponse.error
                        };
                    } else {
                        let actionFilter = actionResponse.result;

                        logger.request({
                            opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name,
                                   evalCount: opcRef._private.evalCount, frameCount: 0, actorStack: opcRef._private.opcActorStack },
                            subsystem: "opc", method: "act", phase: "body",
                            message: `Dispatching ControllerAction filter [${actionFilter.filterDescriptor.operationID}::${actionFilter.filterDescriptor.operationName}]...`
                        });

                        actionResponse = actionFilter.request(controllerActionRequest);
                        if (actionResponse.error) {
                            actionResponse = {
                                error: `ControllerAction request rejected by MDR phase 2 router. The selected ControllerAction filter [${actionFilter.filterDescriptor.operationID}::${actionFilter.filterDescriptor.operationName}] rejected the request with error: ${actionResponse.error}`,
                                result: actionResponse.error
                            };
                        }
                    }

                } catch (actionCallException_) {
                    errors.push("Handled exception during controller action dispatch: " + actionCallException_.message);
                    break;
                }

                // If a transport error occurred dispatching the controller action,
                // skip any futher processing (including a possible evaluation)
                // and return. Transport errors represent serious flaws in a derived
                // app/service that must be corrected. We skip possible evaluation
                // that would normally occur to make it simpler for developers to diagnose
                // the transport error.

                if (actionResponse.error) {
                    errors.push("Error dispatching controller action filter. Skipping any further evaluation.");
                    errors.push(actionResponse.error);
                    break;
                }

                // If no errors have occurred then there's by definition at least
                // one pending action on the actor stack. This is so because
                // controller actions may delegate to other controller actions via
                // re-entrant calls to ObservableProcessController.act method.
                // Such delegations are non-observable, i.e. they are atomic
                // with respect to OPC evaluation. So, we only re-evaluate when
                // we have finished the last of >= 1 controller action plug-in
                // filter delegations. And, this propogates the net effects of
                // the controller action as observed in the contained ocdi according

                let evaluateResponse = { error: null };

                if (opcRef._private.opcActorStack.length === 1) {

                    logger.request({
                        opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name,
                               evalCount: opcRef._private.evalCount, frameCount: 0, actorStack: opcRef._private.opcActorStack },
                        subsystem: "opc", method: "act", phase: "body",
                        message: "WAITING ON CELLS..."
                    });

                    // Evaluate is an actor too. It adds itself to the OPC actor stack.
                    // And is responsible itself for ensuring that it cleans up after
                    // itself no matter how it may fail.
                    evaluateResponse = opcRef._evaluate();
                    if (evaluateResponse.error) {
                        errors.push("Unable to evaluate OPC state after executing controller action due to error:");
                        errors.push(evaluateResponse.error);
                        break;
                    }
                }

                response.result = {
                    actionResult: actionResponse.result,
                    lastEvaluation: evaluateResponse.result
                };

                break;

            } // while (!inBreakScope)

            if (errors.length) {
                response.error = errors.join(" ");
            }

        } catch (exception_) {
            response.error = `ObservableProcessController.act (no-throw) caught an unexpected exception: ${exception_.message}`;
        }

        const timings = stopwatch.stop();

        if (!response.error) {

            logger.request({
                opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name,
                       evalCount: opcRef._private.evalCount, frameCount: 0, actorStack: opcRef._private.opcActorStack },
                subsystem: "opc", method: "act", phase: "epilogue",
                message: `ACTION COMPLETE in ${timings.totalMilliseconds} ms`
            });

        } else {

            logger.request({
                logLevel: "error",
                opc: { id: opcRef._private.id, iid: opcRef._private.iid, name: opcRef._private.name,
                       evalCount: opcRef._private.evalCount, frameCount: 0, actorStack: opcRef._private.opcActorStack },
                subsystem: "opc", method: "act", phase: "epilogue",
                message: `ERROR in ${timings.totalMilliseconds} ms: ${response.error}`
            });

        }

        // Check and maintain the OPC actor stack.
        if (opcRef.isValid()) {
            if (initialActorStackDepth !== opcRef._private.opcActorStack.length) {
                // Check and maintain the OPC actor stack.
                if ((initialActorStackDepth + 1) !== opcRef._private.opcActorStack.length) {
                    response.error = `Invariant assertion error: OPC.act actor stack depth off by ${opcRef._private.opcActorStack.length - initialActorStackDepth - 1}.`; // Nope
                } else {
                    opcRef._private.opcActorStack.pop();
                }
            }
        }

        return response;

    } // bodyFunction

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
