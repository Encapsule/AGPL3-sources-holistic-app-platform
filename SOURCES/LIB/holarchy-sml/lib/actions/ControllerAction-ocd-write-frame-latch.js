
// ControllerAction-ocd-write-frame-latch.js

const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.ControllerAction({
    id: "iyvk_9vhRn2qvrjOes5v7Q",
    name: "Write Frame Latch",
    description: "Writes the value made observable by frame latch OPM instance.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            sml: {
                ____types: "jsObject",
                actions: {
                    ____types: "jsObject",
                    frameLatch: {
                        ____types: "jsObject",
                        write: {
                            ____types: "jsObject",
                            path: {
                                ____label: "Frame Latch Bound Namespace Path",
                                ____accept: "jsString"
                            },
                            value: {
                                ____label: "Write Value",
                                ____opaque: true
                            }
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____label: "Write Frame Latch Result",
        ____description: "This is generically a reference to the value written to the frame latch indicated by 'path'.",
        ____opaque: true
    },

    bodyFunction: function (request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const message = request_.actionRequest.holarchy.sml.actions.frameLatch.write;
            let rpResponse = holarchy.ObservableControllerData.dataPathResolve({
                opmBindingPath: request_.context.opmBindingPath,
                dataPath: message.path
            });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const opmBindingPath = rpResponse.result;
            const ocdResponse = request_.context.ocdi.writeNamespace(`${opmBindingPath}.value`, message.value);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const setClockResponse = request_.context.act({
                actorName: "Write Frame Latch",
                actorDescriptor: "Responsible for updating the state of a frame latch OPM instance.",
                actionRequest: {
                    holarchy: {
                        sml: {
                            actions: {
                                ocd: {
                                    setBooleanFlag: {
                                        path: "#.clock"
                                    }
                                }
                            }
                        }
                    }
                },
                opmBindingPath: opmBindingPath
            });
            if (setClockResponse.error) {
                errors.push(setClockResponse.error);
                break;
            }
            response.result = message.value;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});