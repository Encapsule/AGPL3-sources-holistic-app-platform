// markdown-content-loader.js

const arccore = require('arccore');

const markdownViewRenderRequestSpec = require('../../../common/iospecs/view/content-view-render-markdown-spec');

var factoryResponse = arccore.filter.create({
    operationID: "3qjUF9EhRD2JGWGUn3eiiw",
    operationName: "Markdown Content Loader",
    operationDescription: "Validates/normalizes a markdown view render request descriptor.",
    inputFilterSpec: markdownViewRenderRequestSpec
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
