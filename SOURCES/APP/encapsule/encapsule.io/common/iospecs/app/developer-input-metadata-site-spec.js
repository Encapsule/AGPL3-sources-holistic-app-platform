// developer-input-metadata-site-spec.js

const holistic = require('holistic');
const holisticPackageLabel = holistic.__meta.name + " v" + holistic.__meta.version;

module.exports = {
    ____label: holisticPackageLabel + " Site Descriptor",
    ____description: "Information provided to the integration filters factory describing the website to be published.",
    ____types: "jsObject",
    name: {
        ____label: "Site Name",
        ____description: "A short name for the website.",
        ____accept: "jsString"
    },
    description: {
        ____label: "Site Description",
        ____description: "A short description of the website.",
        ____accept: "jsString"
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
