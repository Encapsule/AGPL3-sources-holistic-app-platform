// TransitionOperator-cpp-proxy-status.js

const arccore = require("@encapsule/arccore");
const ObservableControllerData = require("../../../lib/ObservableControllerData");
const TransitionOperator = require("../../../TransitionOperator");
const cppLib = require("./lib");

const transitionOperator = new TransitionOperator({
    id: "c-n6U_maQa23j9jWFDsgOw",
    name: "Cell Process Proxy: Proxy Status",
    description: "Returns Boolean true if the cell process proxy helper cell was logically connected to an owned local cell process that has been deleted.",
    operatorRequestSpec: {
        ____types: "jsObject",
        CellProcessor: {
            ____types: "jsObject",
            proxy: {
                ____types: "jsObject",
                proxyCoordinates: {
                    ____label: "Cell Process Proxy Helper Cell Coordinates Variant (Optional)",
                    ____accept: "jsString",
                    ____defaultValue: "#"
                },
                connect: {
                    ____types: "jsObject",
                    statusIs: {
                        ____accept: "jsString",
                        ____inValueSet: [ "connected", "disconnected", "broken" ]
                    }
                }
            }
        }
    },

    bodyFunction: function(request_) {
        const response = { error: null, result: false };
        const errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const messageBody = request_.operatorRequest.CellProcessor.proxy;

            if (arccore.identifier.irut.isIRUT(messageBody.proxyCoordinates).result) {
                errors.push("Cannot resolve location of the cell process proxy helper cell to link given a cell process ID!");
                break;
            }

            let ocdResponse = ObservableControllerData.dataPathResolve({ apmBindingPath: request_.context.apmBindingPath, dataPath: messageBody.proxyCoordinates });
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            let proxyHelperPath = ocdResponse.result;

            const cppLibResponse = cppLib.getStatus.request({ proxyHelperPath, ocdi: request_.context.ocdi });
            if (cppLibResponse.error) {
                errors.push(cppLibResponse.error);
                break;
            }

            // Okay - we're talking to an active CellProcessProxy helper cell.
            const cppMemoryStatusDescriptor = cppLibResponse.result;

            response.result = (cppMemoryStatusDescriptor.status === messageBody.connect.statusIs);
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (!transitionOperator.isValid()) {
    throw new Error(transitionOperator.toJSON());
}

module.exports = transitionOperator;
