
const holarchy = require("@encapsule/holarchy");
const holarchyCM = require("@encapsule/holarchy-cm").cml;
const OCD = holarchy.ObservableControllerData;

module.exports =         {
    id: "YEvlrqB8QAqTX2u9jTItDA",
    name: "Timeout Timer Cell Model",
    description: "Models an timeout timer service using an timeout timer process model. And, two ControllerActions.",
    apm: {

        id: "vWteGvhLQZq5C_OXd4p7Ig",
        name: "Timeout Timer Process Model",
        description: "Starts an timeout timer and tracks its async completion state.",

        ocdDataSpec: {
            ____types: "jsObject",
            construction: {
                ____types: "jsObject",
                timeoutMs: {
                    ____types: "jsNumber"
                }
            },
            private: {
                ____types: "jsObject",
                ____defaultValue: {},
                toJSON: { ____accept: "jsFunction", ____defaultValue: function() { return { timeoutTimer: { status: "running" } }; } },
                timeoutTimer: { ____accept: [ "jsNull",  "jsObject" ], ____defaultValue: null }
            },
            outputs: {
                ____types: "jsObject",
                ____defaultValue: {},
                timeoutEllapsed: {
                    ____accept: [ "jsNull", "jsNumber" ],
                    ____defaultValue: null
                }
            }
        }, // timeout timer OCD spec


        steps: {

            // ----------------------------------------------------------------
            uninitialized: {
                description: "Default step.",
                transitions: [
                    {
                        transitionIf: { always: true },
                        nextStep: "wait_timeout_timer"
                    }
                ],
                actions: {
                    exit: [
                        { startTimeoutTimer: {} }
                    ]
                }
            }, // uninitialized

            // ----------------------------------------------------------------
            wait_timeout_timer: {
                description: "Waiting for the timeout timer to complete.",
                transitions: [
                    { transitionIf: { holarchy: { cm: { operators: { ocd: { isNamespaceTruthy: { path: "#.outputs.timeoutEllapsed" } } } } } }, nextStep: "timeout_timer_expired" }
                ]
            }, // wait_timeout_timer

            // ----------------------------------------------------------------
            timeout_timer_expired: {
                description: "The specified timeout has ellapsed."
            } // timeout_timer_expired

        } // timeout timer steps
    }, // timeout timer apm

    actions: [

        {
            id: "HmyZa9CNQMuD6cRMa0FcfA",
            name: "Start Timeout Timer Action",
            description: "Starts a JavaScript timeout timer managed by the timeout timer cell process.",
            actionRequestSpec: {
                ____types: "jsObject",
                startTimeoutTimer: {
                    ____types: "jsObject"
                }
            },
            actionResultSpec: {
                ____types: "jsUndefined"
            },

            bodyFunction: function(request_) {

                let response = { error: null };
                let errors = [];
                let inBreakScope = false;
                while (!inBreakScope) {
                    inBreakScope = true;

                    // Attempt to read the cell process memory namespace.
                    let ocdResponse = request_.context.ocdi.readNamespace(request_.context.apmBindingPath);
                    if (ocdResponse.error) {
                        errors.push(ocdResponse.error);
                        break;
                    }
                    let cellMemory = ocdResponse.result;

                    const timeoutTimer = setTimeout(
                        function() {
                            console.log("YOOOOO!!!!");

                            const actionRequest = {
                                actorName: "External setTimeout Callback",
                                actorTaskDescription: "Process the timeout timer event.",
                                actionRequest: { completeTimeoutTimer: {} },
                                apmBindingPath: request_.context.apmBindingPath
                            };

                            let actionResponse = request_.context.act(actionRequest);
                            if (actionResponse.error) {
                                // TODO: We do not have any standard way of dealing with this sort of thing now.
                                throw new Error(actionResponse.error);
                            }

                            // and return to code we do not control
                        },
                        cellMemory.construction.timeoutMs
                    );

                    ocdResponse = OCD.dataPathResolve({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.private.timeoutTimer" });
                    if (ocdResponse.error) {
                        clearTimeout(timeoutTimer);
                        errors.push(ocdResponse.error);
                        break;
                    }

                    const pathTimeoutTimer = ocdResponse.result;

                    ocdResponse = request_.context.ocdi.writeNamespace(pathTimeoutTimer, timeoutTimer);
                    if (ocdResponse.error) {
                        clearTimeout(timeoutTimer);
                        errors.push(ocdResponse.error);
                        break;
                    }

                    break;
                }
                if (errors.length) {
                    response.error = errors.join(" ");
                }
                return response;
            }

        },

        {
            id: "VHByX1LLQSuKIAQW4Ws0Aw",
            name: "Complete Timeout Timer Expired Action",
            description: "Inform the timeout timer cell process that the timeout timer has expired; the time timeout has ellapsed.",

            actionRequestSpec: {
                ____types: "jsObject",
                completeTimeoutTimer: {
                    ____types: "jsObject"
                }
            },

            actionResultSpec: {
                ____types: "jsUndefined"
            },

            bodyFunction: function(request_) {

                let response = { error: null };
                let errors = [];
                let inBreakScope = false;
                while (!inBreakScope) {
                    inBreakScope = true;

                    // Attempt to read the cell process memory namespace.
                    let ocdResponse = request_.context.ocdi.readNamespace(request_.context.apmBindingPath);
                    if (ocdResponse.error) {
                        // This means that the cell process has been deleted and that its APM binding namespace no longer exists.
                        // But, this isn't really an error as we support the hard cancellation of an timeout timer process via cell process delete.
                        // So, no error. And, we're done.
                        break;
                    }
                    let cellMemory = ocdResponse.result;

                    cellMemory.private.timeoutTimer = null;
                    cellMemory.outputs.timeoutEllapsed = cellMemory.construction.timeoutMs;

                    ocdResponse = request_.context.ocdi.writeNamespace(request_.context.apmBindingPath, cellMemory);
                    if (ocdResponse.error) {
                        errors.push(ocdResponse.error);
                        break;
                    }
                    break;
                }
                if (errors.length) {
                    response.error = errors.join(" ");
                }
                return response;
            }

        }


    ],

    subcells: [ holarchyCM ]

} // timeout timer cell
