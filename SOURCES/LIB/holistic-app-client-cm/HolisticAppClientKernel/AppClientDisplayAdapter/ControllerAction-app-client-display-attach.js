// ControllerAction-app-client-display-attach.js

const holarchy = require("@encapsule/holarchy");

const controllerAction = new holarchy.ControllerAction({
    id: "KmTQwP8lQ9mi8hB-1pEIEw",
    name: "Holistic App Client Display Adapter: Initialize Display Layout",
    description: "Performs initial programmatic re-render of the display adapter's DIV target using d2r2 <ComponentRouter/> and a copy of the data used by the app server process to render the current static contents of the display adapter's DIV target element.",

    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                client: {
                    ____types: "jsObject",
                    display: {
                        ____types: "jsObject",
                        attach: {
                            ____accept: "jsObject"
                            // TODO
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

            // There can be only one display adapater process



            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;
