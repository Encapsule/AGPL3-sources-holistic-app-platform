// developer-input-metadata-user-identity-spec.js

const holistic = require('holistic');
const holisticPackageLabel = holistic.__meta.name + " v" + holistic.__meta.version;

module.exports = {
    ____label: holisticPackageLabel + " User Identity Descriptor",
    ____description: "Object containing information asserting the identity of a user.",
    ____types: "jsObject",
    ____defaultValue: {},
    username_sha256: {
        ____label: "Unverified Username Hash Identifier",
        ____description: "The username encoded in the HTTP request iff present.",
        ____accept: "jsString",
        ____defaultValue: "anonymous"
    }, // username
    sessionID: {
        ____label: "Unverified User Session Hash Identifier",
        ____description: "The session token encoded in the HTTP request iff present.",
        ____accept: [ "jsNull", "jsString" ],
        ____defaultValue: null
    } // sesssion
};
