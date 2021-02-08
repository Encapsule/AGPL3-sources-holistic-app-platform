// ObservableValue_T/artifact-space-mapping-filter.js

(function() {

    const arccore = require("@encapsule/arccore");

    const artifactSpaceRootLabel = "ipdXRMZHQSOO1w54nPGeZQ";

    const filterDeclaration = {
        operationID: "Z3quv46iTK6xPNwcLjAunQ",
        operationName: "ObservableValue_T Artifact Space Mapper",
        operationDescription: "Converts coordinate values germane to keeping track of different specializations of ObservableValue_T into a cellID and apmID tuple.",

        inputFilterSpec: {
            ____types: "jsObject",
            ____defaultValue: {},
            CM: { ____accept: [ "jsUndefined", "jsString" ] },
            APM: { ____accept: [ "jsUndefined", "jsString" ] },
            ACT: { ____accept: [ "jsUndefined", "jsString" ] },
            TOP: { ____accept: [ "jsUndefined", "jsString" ] }
        },

        outputFilterSpec: {
            ____label: "Artifact Space Mapping",
            ____types: "jsObject",
            CM: { ____accept: [ "jsUndefined", "jsString" ] },
            CMID: { ____accept: [ "jsUndefined", "jsString"] },
            APM: { ____accept: [ "jsUndefined", "jsString" ] },
            APMID: { ____accept: [ "jsUndefined", "jsString" ] },
            ACT: { ____accept: [ "jsUndefined", "jsString" ] },
            ACTID: { ____accept: [ "jsUndefined", "jsString" ] },
            TOP: { ____accept: [ "jsUndefined", "jsString" ] },
            TOPID: { ____accept: [ "jsUndefined", "jsString" ] }
        },

        bodyFunction: function(request_) {
            return ({
                error: null,
                result: {
                    ...request_,
                    CMID:  request_.CM?arccore.identifier.irut.fromReference(`${artifactSpaceRootLabel}.CellModel.${request_.CM}`).result:undefined,
                    APMID: request_.APM?arccore.identifier.irut.fromReference(`${artifactSpaceRootLabel}.CellModel.${request_.APM}`).result:undefined,
                    ACTID: request_.ACT?arccore.identifier.irut.fromReference(`${artifactSpaceRootLabel}.CellModel.${request_.ACT}`).result:undefined,
                    TOPID: request_.TOP?arccore.identifier.irut.fromReference(`${artifactSpaceRootLabel}.CellModel.${request_.TOP}`).result:undefined
                }
            });
        }

    };

    const factoryResponse = arccore.filter.create(filterDeclaration);
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result;

})();
