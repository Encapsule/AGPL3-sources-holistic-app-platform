// TransitionOperator-ovh-map-is-empty.js

(function() {
    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const { cmLabel, cmDescription } = require("./cell-metadata");
    const operatorLabel = "mapIsEmpty";
    const operatorName = `${cmLabel}::${operatorLabel}`;
    const lib = require("./lib");
    const operator = new holarchy.TransitionOperator({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel, TOP: operatorLabel }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true if the ObservableValueHelperMap cell contains zero ObservableValueHelper cell(s) (aka signals).",
        operatorRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    operators: {
                        ____types: "jsObject",
                        ObservableValueHelperMap: {
                            ____types: "jsObject",
                            mapIsEmpty: {
                                ____types: "jsObject",
                                path: {
                                    ____accept: "jsString",
                                    ____defaultValue: "#"
                                }
                            }
                        }
                    }
                }
            }
        },
        bodyFunction: function(request_) {
            let response = { error: null, result: true };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                const messageBody = request_.operatorRequest.holarchy.common.operators.ObservableValueHelperMap.mapIsEmpty;
                let libResponse = lib.getStatus.request({ ...request_.context, path: messageBody.path });
                if (libResponse.error) {
                    errors.push(libResponse.error);
                    break;
                }
                let { cellMemory, ovhmBindingPath } = libResponse.result;
                response.result = (Object.keys(cellMemory.ovhMap).length === 0)?true:false;
                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });
    if (!operator.isValid()) {
        throw new Error(operator.toJSON());
    }
    module.exports = operator;
})();

