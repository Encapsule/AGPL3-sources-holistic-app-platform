// software-library-datasheet-laoder.js

const arccore = require('arccore');
const softwareFactoryDatasheetSpec = require('../../../../common/iospecs/view/content-view-render-software-factory-datasheet-spec');

// Simple ingress filter
var factoryResponse = arccore.filter.create({
    operationID: "AW_WTFQORhCa22Elt5MuSw",
    operationName: "Software Factory Datasheet Loader",
    operationDescription: "Validates/normalizes a software factory datasheet view render request.",
    inputFilterSpec: softwareFactoryDatasheetSpec
});
if (factoryResponse.error)
    throw new Error(factoryRepsonse.error);
module.exports = factoryResponse.result;
