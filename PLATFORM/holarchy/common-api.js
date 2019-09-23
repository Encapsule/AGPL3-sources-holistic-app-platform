"use strict";

// common.js
//
// Holistic metadata store related common data subsystem exports...
var appMetadataStoreConstructorFilterFactory = require("./common/metadata/metadata-store-constructor-factory"); // const appDataStoreActorFilterFactory = require("./common/data/app-data-store-actor-factory");


var ApplicationDataStore = require("./common/data/ApplicationDataStore"); // React <ComponentRouter/> and related common view subsystem exports...


var dataRoutableComponents = require("./common/view/elements");

var sharedComponentStyles = require("./common/view/theme");

module.exports = {
  ApplicationDataStore: {
    // Creates an application-specific application data store constructor filter.
    // makeInstanceConstructor: appDataStoreConstructorFactory,
    class: ApplicationDataStore
  },
  ApplicationMetadataStore: {
    // Creates an application-specific application metadata store constructor filter.
    makeInstanceConstructor: appMetadataStoreConstructorFilterFactory
  },

  /*
  ApplicationDataActor: {
      makeInstance: appDataStoreActorFilterFactory
  },
  */
  // Data-Driven React Router (D2R2)
  DataDrivenReactRouter: {
    // Data-Routable Component (DRC)
    DataRoutableComponent: {
      components: dataRoutableComponents,
      // Per-component programmatic style data.
      // TODO: This is broken in several ways and needs to be wholely replaced w/per-component declarations.
      styles: sharedComponentStyles
    }
  }
};