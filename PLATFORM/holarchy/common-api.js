"use strict";

// common.js
//
var appMetadataStoreConstructorFilterFactory = require("./common/metadata/metadata-store-constructor-factory");

var reactComponentBindingFilterFactory = require("./common/view/component-router/react-component-binding-filter-factory");

var reactComponentRouterFactory = require("./common/view/component-router/react-component-router-factory");

module.exports = {
  ApplicationDataStore: {
    // Calling ApplicationDataStore.request creates a filter that is used to initialize an Application Data Store (serializable object).
    makeInstanceConstructor: function makeInstanceConstructor(request_) {
      request_;
      return {
        error: "Not yet implemented."
      };
    }
  },
  ApplicationMetadataStore: {
    // Calling constructorFactory.request creates a filter that is used to initialize an Application Metadata Store (DirectedGraph instance).
    makeInstanceConstructor: appMetadataStoreConstructorFilterFactory
  },
  // Data-Driven React Router (D2R2)
  DataDrivenReactRouter: {
    // Data-Routable Component (DRC)
    DataRoutableComponent: {
      makeInstance: reactComponentBindingFilterFactory
    },
    // Data-Driven React Router (D2R2)
    ComponentRouter: {
      makeInstance: reactComponentRouterFactory
    }
  }
};