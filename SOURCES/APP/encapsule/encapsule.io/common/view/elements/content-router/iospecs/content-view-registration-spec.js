// content-view-registration-spec.js
//
// Encapsule/arccore.filter specification defining the format
// of a content view registration (normalized and extended
// content view declaration).

const arccore = require('arccore');
const contentViewDeclarationSpec = require('./content-view-declaration-spec');

// Deep copy the source spec.
var contentViewRegistrationSpec = arccore.util.clone(contentViewDeclarationSpec);

// Override the top-level label metadata.
contentViewRegistrationSpec.____label = "Content View Router Registration";

// Extend the declaration with an IRUT identifier.
contentViewRegistrationSpec.id = {
    ____label: "Content View Router Identifier",
    ____description: "22-character IRUT identifier to assign to the generated content router filter.",
    ____accept: "jsString"
};

module.exports = contentViewRegistrationSpec;
