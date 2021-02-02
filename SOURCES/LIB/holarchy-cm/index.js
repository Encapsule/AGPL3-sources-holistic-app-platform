
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

    factories: {

        makeObservableValueCellModel: require("./HolarchyCommon_ObservableValue/cellmodel-factory-filter"),
        makeValueObserverCellModel:   require("./HolarchyCommon_ValueObserver/cellmodel-factory-filter")

    }

};
