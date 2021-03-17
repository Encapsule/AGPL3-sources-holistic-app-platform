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
                                                    "vd-root-activated",
                                                    "vd-child-activated",
                                                    "vd-deactivating",
                                           ]
                                            },
                                            reactElement: {
                                                ____types: "jsObject",
                                                // v--- THIS IS VERY CONFUSING --- IS THE RIGHT NAME OR SHOULD BE RELABLED FOR CLARITY?
                                                displayName: { ____accept: "jsString" }, // This is the cellModelLabel for the desired specialized member of the DisplayView_T family of CellModel.

                                                displayPath: { ____accept: "jsString" }, // 👁.displayInstanceX.displayInstanceY.displayInstanceZ...

                                                displayInstance: { ____accept: "jsString" },

                                                d2r2BusState: { ____accept: "jsString" },

                                                thisRef: { ____accept: "jsObject" }, // The React.Element sets thisRef to `this` inside its onComponentDidMount and componentWillUnmount methods so it's backing DisplayView_T cell can stream data to the component directly w/out re-render of the entire VDOM.
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
            ____types: "jsObject",
            ____defaultValue: {},
            displayViewProcess: {
                ____types: [ "jsNull", "jsObject" ],
                ____defaultValue: null,
                apmBindingPath: { ____accept: "jsString" }
            }
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

                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                console.log(`${actionName} received action request from ${messageBody.reactElement.displayName}!`);
                console.log(`..... displayPath = "${messageBody.reactElement.displayPath}`);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

                switch (messageBody.notifyEvent) {

                case "vd-root-activated":

                    if (cellMemory.core.viewDisplayProcess) {
                        errors.push(`We do not expect to be called with notifyEvent==="vd-root-activated" when this DisplayView family cell has already linked to a ViewDisplay family React.Element.`);
                        break;
                    } else {
                        // We expect this to be the root ViewDisplay React.Element of the display process layer of the HTML5 service.
                        cellMemory.core.viewDisplayProcess = messageBody.reactElement;
                        let ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.core.viewDisplayProcess" }, cellMemory.core.viewDisplayProcess);
                        if (ocdResponse.error) {
                            errors.push(ocdResponse.error);
                            break;
                        }
                        response.result = { displayViewProcess: { apmBindingPath: request_.context.apmBindingPath } };
                    }
                    break;

                case "vd-child-activated":

                    // We receive vd-child-activate to indicate that a React.Element's render method has called ViewDisplayProcess::mountSubViewDisplay method
                    // and is attempting to dynamically activate its backing ViewDisplay family cell in order to establish IPC.

                    // At this point we assume messageBody.reactElement.displayPath is assigned to the React.Element that called ViewDisplayProcess::mountSubViewDisplay method.
                    // messageBody.reactElement.displayInstance is assumed to be a unique key string value assigned by the React.Element via in-param to mountSubViewDisplay.
                    // And, we assume that this action is being dispatched on the DisplayView family cell that's linked to the React.Element's base ViewDisplayProcess.
                    // It is an error for the React.Element to call its ViewDisplayProcess::mountSubViewDisplay method w/duplicate displayInstance values --- they must be unique.
                    // And, if all checks out then we further know that the apmBindingPath of the DisplayView family cell that needs to be activated to back the dynamically
                    // mounted sub-ViewDisplay React.Element can be calculated. Possibly via a hack? But we can calculate it...

                    cellMemory.core.dynamicViewDisplayQueue.push(messageBody);

                    if (!cellMemory.inputs.displayViews[messageBody.reactElement.displayInstance]) {

                        cellMemory.inputs.displayViews[messageBody.reactElement.displayInstance] = {}; // Queue default activation of a new ObservableValueHelper

                        let ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.inputs.displayViews"}, cellMemory.inputs.displayViews);
                        if (ocdResponse.error) {
                            errors.push(ocdRepsonse.error);
                            break;
                        }
                        console.log(`> Queued activation of new ObservableValueHelper to manage subcription for displayPath="${cellMemory.core.viewDisplayProcess}".`);

                    }

                    let ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.core.dynamicViewDisplayQueue"}, cellMemory.core.dynamicViewDisplayQueue);
                    if (ocdResponse.error) {
                        errors.push(ocdResponse.error);
                        break;
                    }

                    break;

                case "vd-deactivating":
                    if (!cellMemory.core.viewDisplayProcess) {
                        errors.push(`DisplayView cell at apmBindingPath="${request_.context.apmBindingPath}" is not currently linked to a display process. We presume you did not intend to do this?`);
                        break;
                    }
                    cellMemory.core.viewDisplayProcess = undefined; // reset to default
                    break;

                default:
                    errors.push("INTERNAL ERROR - unhandled switch case.");
                    break;
                }

                if (errors.length) {
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

