// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-process-create.js


const ControllerAction = require("../ControllerAction");

const controllerAction = new ControllerAction({
    id: "SdL0-5kmTuiNrWNu7zGZhg",
    name: "Cell Process Manager: Process Create",
    description: "Requests that the Cell Process Manager create a new cell process inside the CellProcessor runtime host instance.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                process: {
                    ____types: "jsObject",
                    create: {
                        ____types: "jsObject",
                        apmID: { ____accept: "jsString" },
                        initData: { ____opaque: true }
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____types: "jsObject",
        apmBindingPath: { ____accept: "jsString" }, // this is the OCD path of the new process
        cellProcessID: { ____accept: "jsString" } // this is an IRUT-format hash of the apmBindingPath
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("Cell Process Manager process create...");
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

