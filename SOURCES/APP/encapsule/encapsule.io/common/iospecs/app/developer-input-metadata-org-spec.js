// developer-input-metadata-org-spec.js

const packageMeta = require('../../../package.json');
const packageName = packageMeta.name + " v" + packageMeta.version;

module.exports = {
    ____label: packageName + " Organization Descriptor",
    ____description: "Information provided to the integration filters factory describing the publishing organization.",
    ____types: "jsObject",
    name: {
        ____label: "Org Name",
        ____description: "The name of the publishing organization.",
        ____accept: "jsString"
    },
    location: {
        ____label: "Org Location",
        ____description: "The geographic location of the organization.",
        ____accept: "jsString"
    },
    url: {
        ____label: "Org URL",
        ____description: "The full URL of the publishing organization's main website.",
        ____accept: "jsString"
    },
    social: {
        ____label:"Org Social Media",
        ____description: "Links to the organization's social media account(s).",
        ____types: "jsObject",
        twitterUrl: {
            ____label: "Org Twitter URL",
            ____description: "The full URL of your organization's Twitter account.",
            ____accept: "jsString"
        },
        githubUrl: {
            ____label: "Org GitHub Org URL",
            ____description: "The full URL of the organization's GitHub organization.",
            ____accept: "jsString"
        }
    },
    copyrightHolder: {
        ____label: "Org Copyright Holder",
        ____description: "Information about the organization's principal copyright holder.",
        ____types: "jsObject",
        name: {
            ____label: "Org Copyright Holder Name",
            ____description: "The name of the principal copyright holder of this application.",
            ____accept: "jsString"
        },
        twitterUrl: {
            ____label: "Org Copyright Holder URL",
            ____description: "A URL that links to the copyright holder's personal site.",
            ____accept: "jsString"
        },
        githubUrl: {
            ____label: "Org Copyright Holder GitHub URL",
            ____description: "A URL that links to the copyright holder's personal GitHub account.",
            ____accept: "jsString"
        }
    }
};
