"use strict";

var packageMeta = require("./package.json");

var ApplicationDataStore = require("./app-data-store/ApplicationDataStore");

var appMetadataStoreConstructorFilterFactory = require("./app-metadata-store/metadata-store-constructor-factory");

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
  // The application metadata store is a bit odd insofar as it does not factor into the core OPC/OPM/OPS runtime architecture.
  ApplicationMetadataStore: {
    // TODO: Create a little ES6 class to abstract metadata store.
    // Creates an application-specific application metadata store constructor filter.
    makeInstanceConstructor: appMetadataStoreConstructorFilterFactory
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