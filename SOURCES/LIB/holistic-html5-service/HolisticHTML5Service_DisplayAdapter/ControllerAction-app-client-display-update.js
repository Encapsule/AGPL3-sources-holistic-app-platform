// ControllerAction-app-client-display-update.js

const holarchy = require("@encapsule/holarchy");
const hacdLib = require("./lib");
const React = require("react");
const ReactDOM = require("react-dom");

/// OH GOOD LORD --- Just realized I have been staring at this module when
/// when the _actual_ contract that matters really is in ControllerAction-pump...


const controllerAction = new holarchy.ControllerAction({
    id: "RlNHSKNBT32xejFqjsiZyg",
    name: "Holistic App Client Display Adapter: Update Display Layout",
    description: "Performs a programmatic re-rendering of the display adapter's DIV target using d2r2 <ComponentRouter/>.",

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
                        update: {
                            ____label: "Data-Driven React Render (d2r2) Command Request",
                            ____description: "Leverages an in-memory database of d2r2Component filter instances registered w/the holistic service's DisplayAdapter cell to dynamically bind thisProps to 1:N React.Component classes in order to synthesize a React.Element that is rendered via React to the targetDOMElement.",
                            ____types: "jsObject",

                            renderContext: {
                                ____label: "this.props.renderContext Overrides",
                                ____types: "jsObject",
                                ____defaultValue: {},
                                apmBindingPath: {
                                    ____accept: [
                                        "jsUndefined", // If not specified then this action will use its request_.context.apmBindingPath
                                        "jsString" // The apmBindingPath of the cell process to pass through to the root React.Element instead of request_.context.apmBindingPath
                                    ]
                                },
                                viewDisplayPath: { ____accept: "jsString" }
                            },

                            // v0.0.59-whitecoral --- DISABLE THIS FINALLY
                            /*
                            // ================================================================
                            // i.e. NEVER USE THIS UNTIL I HAVE TIME TO REMOVE THIS
                            // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                            renderData: {
                                // DEPRECATED
                                // The routable portion of this.props bound to a <ComponentRouter/> instance
                                ____accept: [
                                    "jsUndefined", // Prefer to use thisProps that will be made mandatory in a short time.
                                    // "jsObject" FORCE A VALIDATION ERROR TO SEE IF ANYONE IS USING THIS
                                ]
                            },
                            */

                            // ////////////////////////////////////////////////////////////////
                            // ================================================================
                            // v=== USE THIS INSTEAD! (NOTE YOU'RE RESPONSIBLE (ENTIRELY) FOR SETTING thisProps.renderData. AS THIS IS WHAT <ComponentRouter/> uses (exclusively) to route its this.props to 1:N of your registered d2r2 Components (aka React.Element generator filters).
                            thisProps: {
                                ____label: "Component Props",
                                ____description: "If specified, this is assumed to be the entirety of the actor's d2r2 render request descriptor bound to the <1:N/> resolved by <ComponentRouter/>. Note that you cannot influence the values sent via thisProps.renderContext except via overrides allowed by this request.",
                                ____accept: "jsObject",
                                ____defaultValue: { renderData: { forceDisplayError: "You didn't specify any renderData!" } }
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

            try {

                const actorName = `[${this.operationID}::${this.operationName}]`;
                const messageBody = request_.actionRequest.holistic.app.client.display.update;
                console.log(`${actorName} attempting add/remove active display processes via Data-Driven ReactDOM.render (@encapsule/d2r2).`);

                let hacdLibResponse = hacdLib.getStatus.request(request_.context);
                if (hacdLibResponse.error) {
                    errors.push(hacdLibResponse.error);
                    break;
                }
                const { cellMemory, cellProcess } = hacdLibResponse.result;

                switch (cellMemory.__apmiStep) {
                case "display-adapter-ready":
                case "display-adapter-wait-display-view":
                    break;
                default:
                    errors.push("This action may only be called once the app client display adapter process is in either \"display-adapter-ready\" or \"display-adapter-wait-display-view\" step.");
                    break;
                }

                let thisProps = {
                    ...messageBody.thisProps,
                    renderContext: {
                        // NOTE: serverRender Boolean flag is not set here; it is only ever set during initial server-side rendering and initial client-side display activation.
                        ComponentRouter: cellMemory.config.ComponentRouter,
                        act: request_.context.act,
                        apmBindingPath: messageBody.renderContext.apmBindingPath?messageBody.renderContext.apmBindingPath:request_.context.apmBindingPath
                    }
                };

                if (messageBody.renderData) {
                    thisProps.renderData = messageBody.renderData;
                }

                let reactElement = React.createElement(cellMemory.config.ComponentRouter, thisProps);
                ReactDOM.render(reactElement, cellMemory.config.targetDOMElement);

                cellMemory.displayUpdateCount += 1;
                const ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: cellProcess.apmBindingPath, dataPath: "#.displayUpdateCount" }, cellMemory.displayUpdateCount);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                console.log(`> d2r2/React display process update #${cellMemory.displayUpdateCount} completed.`);
                break;
            } catch (exception_) {
                errors.push("AN EXCEPTION OCCURRED INSIDE THE APP CLIENT DISPLAY ADAPATER UPDATE ACTION:");
                errors.push(exception_.message);
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
