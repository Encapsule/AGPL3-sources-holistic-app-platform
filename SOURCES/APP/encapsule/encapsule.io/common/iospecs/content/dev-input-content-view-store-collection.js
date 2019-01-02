// dev-input-content-view-store-collection.js

const pageContentDeveloperInputSpecGenerator = require('./page-content-developer-input-spec-generator-filter');
const viewRenderViewStoreCollectionSpec = require('../view/content-view-render-view-store-collection-spec');

var filterResponse = pageContentDeveloperInputSpecGenerator.request(viewRenderViewStoreCollectionSpec);
if (filterResponse.error)
    throw new Error(filterResponse.error);

module.exports = filterResponse.result;
