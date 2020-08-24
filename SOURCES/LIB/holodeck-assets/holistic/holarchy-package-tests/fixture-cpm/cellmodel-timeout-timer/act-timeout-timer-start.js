// act-timeout-timer-start.js

const holarchy = require("@encapsule/holarchy");
const OCD = holarchy.ObservableControllerData;

module.exports =        {
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

};
