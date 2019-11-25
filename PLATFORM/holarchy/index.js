"use strict";

// @encapsule/holarchy package exports:
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
  core: {
    // TODO: lib/core/ or split out to separate holistic-generated package.
    TransitionOperators: TransitionOperators
  }
};