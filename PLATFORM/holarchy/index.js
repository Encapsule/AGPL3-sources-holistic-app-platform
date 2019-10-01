"use strict";

var packageMeta = require("./package.json");

var appMetadataStoreConstructorFilterFactory = require("./app-metadata-store/metadata-store-constructor-factory");

var ApplicationDataStore = require("./app-data-store/ApplicationDataStore"); // Shiny new ES6 class API...


var ApplicationStateController = require("./app-state-controller/ApplicationStateController");

var ObservableProcessModel = require("./app-state-controller/ObservableProcessModel");

module.exports = {
  __meta: {
    author: packageMeta.author,
    name: packageMeta.name,
    version: packageMeta.version,
    codename: packageMeta.codename,
    build: packageMeta.buildID,
    source: packageMeta.buildSource
  },
  // ES6 class instantiated with operator new.
  ApplicationDataStore: ApplicationDataStore,
  ApplicationMetadataStore: {
    // TODO: Create a little ES6 class to abstract metadata store.
    // Creates an application-specific application metadata store constructor filter.
    makeInstanceConstructor: appMetadataStoreConstructorFilterFactory
  },
  ApplicationStateController: ApplicationStateController,
  ObservableProcessModel: ObservableProcessModel
};