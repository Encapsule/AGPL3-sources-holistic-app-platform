"use strict";

var packageMeta = require("./package.json");

var ControllerDataStore = require("./opc/ControllerDataStore");

var ObservableProcessController = require("./opc/ObservableProcessController");

var ObservableProcessModel = require("./opc/ObservableProcessModel");

var TransitionOperator = require("./opc/TransitionOperator");

var ControllerAction = require("./opc/ControllerAction");

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