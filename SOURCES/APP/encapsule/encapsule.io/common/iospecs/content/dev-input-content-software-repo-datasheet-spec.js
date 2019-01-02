// dev-input-content-software-repo-datasheet-spec.js

const pageContentDeveloperInputSpecGenerator = require('./page-content-developer-input-spec-generator-filter');
const viewRenderSoftwareRepoDatasheetSpec = require('../view/content-view-render-software-repository-datasheet-spec');

var filterResponse = pageContentDeveloperInputSpecGenerator.request(viewRenderSoftwareRepoDatasheetSpec);
if (filterResponse.error)
    throw new Error(filterResponse.error);

module.exports = filterResponse.result;
