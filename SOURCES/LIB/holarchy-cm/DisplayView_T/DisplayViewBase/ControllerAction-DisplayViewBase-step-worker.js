// DisplayView_T/DisplayViewBase/ControllerAction-DisplayViewBase-step-worker.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const cmLabel = require("./cell-label");

    const actionLabel = "stepWorker";
    const actionName = `${cmLabel} Private Step Worker`;

    const lib = require("./lib");

    const action = new holarchy.ControllerAction({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel, ACT: actionLabel }).result.ACTID,
        name: actionName,
        description: "Implementation worker action for the DisplayViewBase CellModel.",

        actionRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    actions: {
                        ____types: "jsObject",
                        DisplayViewBase: {
                            ____types: "jsObject",
                            _private: {
                                ____types: "jsObject",
                                stepWorker: {
                                    ____types: "jsObject",
                                    action: {
                                        ____types: "jsString",
                                        ____inValueSet: [
                                            "noop",
                                            "initialize"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        actionResultSpec: {
            ____accept: "jsString",
            ____defaultValue: "okay"
        },

        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                let libResponse = lib.getStatus.request(request_.context);
                if (libResponse.error) {
                    errors.push(libResponse.error);
                    break;
                }

                let { cellMemory } = libResponse.result;

                const messageBody = request_.actionRequest.holarchy.common.actions.DisplayViewBase._private.stepWorker;

                let actResponse, ocdResponse;

                switch (messageBody.action) {

                case "noop":
                    break;

                case "initialize":

                    actResponse = request_.context.act({
                        actorName: actionName,
                        actorTaskDescription: "Attempting to write the initial output of this display view cell to our specialized ObservableValue cell...",
                        actionRequest: {
                            holarchy: {
                                common: {
                                    actions: {
                                        ObservableValue: {
                                            writeValue: {
                                                value: {
                                                    renderContext: {
                                                        apmBindingPath: request_.context.apmBindingPath,
                                                        displayPath: "👁"
                                                    }, // set
                                                    renderData: {} // reset to default values
                                                },
                                                path: "#.outputs.displayView"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        apmBindingPath: request_.context.apmBindingPath
                    });

                    if (actResponse.error) {
                        errors.push(actResponse.error);
                        break;
                    }

                    break;

                default:
                    break;

                } // end switch

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }

    });

    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }

    module.exports = action;

})();

