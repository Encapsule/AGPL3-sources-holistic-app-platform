
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


    // ObservableValueCellModel_T is an exported class that extends @encapsule/holarchy CellModel class.
    // It models an observable value mailbox specialized for a specific message value type via a filter spec.
    ObservableValueCellModel_T: require("./ObservableValueCellModel_T"),

    // ObservableValueProxy is an exported CellModel class that represents a dynamically-established connection
    // between an activated ObservableValueProxy cell instance and one of any available specializations of
    // ObservableValueCellModel_T.

    ObservableValueProxy: require("./ObservableValueProxyCellModel"),

    // ObservableValueProxyWorkerCellModel_T is an exported class that extends @encapsule/holarchy CellModel class.
    // It models a cell process that knows how to dynamically connect and and subsequently communicate with a specific
    // activated cell instance of a specific specialization of ObservableValueCellModel_T. ObservableValueProxyWorkerCellModel_T
    // cells are activated themselves as an implementation detail of ObservableValueProxy.

    ObservableValueProxyWorkerCellModel_T: require("./ObservableValueProxyWorkerCellModel_T"),

    factories: {

        // update. TODO: deprecate?
        makeObservableValueCellModel: require("./ObservableValueCellModel_T/CellModel-constructor-request-generator-filter"),

        // updated. TODO: deprecate?
        makeValueObserverWorkerCellModel:   require("./ObservableValueProxyWorkerCellModel_T/CellModel-constructor-request-generator-filter"),
    }

};
