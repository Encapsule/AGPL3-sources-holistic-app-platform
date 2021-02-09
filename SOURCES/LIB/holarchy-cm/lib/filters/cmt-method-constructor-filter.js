// cmt-method-constructor-filter.js

(function() {

    const arccore = require("@encapsule/arccore");
    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");

    const factoryResponse = arccore.filter.create({
        operationID: cmasHolarchyCMPackage.mapLabels({ OTHER: "CellModelTemplate::constructor Filter" }).result.OTHERID,
        operationName: "CellModelTemplate::constructor Filter",
        operationDescription: "Processes the request value passed to CellModelTemplate::constructor function.",
        inputFilterSpec: require("./iospecs/cmt-method-constructor-input-spec"),
        outputFilterSpec: {
            // WIP
            ____types: "jsObject",
            spaceLabel: { ____accept: "jsString" },
            synthesizeCellModelMethodFilter: { ____accept: "jsObject" } // This will be an @encapsule/arccore.filter object.
        },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const spaceLabel = (request_.cmasScope instanceof holarchy.CellModelArtifactSpace)?request_.cmasScope.getArtifactSpaceLabel():request_.cmasScope.spaceLabel;


                let factoryResponse2 = arccore.filter.create({
                    operationID: cmasHolarchyCMPackage.mapLabels({ OTHER: "CellModelTemplate::synthesizeCellModel Filter" }).result.OTHERID,
                    operationName: "CellModelTemplate::synthesizeCellModel Filter",
                    operationDescription: "Processes the request value passed to CellModelTemplate::synthesizeCellModel method.",
                    inputFilterSpec: {
                        ____label: "CellModelTemplate::synthesizeCellModel Request",
                        ____description: "A request descriptor object specifying the CellModelTemplate-instance-specific specializations to be used to synthesize a new CellModel.",
                        ____types: "jsObject",

                    },
                    outputFilterSpec: {
                        ...holarchy.appTypes.CellModel.constructorRequest,
                        ____label: "CellModelTemplate::synthesizeCellModel Result",
                        ____description: "A @encapsule/holarchy CellModel::constructor request descriptor object synthesized by this filter."
                    },
                    bodyFunction: function(request_) {

                        return { error: null, result: {} };

                    }
                });

                if (factoryResponse2.error) {
                    errors.push(factoryResponse2.error);
                    break;
                }

                const synthesizeCellModelMethodFilter = factoryResponse2.result;

                response.result = { spaceLabel, synthesizeCellModelMethodFilter };

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

    module.exports = factoryResponse.result;

})();

