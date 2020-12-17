
const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");

(function() {

    const factoryResponse = arccore.filter.create({
        operationID: "J6fm3-uZRm21k0gSjJ2-Ow",
        operationName: "Holistic Service Core Kernel CellModel Factory",
        operationDescription: "Uses context available during construction of a HolisticServiceCore class instance to perform any specializations that may be required to adapt the behavior(s) of the service kernel (and by extension, its dependencies, and so on, and so on...).",
        inputFilterSpec: {
            ____accept: "jsObject" // TODO write some shit here
        },
        outputFilterSpec: {
            ____accept: "jsObject" // This is an @encapsule/holarchy CellModel that rolls up core CellModels that must be included in every holistic service instance (currently HolisticNodeService and HolisticTabService).
        },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                // ----------------------------------------------------------------
                const cellModel = new holarchy.CellModel({
                    id: "74npOB-3S8GEgHwdtWwHrg",
                    name: "Holistic App Common Kernel",
                    description: "Provides core kernel cell process models shared by the holistic app server and holistic app client application cell models.",
                    subcells: [
                        require("./AppMetadata"),
                        require("./ViewThemeProcessor")
                    ]
                });
                if (!cellModel.isValid()) {
                    errors.push(cellModel.toJSON());
                    break;
                }

                response.result = cellModel;
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

    module.exports = factoryResponse;



})();

