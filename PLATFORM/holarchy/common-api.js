"use strict";

// common.js
//
// Holistic metadata store related common data subsystem exports...
var appMetadataStoreConstructorFilterFactory = require("./common/metadata/metadata-store-constructor-factory"); // Holistic data store related common data subsystem exports...


var appDataStoreConstructorFactory = require("./common/data/app-data-store-constructor-factory"); // React <ComponentRouter/> and related common view subsystem exports...


var reactComponentBindingFilterFactory = require("./common/view/component-router/react-component-binding-filter-factory");

var reactComponentRouterFactory = require("./common/view/component-router/react-component-router-factory");

var dataRoutableComponents = require("./common/view/elements");

var sharedComponentStyles = require("./common/view/theme");

module.exports = {
  ApplicationDataStore: {
    // Creates an application-specific application data store constructor filter.
    makeInstanceConstructor: appDataStoreConstructorFactory
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
      // This is a dictionary with componentName::componentID filter keys and data-routable component filter values.
      components: dataRoutableComponents,
      // Per-component programmatic style data.
      // TODO: This is broken in several ways and needs to be wholely replaced w/per-component declarations.
      styles: sharedComponentStyles
    },
    // Data-Driven React Router (D2R2)
    ComponentRouter: {
      // Create a Facebook/React component that delegates to one of N>2 DRC's based on runtime analysis of this.props.renderData signature.
      makeInstance: reactComponentRouterFactory
    }
  }
};