// ControllerAction-DisplayViewBase-link-display-process.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const cmLabel = require("./cell-label");
    const actionLabel = "linkDisplayProcess";
    const actionName = `${cmLabel}::${actionLabel}`;

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
                                            reactElement: {
                                                ____types: "jsObject",
                                                displayName: { ____accept: "jsString" },
                                                thisRef: { ____accept: "jsObject" }, // The React.Element sets thisRef to `this` inside its onComponentDidMount and componentWillUnmount methods.
                                                notifyEvent: {
                                                    ____accept: "jsString",
                                                    ____inValueSet: [
                                                        "display-process-activated",
                                                        "display-process-deactivating"
                                                    ]
                                                }
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

            // console.log(JSON.stringify(request_));
            return { error: null };

        }

    });

    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }

    module.exports = action;

})();

