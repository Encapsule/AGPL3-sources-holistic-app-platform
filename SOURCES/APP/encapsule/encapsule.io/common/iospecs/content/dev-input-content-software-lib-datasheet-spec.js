// dev-input-content-software-lib-datasheet-spec.js

const pageContentDeveloperInputSpecGenerator = require('./page-content-developer-input-spec-generator-filter');
const viewRenderSoftwareLibraryDatasheetSpec = require('../view/content-view-render-software-library-datasheet-spec');

var filterResponse = pageContentDeveloperInputSpecGenerator.request(viewRenderSoftwareLibraryDatasheetSpec);
if (filterResponse.error)
    throw new Error(filterRepsonse.error)

module.exports = filterResponse.result;

