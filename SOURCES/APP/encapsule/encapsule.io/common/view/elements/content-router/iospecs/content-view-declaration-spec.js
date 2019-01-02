// content-view-declaration-spec.js
//
// Encapsule/arccore.filter specification defining the format
// of an Encapsule/holistic content view declaration.
// i.e. what a developer must define vs. the _registration_
// which is the normalized & extended form used internally
// by the holistic library implementation.

module.exports = {
    ____label: "Content View Router Declaration",
    ____description: "Defines the 1:1 relationship between an HTML render request and a React component responsible of transforming the request to HTML.",
    ____types: "jsObject",
    name: {
        ____label: "Content View Router Name",
        ____description: "A short human readable name to assign to the generated content router filter.",
        ____accept: "jsString"
    },
    description: {
        ____label: "Content View Router Description",
        ____description: "A short description of the function of the generated content router filter.",
        ____accept: "jsString"
    },
    dataBindingSpec: {
        ____label: "Content View Data Specification",
        ____description: "An Encapsule/arccore.filter specification defining the document content data format to route to the specified React component.",
        ____accept: "jsObject"
    },
    reactComponent: {
        ____label: "React Component Binding",
        ____description: "The destination React component responsible for rendering document content of type defined by `inputFilterSpec`.",
        ____accept: "jsFunction"
    }
};
