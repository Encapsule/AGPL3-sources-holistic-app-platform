"use strict";

// developer-input-metadata-site-spec.js
module.exports = {
  ____label: "Site Metadata",
  ____description: "Information provided to the integration filters factory describing the website to be published.",
  ____types: "jsObject",
  name: {
    ____label: "Application Name",
    ____description: "A short name for the website.",
    ____accept: "jsString"
  },
  description: {
    ____label: "Application Description",
    ____description: "A short description of the website.",
    ____accept: "jsString"
  },
  build: {
    ____label: "Application Build",
    ____description: "A copy of the build descriptor generated when this application was built and packaged for deployment.",
    ____types: "jsObject",
    buildTimestamp: {
      ____accept: "jsString"
    },
    buildCommitHash: {
      ____accept: "jsString"
    },
    buildCommitShortHash: {
      ____accept: "jsString"
    },
    buildID: {
      ____accept: "jsString"
    },
    buildConfig: {
      ____types: "jsObject",
      deployConfig: {
        ____types: "jsObject",
        appDeployEnvironment: {
          ____accept: "jsString",
          ____inValueSet: ["local", "development", "staging", "production"]
        },
        // TODO: The semantics and use of these variables in the runtime need to be carefully documented.
        appBaseUrl: {
          ____accept: "jsString"
        },
        appBasePath: {
          ____accept: "jsString"
        },
        appAuthDisabled: {
          ____accept: "jsBoolean"
        } // deploy config

      }
    },
    displayName: {
      ____description: "Copy of package.json `displayName` value.",
      ____accept: "jsString"
    },
    packageName: {
      ____description: "Copy of package.json `name` value.",
      ____accept: "jsString"
    },
    packageDescription: {
      ____description: "Copy of package.json `description` value.",
      ____accept: "jsString"
    },
    packageVersion: {
      ____description: "Copy of package.json `version` value.",
      ____accept: "jsString"
    },
    packageCodename: {
      ____description: "Copy of package.json `codename` value (tracks version of rainier-ux-base we're using).",
      ____accept: "jsString"
    },
    packageAuthor: {
      ____description: "Copy of package.json `author` value.",
      ____accept: "jsString"
    }
  },
  url: {
    ____label: "Site URL",
    ____description: "The public URL users will use to access the server instance.",
    ____accept: "jsString"
  },
  // TODO: Schematize the theme object!
  theme: {
    ____label: "Site Theme Descriptor",
    ____description: "Style and behavior customizations for the holistic view subsystem.",
    ____accept: "jsObject"
  }
};