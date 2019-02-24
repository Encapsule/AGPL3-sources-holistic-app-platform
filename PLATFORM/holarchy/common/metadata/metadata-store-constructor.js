// metadata-store-constructor.js

const metadataStoreConstructorFactory = require("./metadata-store-constructor-factory");

const developerInputMetadataOrgSpec = require("../filter-specs/integrations/developer-input-metadata-org-spec");
const developerInputMetadataSiteSpec = require("../filter-specs/integrations/developer-input-metadata-site-spec");
const developerInputMetadataPageSpec = require("../filter-specs/integrations/developer-input-metadata-page-spec");
const appMetadataPageSpec = require("../filter-specs/integrations/app-metadata-page-spec");

var factoryResponse = metadataStoreConstructorFactory.request({
    id: "ah4FS6AoQ_WxzZGC45mREg",
    name: "Application Metadata Constructor Filter Factory",
    description: "A filter that builds a filter that is used to build an instance of an application metadata store.",
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
