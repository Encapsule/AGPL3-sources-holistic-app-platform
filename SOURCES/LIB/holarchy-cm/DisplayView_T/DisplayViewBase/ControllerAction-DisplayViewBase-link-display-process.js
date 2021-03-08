// ControllerAction-DisplayViewBase-link-display-process.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const cmLabel = require("./cell-label");
    const actionLabel = "linkDisplayProcess";
    const actionName = `${cmLabel}::${actionLabel}`;
    const lib = require("./lib");

    const action = new holarchy.ControllerAction({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel, ACT: actionLabel }).result.ACTID,
        name: actionName,
        description: "Allows a mounted React.Element (what we call a display process) to communicate back to DisplayView family cell that manages the root of the VDOM React.Element tree they're mounted in.",
        actionRequestSpec: {
            ____types: "jsObject",
            ____description: "Sent from React.Component::didComponentMount/componentWillUnmount method implementation back to CellProcessor::act method using this.props.renderContext.apmBindingPath as the cell process target of the action request.",
            holistic: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    actions: {
                        ____types: "jsObject",
                        service: {
                            ____types: "jsObject",
                            html5: {
                                ____types: "jsObject",
                                display: {
                                    ____types: "jsObject",
                                    view: {
                                        ____types: "jsObject",
                                        linkDisplayProcess: {
                                            ____types: "jsObject",
                                            notifyEvent: {
                                                ____accept: "jsString",
                                                ____inValueSet: [
                                                    "display-process-activated",
                                                    "display-process-deactivating"
                                                ]
                                            },
                                            reactElement: {
                                                ____types: "jsObject",
                                                displayName: { ____accept: "jsString" },
                                                displayPath: { ____accept: "jsString" },
                                                thisRef: { ____accept: "jsObject" }, // The React.Element sets thisRef to `this` inside its onComponentDidMount and componentWillUnmount methods.
                                            }
                                        }
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

                const { cellMemory, cellProcess } = libResponse.result;

                const messageBody = request_.actionRequest.holistic.common.actions.service.html5.display.view.linkDisplayProcess;

                switch (messageBody.notifyEvent) {

                case "display-process-activated":

                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    console.log(`${actionName} received action request from ${messageBody.reactElement.displayName}!`);
                    console.log(`..... displayPath = "${messageBody.reactElement.displayPath}`);
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

                    /*
                    if (cellMemory.core.displayProcessLink) {
                        errors.push(`DisplayView cell at apmBindingPath="${request_.context.apmBindingPath}" is already linked to a display process with React.Element.displayName="${cellMemory.core.displayProcessLink.reactElement.displayName}". We presume you did not intend to do this?`);
                        break;
                    }
                    */
                    if (!cellMemory.core.displayProcessLink) {
                        cellMemory.core.displayProcessLink = {};
                    }

                    cellMemory.core.displayProcessLink[messageBody.reactElement.displayPath] = messageBody.reactElement;
                    break;

                case "display-process-deactivated":
                    if (!cellMemory.core.displayProcessLink) {
                        errors.push(`DisplayView cell at apmBindingPath="${request_.context.apmBindingPath}" is not currently linked to a display process. We presume you did not intend to do this?`);
                        break;
                    }
                    cellMemory.core.displayProcessLink = undefined; // reset to default
                    break;

                default:
                    errors.push("INTERNAL ERROR - unhandled switch case.");
                    break;
                }

                if (errors.length) {
                    break;
                }

                let ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.core.displayProcessLink" }, cellMemory.core.displayProcessLink);
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

    });

    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }

    module.exports = action;

})();

