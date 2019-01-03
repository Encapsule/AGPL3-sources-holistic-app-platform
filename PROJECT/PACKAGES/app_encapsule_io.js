// PROJECT/PACKAGES/app_encapsule_io.js

const arccore = require('arccore');
const arccoreVersion = arccore.__meta.version;

const childProcess = require('child_process');

module.exports = {
    packageType: "application",
    packageEnvironments: [ "node/html5" ],
    packageManifestOverrides: {
        description: "This package contains the build sources of the Encapsule.io web application.",
        license: "MIT",
    },
    packageReadme: {
        summaryDescriptor: {
            heading: undefined,
            markdown: []
        },
        documentationDescriptor: {
            heading: undefined,
            markdown: []
        },
        bodySections: [
        ]
    }
};
