
const holarchy = require("@encapsule/holarchy");
const holismMetadata = require("@encapsule/holism-metadata");

const cellModel = new holarchy.CellModel({
    id: "-mApjtHVTE2UpIANFJGaPQ",
    name: "Holistic App Commont Kernel: App Metadata Model",
    description: "Provides consistent access/query API on derived-application-specific static metadata for all cells in a holistic application.",
    apm: {
        id: "srjZAO8JQ2StYj07u_rgGg",
        name: "Holistic App Common Kernel: App Metadata Process",
        description: "Encapsulates query/read access to developer-specified holistic application static metadata digraph data for active cells in either server or client cellplanes.",
        ocdDataSpec: {
            ____label: "Holistic App Metadata",
            ____types: "jsObject",
            ____defaultValue: {},
            toJSON: { ____accept: "jsFunction", ____defaultValue: function() { return { noSerialize: true }; } },
            construction: {
                ____accept: "jsObject"
            },
            appMetadata: {
                ____accept: "jsObject",
                ____defaultValue: {} // TODO lock down and make construction values required for process activation.
            }
        }
    },
    actions: [],
    subcells: []
});

if (!cellModel.isValid()) {
    throw new Error(cellModel.toJSON());
}

module.exports = cellModel;
