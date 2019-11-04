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
  // Observable Process Controller ES6 class.
  ObservableProcessController: ObservableProcessController,
  // Observable Process Model ES6 class.
  ObservableProcessModel: ObservableProcessModel,
  // TransitionOperator filter wrapper ES6 class.
  TransitionOperator: TransitionOperator,
  // ControllerAction filter wrapper ES6 class.
  ControllerAction: ControllerAction,
  core: {
    TransitionOperators: TransitionOperators
  },
  // ================================================================
  // DEPRECATED: ApplicationStateController is deprecated. We will be migrating to ObservableProcessController that allocates and manages an instance of ObservableProcessData.
  // So we will no longer need to export the class; clients of the @encapsule/holarchy library need only instantiate ObservableProcessController instance.
  ApplicationDataStore: ObservableControllerData
};