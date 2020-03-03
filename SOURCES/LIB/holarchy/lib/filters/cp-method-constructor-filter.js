// cp-method-constructor-filter.js

const arccore = require("@encapsule/arccore");
const CellModel = require("../../CellModel");

const factoryResponse = arccore.filter.create({

    operationID: "7tYVAis3TJGjaEe-6DiKHw",
    operationName: "SoftwareCellProcessor::constructor Filter",
    operationDescription: "Filters request descriptor passed to SoftwareCellProcessor::constructor function.",

    inputFilterSpec: {

        ____label: "Software Cell Processor Descriptor",
        ____description: "A request object passed to the SoftwareCellProcessor ES6 class constructor function.",
        ____types: "jsObject",

        id: {
            ____label: "Processor ID",
            ____description: "A unique version-independent IRUT identifier used to identify this SoftwareModel.",
            ____accept: "jsString" // must be an IRUT
        },

        name: {
            ____label: "Processor Name",
            ____description: "A short name used to refer to this SoftwareCellProcessor.",
            ____accept: "jsString"
        },

        description: {
            ____label: "Processor Description",
            ____description: "A short description of this SoftwareCellProcessor's purpose and/or function.",
            ____accept: "jsString"
        },

        cellModel: {
            ____label: "App/Service Cell Model",
            ____description: "Either a CM descriptor or equivalent CellModel ES6 class instance.",
            ____accept: "jsObject" // further processed in bodyFunction
        },

        options: {
            ____label: "Options",
            ____description: "Optional behavioral overrides and runtime settings.",
            ____types: "jsObject",
            ____defaultValue: {}
        }

    },

    bodyFunction: (request_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while(!inBreakScope) {
            inBreakScope = true;

            const cellModel = (request_.cellModel instanceof CellModel)?request_.cellModel:new CellModel(request_.cellModel);
            if (!cellModel.isValid()) {
                errors.push("Invalid CellModel specified for constructor request path ~.cellModel:");
                errors.push(cellModel.toJSON());
                break;
            }

            let configResponse = cellModel.getCMConfig({ type: "APM" });
            if (configResponse.error) {
                errors.push("Unexpected internal error querying APM configuration of specified CellModel. Please report this error:");
                errors.push(configResponse.error);
            }
            const apmConfig = configResponse.result;

            let apmVariantFilterSpec = {
                ____label: "Cell Variant Descriptor",
                ____description: `Defines a single descriptor object that defines optional subnames for all registered APM's registered in CM [${cellModel.getID()}::${cellModel.getName()}].`,
                ____types: "jsObject",
                ____defaultValue: {}
            };

            for (let i = 0 ; i < apmConfig.length ; i++) {
                const apm = apmConfig[i];
                const apmID = apm.getID();
                const apmName = apm.getName();
                const apmFilterName = `[${apmID}::${apmName}]`;

                apmVariantFilterSpec[apm.getID()] = {
                    ____label: `${apmFilterName} Wrapper`,
                    ____description: `Optional wrapper descriptor for CM ${apmFilterName}.`,
                    ____types: [ "jsUndefined", "jsObject" ],
                    cell: {
                        ____label: `${apmFilterName} Instance`,
                        ____types: "jsObject",
                        ____appdsl: { apm: apmID } // I love this means of composition...
                    }
                };
            }


            response.result = apmVariantFilterSpec;






            break;
        }
        if (errors.length) {
            errors.unshift("Cannot construct CellProcessor due to error:");
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
