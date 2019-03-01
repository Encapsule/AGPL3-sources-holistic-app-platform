"use strict";

// .../server/integrations/index.js
var packageMeta = require("../../package.json");

var React = require("react");

var httpServerIntegrationsFactory = require("@encapsule/holism").integrations;

var metadataOrgGetFunction = require("./metadata-org-get");

var metadataOrgSpec = require("../../common/filter-specs/integrations/app-metadata-org-spec");

var metadataSiteGetFunction = require("./metadata-site-get");

var metadataSiteSpec = require("../../common/filter-specs/integrations/app-metadata-site-spec");

var metadataPageGetFunction = require("./metadata-page-get");

var metadataPageSpec = require("../../common/filter-specs/integrations/app-metadata-page-spec");

var metadataUserGetIdentityFunction = require("./metadata-user-get-identity");

var metadataUserIdentitySpec = require("../../common/filter-specs/integrations/app-metadata-user-identity-spec");

var metadataUserGetSessionFunction = require("./metadata-user-get-session");

var metadataUserSessionSpec = require("../../common/filter-specs/integrations/app-metadata-user-session-spec");

var htmlPageRenderFunction = require("./render-html");

module.exports = function (appStateContext_) {
  // <--- APPLICATION STATE STORE FROM THE APP
  var factoryResponse = httpServerIntegrationsFactory.create({
    filter_id_seed: "HHVPxkhOSkq56C903-GkQQ",
    name: packageMeta.name,
    version: packageMeta.version,
    description: packageMeta.description,
    appStateContext: appStateContext_,
    // <--- APPLICATION STATE STORE FROM THE APP
    platform: {
      document: {
        name: "Facebook/react",
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
          },
          // get_identity
          // Given an asserted user identity and use session, access the storage subsystem, verify that
          // the session exists and is owned by the asserted user, and return a copy of the user's profile.
          get_session: {
            bodyFunction: metadataUserGetSessionFunction,
            response: {
              result_spec: metadataUserSessionSpec // response

            } // get_session

          } // user

        }
      },
      // metadata
      render: {
        html: {
          bodyFunction: htmlPageRenderFunction
        }
      } // integrations

    }
  });
  return factoryResponse;
};