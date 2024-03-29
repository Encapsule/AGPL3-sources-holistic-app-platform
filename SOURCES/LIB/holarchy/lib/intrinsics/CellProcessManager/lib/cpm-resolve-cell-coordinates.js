// cpm-resolve-cell-coordinates.js

const arccore = require("@encapsule/arccore");
const cellCoordinatesCache = require("./cpm-resolve-cell-process-coordinates-cache");
const resolveCellProcessCoordinates = require("./cpm-resolve-cell-process-coordinates");

(function() {

    const factoryResponse = arccore.filter.create({
        operationID: "0XCZSfBSRSuwYgeIfLHhVw",
        operationName: "cpmLib: Resolve Cell Coordindates",
        operationDescription: "Converts variant input type into a normalized cell coordinates descriptor object.",
        inputFilterSpec: {
            ____label: "Cell Coordinates Variant",
            ____types: "jsObject",
            coordinates: {
                ____label: "Cell Process Coordinates Variant",
                ____types: [
                    "jsString", // Either cellPath or cellProcessPath or cellProcessID.
                    "jsObject", // Raw cellplane coordinate descriptor object.
                ],
                apmID: { ____accept: "jsString" },
                instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }
            },
            ocdi: { ____accept: "jsObject" }
        },
        outputFilterSpec: {
            ____types: "jsObject",
            cellPath: { ____accept: "jsString" },
            cellPathID: { ____accept: "jsString" },
            apmID: { ____accept: "jsString" }
        },
        bodyFunction: (request_) => {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                let cpmLibResponse = resolveCellProcessCoordinates.request({ coordinates: request_.coordinates, ocdi: request_.ocdi });
                if (!cpmLibResponse.error) {
                    let resolvedCoordinates = cpmLibResponse.result;
                    response.result = { cellPath: resolvedCoordinates.cellProcessPath, cellPathID: resolvedCoordinates.cellProcessID, apmID: resolvedCoordinates.coordinates.apmID };
                    break;
                }
                if (!cellCoordinatesCache.isValidCellPath({ cellPath: request_.coordinates, ocdi: request_.ocdi })) {
                    errors.push(`Invalid cellPath '${request_.coordinates}'.`);
                    break;
                }
                let cache = cellCoordinatesCache.getCache({ ocdi: request_.ocdi });
                response.result = { cellPath: request_.coordinates, cellPathID: cache.byCellPath[request_.coordinates].cellPathID, apmID: cache.byCellPath[request_.coordinates].apmID };
                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    const resolveCellCoordinates = factoryResponse.result;

    module.exports = resolveCellCoordinates;

})();
