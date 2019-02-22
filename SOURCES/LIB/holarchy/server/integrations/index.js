// sources/server/integrations/index.js

const packageMeta = require('../../../package.json');

const React = require('react');

const httpServerIntegrationsFactory = require('holism').integrations;

const metadataOrgGetFunction = require('./metadata-org-get');
const metadataOrgSpec = require('../../common/filter-specs/integrations/app-metadata-org-spec');

const metadataSiteGetFunction = require('./metadata-site-get');
const metadataSiteSpec = require('../../common/filter-specs/integrations/app-metadata-site-spec');

const metadataPageGetFunction = require('./metadata-page-get');
const metadataPageSpec = require('../../common/filter-specs/integrations/app-metadata-page-spec');

const metadataUserGetIdentityFunction = require('./metadata-user-get-identity');
const metadataUserIdentitySpec = require('../../common/filter-specs/integrations/app-metadata-user-identity-spec');

const metadataUserGetSessionFunction = require('./metadata-user-get-session');
const metadataUserSessionSpec = require('../../common/filter-specs/integrations/app-metadata-user-session-spec');

const htmlPageRenderFunction = require('./render-html');

module.exports = function(appStateContext_) { // <--- APPLICATION STATE STORE FROM THE APP

    var factoryResponse = httpServerIntegrationsFactory.create({
        filter_id_seed: "HHVPxkhOSkq56C903-GkQQ",
        name: packageMeta.author.name + "/" + packageMeta.name,
        version: packageMeta.version,
        description: packageMeta.description,
        appStateContext: appStateContext_, // <--- APPLICATION STATE STORE FROM THE APP
        platform: {
            document: {
                name: 'Facebook/react',
                version: React.version
            }
        },
        integrations: {
            metadata: {
                org: {
                    // Access the view store and retrieve organization metadata.
                    get: {
                        bodyFunction: metadataOrgGetFunction,
                        outputFilterSpec: metadataOrgSpec
                    }
                },
                site: {
                    // Access the view store and retrieve site metadata.
                    get: {
                        bodyFunction: metadataSiteGetFunction,
                        outputFilterSpec: metadataSiteSpec
                    }
                },
                page: {
                    // Acces the view store and retrieve page metadata.
                    get: {
                        bodyFunction: metadataPageGetFunction,
                        outputFilterSpec: metadataPageSpec
                    }
                },
                user: {
                    // Deserialize assertion of user identity and current user session from incoming HTTP request.
                    get_identity: {
                        bodyFunction: metadataUserGetIdentityFunction,
                        outputFilterSpec: metadataUserIdentitySpec
                    }, // get_identity
                    // Given an asserted user identity and use session, access the storage subsystem, verify that
                    // the session exists and is owned by the asserted user, and return a copy of the user's profile.
                    get_session: {
                        bodyFunction: metadataUserGetSessionFunction,
                        response: {
                            result_spec: metadataUserSessionSpec
                        } // response
                    } // get_session
                } // user
            }, // metadata
            render: {
                html: {
                    bodyFunction: htmlPageRenderFunction
                }
            }
        } // integrations
    });

    return factoryResponse;

};
