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
                                            reactElement: { // TODO: BAD NAME HERE IS THE ROOT OF CONFUSION -- This is an object that describes a complex assortment of stuff
                                                ____types: "jsObject",

                                                // v--- TODO: Take a close look at the semantics of "displayName" data stored in DisplayView and ensure we haven't conflated/badly named this? The moniker itself derives from React display lib.
                                                displayName: { ____accept: "jsString" }, // Clarify that the label gets used to in both the DisplayView and ViewDisplay

                                                displayPath: { ____accept: "jsString" }, // 👁.displayInstanceX.displayInstanceY.displayInstanceZ...

                                                displayInstance: { ____accept: "jsString" }, // TODO: CLARIFY

                                                d2r2BusState: { ____accept: "jsString" }, // TODO: CLARIFY

                                                displayViewAPMID: { ____accept: [ "jsUndefined", "jsString" ] }, // set if React.Element is mounted via ViewDisplayProcess::mountSubViewDisplay method

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

                    // This is a new dynamic ancestor (i.e. a sub display view of a sub display view...)
                    cellMemory.core.pendingViewDisplayQueue.push(messageBody);

                    let ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.core.pendingViewDisplayQueue"}, cellMemory.core.pendingViewDisplayQueue);
                    if (ocdResponse.error) {
                        errors.push(ocdResponse.error);
                        break;
                    }

                    break;

                    // ================================================================
                    // ================================================================
                    // ================================================================


                case "vd-deactivating":

                    // TODO: Haven't exercised this code path at all yet. It's not being hit yet. Shortly....

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

