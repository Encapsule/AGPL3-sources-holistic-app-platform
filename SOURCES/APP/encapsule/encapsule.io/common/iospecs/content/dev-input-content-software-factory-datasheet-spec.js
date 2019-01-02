// dev-input-content-software-factory-datasheet-spec.js

const pageContentDeveloperInputSpecGenerator = require('./page-content-developer-input-spec-generator-filter');
const viewRenderSoftwareFactoryDatasheetSpec = require('../view/content-view-render-software-factory-datasheet-spec');

var filterResponse = pageContentDeveloperInputSpecGenerator.request(viewRenderSoftwareFactoryDatasheetSpec);
if (filterResponse.error)
    throw new Error(filterRepsonse.error)

module.exports = filterResponse.result;

