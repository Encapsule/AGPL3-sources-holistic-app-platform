
const packageMeta = require("./package.json");

const ApplicationDataStore = require("./app-data-store/ApplicationDataStore");
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

    // TBD if we actually export this ES6 class or encapsulate access using OPC action filters.
    // Consider changing the name of this to Observable Process State (OPS)
    ApplicationDataStore: ApplicationDataStore,

    // Observable Process Controller ES6 class
    ObservableProcessController: ObservableProcessController,

    // Observable Process Model ES6 class
    ObservableProcessModel: ObservableProcessModel,

    TransitionOperator: TransitionOperator,

    ControllerAction: ControllerAction




};
