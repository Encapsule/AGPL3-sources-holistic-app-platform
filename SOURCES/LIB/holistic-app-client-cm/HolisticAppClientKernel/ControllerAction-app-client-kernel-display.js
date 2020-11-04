
const holarchy = require("@encapsule/holarchy");

const kernelConsoleStyles = {
    outerContainerDiv: [
        "position: fixed",
        "top: 0px",
        "left: 0px",
        "width: 100%",
        "height: 100%",
        "opacity: 0",
        "overflow: hidden",
        "padding: 1em",
        "font-family: Play",
        "font-size: 12pt",
        "color: black",
        "z-index: -1"
    ].join("; "),

    logMessageContainerDiv: [
        "margin-left: 0.5em",
        "margin-right: 0.5em",
        "padding-left: 0.5em",
        "padding-top: 0.25em",
        "padding-bottom: 0.25em",
        "font-family: 'Share Tech Mono'",
        "font-size: larger",
        "font-weight: bold",
        "color: #990000"
    ].join("; "),

};

let documentTitle = null;

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
                                message: {
                                    ____accept: "jsString",
                                    ____defaultValue: "N/A"
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

            const messageBody = request_.actionRequest.holistic.app.client.kernel._private.rootDisplayCommand;

            const rootDisplayDOMElement = document.getElementById("idAppClientKernelConsoleDisplay");
            if (!rootDisplayDOMElement) {
                errors.push("Unable to initialize the root display because document.getElementById('idAppClientKernelConsoleDisplay') failed to return a DOM element.");
                errors.push("This indicates that the holistic app server process did not render the HTML5 document as we expected. What is up w/that?");
                break;
            }

            switch (messageBody.command) {

            case "initialize":

                documentTitle = document.title;
                document.title = "Booting...";

                rootDisplayDOMElement.setAttribute("style", kernelConsoleStyles.outerContainerDiv);

                let innerHTML = `
<h2>App Client Kernel Console</h2>
<p><strong>@encapsule/holistic-app-client-cm v${holarchy.__meta.version}-${holarchy.__meta.codename} buildID ${holarchy.__meta.build}</strong><br/><br/></p>
`;
                rootDisplayDOMElement.innerHTML = innerHTML;

                break;

            case "show":
                rootDisplayDOMElement.animate(
                    [
                        { opacity: 1 }
                    ],
                    {
                        duration: 750,
                        fill: "forwards"
                    }
                );
                break;
            case "hide":
                rootDisplayDOMElement.animate(
                    [
                        { opacity: 0 }
                    ],
                    {
                        delay: 3500,
                        duration: 1000,
                        fill: "forwards",
                    }
                );
                document.title = documentTitle;
                break;
            case "log":
                const newLogMessageElement = document.createElement("div");
                newLogMessageElement.setAttribute("style", kernelConsoleStyles.logMessageContainerDiv);
                const newLogContent = document.createTextNode(messageBody.message);
                newLogMessageElement.appendChild(newLogContent);
                rootDisplayDOMElement.appendChild(newLogMessageElement);
                document.title = request_.context.ocdi.readNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.__apmiStep" }).result;
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

