
const packageMeta = require("./package.json");

const ControllerDataStore = require("./opc/ControllerDataStore");
const ObservableProcessController = require("./opc/ObservableProcessController");
const ObservableProcessModel = require("./opc/ObservableProcessModel");
const TransitionOperator = require("./opc/TransitionOperator");
const ControllerAction = require("./opc/ControllerAction");

module.exports = {

    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    // Deprecated
    ApplicationDataStore: ControllerDataStore,

    // Observable Process Controller ES6 class
    ObservableProcessController: ObservableProcessController,

    // Observable Process Model ES6 class
    ObservableProcessModel: ObservableProcessModel,

    TransitionOperator: TransitionOperator,

    ControllerAction: ControllerAction




};
