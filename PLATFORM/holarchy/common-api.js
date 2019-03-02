"use strict";

// common.js
//
var appMetadataStoreConstructorFilterFactory = require("./common/metadata/metadata-store-constructor-factory");

var reactComponentBindingFilterFactory = require("./common/view/component-router/react-component-binding-filter-factory");

var reactComponentRouterFactory = require("./common/view/component-router/react-component-router-factory");

module.exports = {
  ApplicationDataStore: {
    // Creates an application-specific application data store constructor filter.
    makeInstanceConstructor: function makeInstanceConstructor(request_) {
      request_;
      return {
        error: "Not yet implemented."
      };
    }
  },
  ApplicationMetadataStore: {
    // Creates an application-specific application metadata store constructor filter.
    makeInstanceConstructor: appMetadataStoreConstructorFilterFactory
  },
  // Data-Driven React Router (D2R2)
  D2R2: {
    // Data-Routable Component (DRC)
    DataRoutableComponent: reactComponentBindingFilterFactory,
    // Data-Driven React Router (D2R2)
    ComponentRouter: reactComponentRouterFactory
  }
};