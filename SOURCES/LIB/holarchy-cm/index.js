
// @encapsule/holarchy-cm package exports:

const holarchy = require("@encapsule/holarchy");

const packageMeta = require("./package");

module.exports = {

    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    CellModelTemplate: require("./CellModelTemplate"),


    // CellModelArtifactSpace class instance specialized for @encapsule/holarchy-cm package.
    cmasHolarchyCMPackage: require("./cmasHolarchyCMPackage"),

    // CellModelTemplate class instance for synthesizing value-type-specialized ObservableValue CellModel.
    cmtObservableValue: require("./ObservableValue_T"),

    ObservableValueProxy: require("./ObservableValueProxy"),

};
