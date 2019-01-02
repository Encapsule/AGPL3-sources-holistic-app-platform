// page-content-developer-input-spec-generator-filter.js
//
// We want to display some content via an HTML page. The format of the content data passed
// to the server & client-side HTML rendering subsystem is specified by a filter specification
// stores in ./sources/common/iospecs/view
//
// TODO: This still needs more thought...

const arccore = require('arccore');

const developerInputPageMetadataSpec = require('../app/developer-input-metadata-page-spec');

var factoryResponse = arccore.filter.create({
    operationID: "r4k0e8MgR-iWQMCdwK2wjQ",
    operationName: "Developer Page Content Filter Specification Generator",
    operationDescription: "Combines a developer-defined view specification with the developer-defined page metadata descriptor to create the filter specification used to validate/normalize developer-defined content graph descriptor objects.",
    inputFilterSpec: {
        ____label: "View Content Spec",
        ____description: "A reference to the view filter specification that defines the content format for display.",
        ____accept: "jsObject"
    },
    outputFilterSpec: {
        ____label: "Developer Page Content Filter Specification",
        ____description: "The view specification combined with the page metadata specification.",
        ____accept: "jsObject"
    },
    bodyFunction: function(request_) {
        var developerPageContentFilterSpecification = {
            ____types: "jsObject",
            contentData: request_,
            pageMetadata: developerInputPageMetadataSpec
        };
        return { error: null, result: developerPageContentFilterSpecification };
    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;

