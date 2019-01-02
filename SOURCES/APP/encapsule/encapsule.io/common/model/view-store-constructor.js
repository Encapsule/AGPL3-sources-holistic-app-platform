// view-store-constructor.js

const holistic = require('holistic');
const holisticPackageLabel = holistic.__meta.name + " v" + holistic.__meta.version;

const viewStoreFilterFactory = require('./view-store-filter-factory');

const developerInputMetadataOrgSpec = require('../iospecs/app/developer-input-metadata-org-spec');
const developerInputMetadataSiteSpec = require('../iospecs/app/developer-input-metadata-site-spec');
const developerInputMetadataPageSpec = require('../iospecs/app/developer-input-metadata-page-spec');
const appMetadataPageSpec = require('../iospecs/app/app-metadata-page-spec');

var factoryResponse = viewStoreFilterFactory.request({
    id: "RtvKGytURjCGnaeD7scVIg",
    name: holisticPackageLabel + " View Model Declaration",
    description: "Developer defined information about the HTML page views supported by the application.",
    constraints: {
        metadata: {
            org_input_spec: developerInputMetadataOrgSpec,
            site_input_spec: developerInputMetadataSiteSpec,
            page_input_spec: developerInputMetadataPageSpec,
            page_output_spec: appMetadataPageSpec
        }
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
