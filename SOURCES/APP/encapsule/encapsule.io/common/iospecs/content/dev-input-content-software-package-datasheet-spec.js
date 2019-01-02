// dev-input-content-software-package-datasheet-spec.js

const pageContentDeveloperInputSpecGenerator = require('./page-content-developer-input-spec-generator-filter');
const viewRenderSoftwarePackageDatasheetSpec = require('../view/content-view-render-software-package-datasheet-spec');

var filterResponse = pageContentDeveloperInputSpecGenerator.request(viewRenderSoftwarePackageDatasheetSpec);
if (filterResponse.error)
    throw new Error(filterResponse.error);

module.exports = filterResponse.result;
