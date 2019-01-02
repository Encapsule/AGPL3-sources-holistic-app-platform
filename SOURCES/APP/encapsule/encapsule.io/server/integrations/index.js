// sources/server/integrations/index.js

const React = require('react');

const holistic = require('holistic');
const holisticLabel = holistic.__meta.name + " v" + holistic.__meta.version;

const httpServerIntegrationsFactory = require('holism').integrations;

const metadataOrgGetFunction = require('./metadata-org-get');
const metadataOrgSpec = require('../../common/iospecs/app/app-metadata-org-spec');

const metadataSiteGetFunction = require('./metadata-site-get');
const metadataSiteSpec = require('../../common/iospecs/app/app-metadata-site-spec');

const metadataPageGetFunction = require('./metadata-page-get');
const metadataPageSpec = require('../../common/iospecs/app/app-metadata-page-spec');

const metadataUserGetIdentityFunction = require('./metadata-user-get-identity');
const metadataUserIdentitySpec = require('../../common/iospecs/app/app-metadata-user-identity-spec'); // defines the output format of metadataUserGetIdentityFunction

const metadataUserGetSessionFunction = require('./metadata-user-get-session');
const metadataUserSessionSpec = require('../../common/iospecs/app/app-metadata-user-session-spec'); // defines the output format of metadataUserGetSessionFunction

const htmlPageRenderFunction = require('./render-html');

module.exports = function(appStateContext_) { // <--- APPLICATION STATE STORE FROM THE APP

    var factoryResponse = httpServerIntegrationsFactory.create({
        filter_id_seed: "WNWp54D7Ru2rWAqFBIxHkw",
        name: holistic.__meta.name,
        version: holistic.__meta.version,
        description: "Developer-defined integration filter definitions used to abstract HTTP server access to app-specific data & functions.",
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
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }
    return factoryResponse.result; // HTTP server filter integration descriptor object
};
