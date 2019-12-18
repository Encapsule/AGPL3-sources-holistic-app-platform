// ControllerAction-set-boolean-flag.js

const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.ControllerAction({
    id: "5rFEDGLYRSiZCeChMnkCHQ",
    name: "Set Boolean Flag",
    description: "Sets a Boolean flag in the OCD.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            sml: {
                ____types: "jsObject",
                action: {
                    ____types: "jsObject",
                    ocd: {
                        ____types: "jsObject",
                        setBooleanFlag: {
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

    actionResultSpec: { ____accept: "jsUndefined" }, // no result

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const message = request_.actionRequest.holarchy.sml.action.ocd.setBooleanFlag;
            let fqpath = null;
            // TODO: Move this to a library function and do a better job.
            if (message.path.startsWith("#")) {
                fqpath = `${request_.context.dataPath}${message.path.slice(1)}`;
            } else {
                fqpath = message.path;
            }
            const ocdResponse = request_.context.ocdi.writeNamespace(fqpath, true);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
            }
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    } // end bodyFunction
});
