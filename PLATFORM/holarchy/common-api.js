"use strict";

// common.js
//
var appMetadataStoreConstructorFilterFactory = require("./common/metadata/metadata-store-constructor-factory");

var reactComponentBindingFilterFactory = require("./common/view/component-router/react-component-binding-filter-factory");

var reactComponentRouterFactory = require("./common/view/component-router/react-component-router-factory");

var dataRoutableComponents = require("./common/view/elements");

module.exports = {
  ApplicationDataStore: {
    // Creates an application-specific application data store constructor filter.
    makeInstanceConstructor: {
      request: function request(request_) {
        request_;
        return {
          error: "Not yet implemented."
        };
      }
    }
  },
  ApplicationMetadataStore: {
    // Creates an application-specific application metadata store constructor filter.
    makeInstanceConstructor: appMetadataStoreConstructorFilterFactory
  },
  // Data-Driven React Router (D2R2)
  DataDrivenReactRouter: {
    // Data-Routable Component (DRC)
    DataRoutableComponent: {
      // Creates a filter that associates a developer-defined filter specification with a Facebook/React component.
      makeInstance: reactComponentBindingFilterFactory,
      components: dataRoutableComponents
    },
    // Data-Driven React Router (D2R2)
    ComponentRouter: {
      // Create a Facebook/React component that delegates to one of N>2 DRC's based on runtime analysis of this.props.renderData signature.
      makeInstance: reactComponentRouterFactory
    }
  }
};