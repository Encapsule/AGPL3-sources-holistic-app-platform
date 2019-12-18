
const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.TransitionOperator({
    id: "UeLs9PcASwuC7KR190eYhA",
    name: "OCD Boolean Flag Is Set",
    description: "Returns Boolean true iff the indicated Boolean flag namespace is true.",

    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            sml: {
                ____types: "jsObject",
                operators: {
                    ____types: "jsObject",
                    ocd: {
                        ____types: "jsObject",
                        isBooleanFlagSet: {
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

            const message = request_.operator.holarchy.sml.operators.ocd.isBooleanFlagSet;
            let fqpath = null;
            if (message.path.startsWith("#")) {
                fqpath = `${request_.context.namespace}${message.path.slice(1)}`;
            } else {
                fqpath = message.path;
            }

            const filterResponse = request_.context.ocdi.readNamespace(fqpath);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }

            response.result = (filterResponse.result === true);
            break;
        }
        if (errors.length)
            response.error = errors.join(" ");
        return response;
    }
});
