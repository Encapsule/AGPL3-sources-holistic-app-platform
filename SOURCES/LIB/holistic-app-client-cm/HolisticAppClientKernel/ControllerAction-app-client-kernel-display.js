
const holarchy = require("@encapsule/holarchy");

const controllerAction = new holarchy.ControllerAction({
    id: "Aw4XWmZGSn2TM8XWJr642g",
    name: "Holistic App Client Kernel: Root Display Command Processor",
    description: "Provides low-level access to the \"root display\" which is active during kernel boot. And, subsequently only if catastrophic error occurs in the derived app client process or its subprocesses that are not handled by the derived app.",

    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                client: {
                    ____types: "jsObject",
                    kernel: {
                        ____types: "jsObject",
                        _private: {
                            ____types: "jsObject",
                            rootDisplayCommand: {
                                ____types: "jsObject",
                                command: {
                                    ____accept: "jsString",
                                    ____inValueSet: [ "initialize", "show", "hide", "log" ],
                                    ____defaultValue: "log"
                                },
                                message: { ____accept: [ "jsUndefined", "jsString" ] }
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

            const messageBody = request_.actionRequest.holistic.app.client.kernel._private.rootDisplayCommand;

            const rootDisplayDOMElement = document.getElementById("idRootDisplay");
            if (!rootDisplayDOMElement) {
                errors("Unable to initialize the root display because document.getElementById('idRootDisplay') failed to return a DOM element.");
                errors("This indicates that the holistic app server process did not render the HTML5 document as we expected. What is up w/that?");
                break;
            }

            switch (messageBody.command) {
            case "initialize":
                let innerHTML = `<div>
<h1>Holistic App Client Kernel v${holarchy.__meta.version} ${holarchy.__meta.codename} buildID ${holarchy.__meta.buildID}</h1>
</div>`;
                rootDisplayDOMElement.innerHTML = innerHTML;
                break;
            case "show":
                break;
            case "hide":
                break;
            case "log":
                break;
            default:
                errors.push("Internal error: unhandled switch case.");
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

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;

