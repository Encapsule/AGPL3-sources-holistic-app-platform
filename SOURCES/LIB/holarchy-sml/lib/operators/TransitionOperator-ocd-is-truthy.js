
const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.TransitionOperator({
    id: "kD1PcgqYQlm7fJatNG2ZsA",
    name: "OCD Namespace Is Truthy",
    description: "Returns Boolean true iff the indicated OCD namespace is truthy.",

    operatorRequestSpec: {
        ____types: "jsObject",
        encapsule: {
            ____types: "jsObject",
            holarchySML: {
                ____types: "jsObject",
                operators: {
                    ____types: "jsObject",
                    ocdi: {
                        ____types: "jsObject",
                        isTruthy: {
                            ____types: "jsObject",
                            path: {
                                ____accept: "jsString"
                            }
                        }
                    }
                }
            }
        }
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const message = request_.encapsule.holarchySML.operators.ocdi.isTruthy;
            let fqpath = null;
            if (message.path.startsWith("#")) {
                fqpath = `${request_.context.namespace}${message.path.slice(1)}`;
            } else {
                fqpath = message.path;
            }

            const filterResponse = request_.context.ocdi.readNamespace(fqpath);
            if (filterResponse.error) {
                errors.push(filterRepsonse.error);
                break;
            }

            response.result = (filterResponse.result)?true:false;
            break;
        }
        if (errors.length)
            response.error = errors.join(" ");
        return response;
    }
});
