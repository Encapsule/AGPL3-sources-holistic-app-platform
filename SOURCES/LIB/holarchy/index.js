// @encapsule/holarchy package exports.

const packageMeta = require("./package.json");

const SoftwareCellModel = require("./SoftwareCellModel");
const SoftwareCellProcessor = require("./SoftwareCellProcessor");
const ObservableProcessController = require("./lib/ObservableProcessController");
const ObservableProcessModel = require("./lib/ObservableProcessModel");
const TransitionOperator = require("./lib/TransitionOperator");
const ControllerAction = require("./lib/ControllerAction");
const ObservableControllerData = require("./lib/ObservableControllerData");

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
    // DEVELOPER API
    // ================================================================

    /*
      SoftwareCellModel (SCM) is an ES6 class instantiated with operator
      new that represents a specific class of runtime "cell process".
    */
    SoftwareCellModel,

    /*
      ObservableProcessModel (OPM) is an ES6 class instantiated with
      operator new that represents the shared memory and runtime
      behavior(s) of a SoftwareCellModel (SCM).
    */
    ObservableProcessModel,

    /*
      TransitionOperator (TOP) is an ES6 class instantiated with operator
      new that implements a plug-in Boolean operator function used to
      evaluate cell process transition rules at runtime.
    */
    TransitionOperator,

    /*
      ControllerAction (ACT) is an ES6 class instantiated with operator
      new that implements a plug-in data transformation function used to
      evaluate cell process step exit and step enter actions.
    */
    ControllerAction,

    /*
      SoftwareCellProcessor (SCP) is an ES6 class instantiated with operator new
      that provides a runtime evaluation and execution environment for
      cellular process(es) defined by SoftwareCellModel class instances.
    */
    SoftwareCellProcessor,

    // ================================================================
    // IMPLEMENTATION
    // ================================================================

    /*
      ObservableProcessController is an ES6 class instantiated with operator
      new that provides memory management, and generic evaluation of cellular
      process(es). Developers do not typically use the OPC class directly but
      instead rely on SoftwareCellProcessor to create and manage an OPC
      runtime instance on their behalf based on the registered SoftwareCellModel
      instances plus some minimal configuration data.
     */
    ObservableProcessController,

    /*
      ObservableControllerData is an ES6 class instantiated with operator
      new encapsulates a shared in-memory heap store for cellular process
      data. This store features absolute and relative dot-delimited path
      addressing, introspection, and fully abstracted I/O operations via
      its API. OPC uses OCD to manage celluar process(es) runtime data
      on behalf of SoftwareCellProcessor. But, you can use it wherever
      you have similar requirements.
    */
    ObservableControllerData,

    // DEPRECATED: ApplicationStateController is deprecated. Use OCD.
    ApplicationDataStore: ObservableControllerData



};
