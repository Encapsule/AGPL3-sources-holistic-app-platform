// software-library-datasheet-laoder.js

const arccore = require('arccore');
const softwareLibraryDatasheetSpec = require('../../../../common/iospecs/view/content-view-render-software-library-datasheet-spec');

var factoryResponse = arccore.filter.create({
    operationID: "kl3p3HInTreGO1pe4huScA",
    operationName: "Software Library Datasheet Loader",
    operationDescription: "Validates/normalizes a software library datasheet view render request.",
    inputFilterSpec: softwareLibraryDatasheetSpec
});
if (factoryResponse.error)
    throw new Error(factoryRepsonse.error);
module.exports = factoryResponse.result;
