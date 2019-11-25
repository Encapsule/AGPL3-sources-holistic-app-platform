
// @encapsule/holarchy package exports:

const packageMeta = require("./package.json");

const ObservableControllerData = require("./opc/ObservableControllerData");
const ObservableProcessController = require("./opc/ObservableProcessController");
const ObservableProcessModel = require("./opc/ObservableProcessModel");
const TransitionOperator = require("./opc/TransitionOperator");
const ControllerAction = require("./opc/ControllerAction");

const TransitionOperators = require("./lib/toperators");

module.exports = {

    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    // ================================================================
    // @encapsule/holarchy ES6 class exports:

    // ObservableProcessController (OPC) ES6 class.
    ObservableProcessController: ObservableProcessController,

    // Observable Process Model (OPM) ES6 class.
    ObservableProcessModel: ObservableProcessModel,

    // TransitionOperator (TOP) filter wrapper ES6 class.
    TransitionOperator: TransitionOperator,

    // ControllerAction (ACT) filter wrapper ES6 class.
    ControllerAction: ControllerAction,

    // ObservableControllerData (OCD) ES6 class.
    ObservableControllerData: ObservableControllerData,

    // DEPRECATED: ApplicationStateController is deprecated. Use OCD.
    ApplicationDataStore: ObservableControllerData,

    core: { // TODO: lib/core/ or split out to separate holistic-generated package.
        TransitionOperators: TransitionOperators
    }

};
