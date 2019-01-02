// dev-input-content-software-package-datasheet-spec.js

const pageContentDeveloperInputSpecGenerator = require('./page-content-developer-input-spec-generator-filter');
const viewRenderMarkdownSpec = require('../view/content-view-render-markdown-spec');

var filterResponse = pageContentDeveloperInputSpecGenerator.request(viewRenderMarkdownSpec);
if (filterResponse.error)
    throw new Error(filterResponse.error);

module.exports = filterResponse.result;
