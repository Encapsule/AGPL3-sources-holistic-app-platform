"use strict";

var packageMeta = require("./package.json");

var ObservableControllerData = require("./opc/ObservableControllerData");

var ObservableProcessController = require("./opc/ObservableProcessController");

var ObservableProcessModel = require("./opc/ObservableProcessModel");

var TransitionOperator = require("./opc/TransitionOperator");

var ControllerAction = require("./opc/ControllerAction");

var TransitionOperators = require("./lib/toperators");

module.exports = {
  __meta: {
    author: packageMeta.author,
    name: packageMeta.name,
    version: packageMeta.version,
    codename: packageMeta.codename,
    build: packageMeta.buildID,
    source: packageMeta.buildSource
  },
  // ObservableProcessController ES6 class.
  ObservableProcessController: ObservableProcessController,
  // Observable Process Model ES6 class.
  ObservableProcessModel: ObservableProcessModel,
  // TransitionOperator filter wrapper ES6 class.
  TransitionOperator: TransitionOperator,
  // ControllerAction filter wrapper ES6 class.
  ControllerAction: ControllerAction,
  // ObservableControllerData ES6 class.
  // Ocassionally it's useful to apply OCD standalone.
  // Mostly, we just use the OCD instance managed
  // inside of an OPC however.
  ObservableControllerData: ObservableControllerData,
  core: {
    // TODO: lib/core/ or split out to separate holistic-generated package.
    TransitionOperators: TransitionOperators
  },
  // ================================================================
  // DEPRECATED: ApplicationStateController is deprecated.
  // ObservableControllerData class is aliased below. It is backwards
  // compatible with ApplicationDataStore. Once we integrate OPC
  // this export will be removed. If you actually want an uncontrolled
  // OCD then the class is exported above.
  ApplicationDataStore: ObservableControllerData
};