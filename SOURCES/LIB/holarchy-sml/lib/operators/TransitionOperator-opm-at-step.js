
const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.TransitionOperator({

    id: "9tNY7o5GTUGH_xda2GhP-w",
    name: "OPM In Step Expression Operator",
    description: "Returns Boolean true iff the indicated OPM instance is in the indicated process step.",
    operatorRequestSpec: {
        ____types: "jsObject",
        encapsule: {
            ____types: "jsObject",
            holarchySML: {
                ____types: "jsObject",
                operators: {
                    ____types: "jsObject",
                    opmi: {
                        ____types: "jsObject",
                        inStep: {
                            ____types: "jsObject",
                            path: {
                                ____accept: "jsString"
                            },
                            step: {
                                ____accept: "jsString"
                            }
                        }
                    }
                }
            }
        }
    },
    bodyFunction: function(request_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const message = request_.encapsule.holarchySML.operators.opmi.inStep;
            let fqpath = null;
            if (message.path.startsWith("#")) {
                fqpath = `${request_.context.namespace}${message.path.slice(1)}`;
            } else {
                fqpath = message.path;
            }
            const processStepNamespace = `${fqpath}.__opmStep`;
            const filterResponse = request_.ocdi.readNamespace(processStepNamespace);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            response.result = (filterResponse.result === message.step);
            break;
        }
        if (errors.length)
            response.error = errors.join(" ");
        return response;
    }
});

