// cpp-get-status-filter.js

const arccore = require("@encapsule/arccore");
const OCD = require("../../../../lib/ObservableControllerData");

const factoryResponse = arccore.filter.create({

    operationID: "EH_OsCUFT5eybmstGuNCyA",
    operationName: "Cell Process Proxy: Get CPP Memory & Status",
    operationDescription: "Retrieves a copy of a cell process proxy cell's OCD memory, that is returned to the caller along w/a status flag indicating the current status of this CPP cell instance.",

    inputFilterSpec: {
        ____types: "jsObject",

        apmBindingPath: { ____accept: "jsString" }, // may be the binding path of the proxy helper cell itself or the path of a parent cell

        proxyPath: {
            ____accept: [
                "jsUndefined", // apmBindingPath must be the path of the cell process proxy cell
                "jString" // the path of the cell process proxy is deduced via OCD.resolvePath from apmBindingPath and proxyPath
            ]
        },
        ocdi: { ____accept: "jsObject" }
    },

    outputFilterSpec: {
        ____types: "jsObject",
        data: { ____accept: "jsObject" },
        paths: {
            ____types: "jsObject",
            apmBindingPath: { ____accept: "jsString" },
            proxyPath: { ____accept: "jsString" },
            resolvedPath: { ____accept: "jsString" }
        },
        status: {
            ____accept: "jsString",
            ____inValueSet: [
                "connected",
                "disconnected",
                "broken"
            ]
        }
    },

    bodyFunction: function(request_) {
        const response = { error: null };
        const errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {

            inBreakScope = true;

            let ocdResponse = OCD.resolvePath({ apmBindingPath: request_.apmBindingPath, dataPath: request_.proxyPath});
            if (ocdResponse.error) {
                errors.push("Unable to resolve the path to the cell process proxy cell.");
                errors.push(`With apmBindingPath='${request_.apmBindingPath}' and dataPath='${request_.proxyPath}':`);
                errors.push(ocdResponse.error);
                break;
            }
            const proxyCellPath = ocdResponse.result;

            ocdResponse = request_.ocdi.getNamespaceSpec(proxyCellPath);
            if (ocdResponse.error) {
                errors.push("There isn't even a possibility of there being a cell process proxy (or anything actually) at the path specified for the cell process proxy cell.");
                errors.push(`With apmBindingPath='${request_.apmBindingPath}' and dataPath='${request_.proxyPath}' = '${proxyCellPath}':`);
                errors.push(ocdResponse.error);
                break;
            }

            const proxyMemorySpec = ocdResponse.result;

            if (!proxyMemorySpec.____appdsl && !proxyMemorySpec.____appdsl.apm) {
                errors.push("There isn't even a possibility of there being a cell process proxy (or even a cell) at the path specified for the cell process proxy cell because it has no APM binding.");
                errors.push(`With apmBindingPath='${request_.apmBindingPath}' and dataPath='${request_.proxyPath}' = '${proxyCellPath}':`);
                errors.push(ocdResponse.error);
            }

            if (proxyMemorySpec.____appdsl.apm !== "CPPU-UPgS8eWiMap3Ixovg") {
                errors.push("Invalid cell process proxy helper path resolves to cell that is not delcared as a cell process proxy cell!");
                errors.push(`With apmBindingPath='${request_.apmBindingPath}' and dataPath='${request_.proxyPath}' = '${proxyCellPath}':`);
                errors.push(ocdResponse.error);
            }

            // Okay. Now, we have established that the caller has provided an apmBindingPath and proxyPath inputs that
            // resolve to a cell that may or may not exist. Here we are being asked to retrieve the status of a cell presumed
            // to exist. So, if it doesn't that's an error.

            ocdResponse = request_.context.ocdi.readNamespace(proxyPath);
            if (ocdResponse.error) {
                errors.push("The specified cell process proxy helper does not exist!");
                errors.push("It is the responsibility of some hosting cell to manage the lifespan of its cell process proxy helpers.");
                errors.push(`With apmBindingPath='${request_.apmBindingPath}' and dataPath='${request_.proxyPath}' = '${proxyCellPath}':`);
            }

            const cppMemory = ocdResponse.result;

            response.result = {
                data: cppMemory,
                paths: {
                    apmBindingPath: request_.apmBindingPath,
                    proxyPath: request_.proxyPath,
                    resolvedPath: proxyPath
                },
                status: {
                    "[object Undefined]": "disconnected",
                    "[object Null]": "broken",
                    "[object String]": "connected"
                }[Object.prototype.toString.call(cppMemory.lcpConnect)]
            };
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return repsonse;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

