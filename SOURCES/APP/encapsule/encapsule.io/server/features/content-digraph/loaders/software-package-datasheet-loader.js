// software-package-datasheet-loader.js

const arccore = require('arccore');

const softwarePackageDatasheetSpec = require('../../../common/iospecs/view/content-view-render-software-package-datasheet-spec');

var factoryResponse = arccore.filter.create({
    operationID: "ElchyaD0QPell27RYR96eQ",
    operationName: "Software Package Datasheet Loader",
    operationDescription: "Validates/normalizes a software package datasheet view render request.",
    inputFilterSpec: softwarePackageDatasheetSpec
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
