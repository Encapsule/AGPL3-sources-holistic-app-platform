// view-store-collection-loader.js

const arccore = require('arccore');
const viewStoreCollectionViewSpec = require('../../../../common/iospecs/view/content-view-render-view-store-collection-spec');
var factoryResponse = arccore.filter.create({
    operationID: "mmWFmpYYRUe7P6hWkdrWrg",
    operationName: "View Store Collection Loader",
    operationDescription: "Validates/normalizes a view collection render request.",
    inputFilterSpec: viewStoreCollectionViewSpec
});
if (factoryResponse.error)
    throw new Error(factoryRepsonse.error);

module.exports = factoryResponse.result;
