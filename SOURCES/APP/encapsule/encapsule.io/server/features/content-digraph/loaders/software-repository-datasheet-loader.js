// software-repository-datasheet-loader.js

const arccore = require('arccore');
const softwareRepositoryDatasheetSpec = require('../../../common/iospecs/content/dev-input-content-software-repo-datasheet-spec');
var factoryResponse = arccore.filter.create({
    operationID: "3uxaQXuATImBdRj2OFprHA",
    operationName: "Software Repository Datasheet Filter",
    operationDescription: "Validates/normalizes a software repository datasheet view render request descriptor.",
    inputFilterSpec: softwareRepositoryDatasheetSpec
});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;
