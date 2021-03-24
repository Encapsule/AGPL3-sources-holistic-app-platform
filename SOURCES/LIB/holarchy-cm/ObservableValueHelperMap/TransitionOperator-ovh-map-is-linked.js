// TransitionOperator-ovh-map-is-linked.js

(function() {
    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const { cmLabel, cmDescription } = require("./cell-metadata");
    const operatorLabel = "mapIsLinked";
    const operatorName = `${cmLabel}::${operatorLabel}`;
    const lib = require("./lib");
    const operator = new holarchy.TransitionOperator({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel, TOP: operatorLabel }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true if the ObservableValueHelperMap cell contains N > 0 ObservableValueHelper cell(s) (aka signals) AND ObservableValueHelper::isLinked === true for ALL N signal(s).",
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
                            mapIsLinked: {
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
            let response = { error: null, result: false };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const messageBody = request_.operatorRequest.holarchy.common.operators.ObservableValueHelperMap.mapIsLinked;

                let libResponse = lib.getStatus.request({ ...request_.context, path: messageBody.path });
                if (libResponse.error) {
                    errors.push(libResponse.error);
                    break;
                }
                let { cellMemory, ovhmBindingPath } = libResponse.result;

                let ovhOperatorTerms = [];

                let signalNames = Object.keys(cellMemory.ovhMap);
                while (signalNames.length) {
                    const signalName = signalNames.shift();
                    ovhOperatorTerms.push( { holarchy: { common: { operators:  { ObservableValueHelper: { isLinked: { path: `${messageBody.path}.ovhMap.${signalName}` } } } } } } );
                }

                const operatorRequestDescriptor = {
                    operatorRequest: { and: ovhOperatorTerms },
                    context: request_.context
                };

                let opResponse = request_.context.transitionDispatcher.request(operatorRequestDescriptor);
                if (opResponse.error) {
                    errors.push(opResponse.error);
                    break;
                }
                const operatorFilter = opResponse.result;

                opResponse = operatorFilter.request(operatorRequestDescriptor);
                if (opResponse.error) {
                    errors.push(opResponse.error);
                    break;
                }

                response.result = opResponse.result;

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

