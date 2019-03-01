"use strict";

// sources/server/server-factory.js
//
var arccore = require("@encapsule/arccore"); // @encapsule/holism provides a JSON-configurable, filter-extensible HTTP 1.1 server implementation for Node.js.


var holism = require("@encapsule/holism");

var holismAppServerFactory = holism.server; // dereference
// Builds a filter used to construct a shared singleton object called the Application Data Store (ADS).

var dataStoreConstructorFactory = require("../common/data/app-data-store-constructor-factory"); // Becoming increasingly convinced that application metadata should not be managed
// by this package. Rather, this package should provide exports (e.g. filter factories)
// that application developers can re-use to define their own metadata structures?


var metadataStoreFactory = require("../COMMON/metadata");

var baseAppServerConfig = require("./config");

var baseAppServerIntegrationsFactory = require("./integrations");

var baseAppDataViewBindings = require("../common/view/elements");

var reactComponentRouterFactory = require("../common/view/component-router/react-component-router-factory");

var factoryResponse = arccore.filter.create({
  operationID: "LZvDhWFzR-6_4b8phUJL0A",
  operationName: "Rainier UX Server Application Factory",
  operationDescription: "Constructs an application-specific (i.e. specialized and extended) Rainier UX server application instance.",
  // This is a specification of the input data that this filter will accept.
  inputFilterSpec: {
    ____label: "Rainier UX Server App Factory Request",
    ____description: "Information provided by a derived UX application to construct a specialized instance of a Rainier UX server application.",
    ____types: "jsObject",
    instanceMetadata: {
      ____label: "Instance Metadata",
      ____description: "Information used by the underlying @encapsule/holism HTTP 1.1 server to identify itself.",
      ____types: "jsObject",
      name: {
        ____label: "Server Name",
        ____description: "The name of the server. For a holistic application this is typically the 'name' value from the app's package.json.",
        ____accept: "jsString"
      },
      description: {
        ____label: "Server Description",
        ____description: "A short description of the server's purpose. For a holistic application this is typically the 'description' value from the app's package.json.",
        ____accept: "jsString"
      },
      version: {
        ____label: "Server Version",
        ____description: "The semantic version string to be used by the server. For a holistic application this is typically the 'version' value from app's package.json.",
        ____accept: "jsString"
      },
      commit: {
        ____label: "Server Commit",
        ____desription: "This is typically the long-form commit hash from the app's git repo used to track precisely what is deployed in this server instance.",
        ____accept: "jsString"
      },
      timestamp: {
        ____label: "Server Build Timestamp",
        ____description: "The time that the server instance was build from sources at the indicated commit hash (Epochtime in seconds).",
        ____accept: "jsNumber"
      }
    },
    dataSpec: dataStoreConstructorFactory.filterDescriptor.inputFilterSpec,
    data: {
      ____label: "Application Data",
      ____description: "Construction data and default value overrides for the application data store.",
      ____opaque: true // Note that we filter this input per dataSpec in the bodyFunction of this factory.

    },
    metadata: metadataStoreFactory.filterDescriptor.inputFilterSpec,
    // Content data view binding filters are constructed by the derived application:
    // export module: rainier-ux-base/common
    // factory: factories.view.contentDataViewBindingFilterFactory
    dataViewBindings: {
      ____label: "Application Data Views",
      ____description: "An array of application-defined data view binding filter object(s).",
      ____types: "jsArray",
      ____defaultValue: [],
      dataViewBinding: {
        ____label: "Data View Binding Filter",
        ____description: "A data view binding filter that binds incoming data messages of a specific type to a React component responsible for rendering the data as HTML.",
        ____types: "jsObject",
        dependencies: {
          ____accept: "jsObject"
        },
        filterDescriptor: {
          ____accept: "jsObject"
        },
        request: {
          ____accept: "jsFunction"
        }
      }
    },
    appStateContext: {
      ____label: "Application State Context",
      ____description: "App state context is a required developer-defined object singleton shared between service filters, and the server-side HTML rendering subsystem.",
      ____accept: "jsObject"
    },
    config: holism.filters.factories.server.filterDescriptor.inputFilterSpec.config
  },
  // This is a specification of the output data that this filter will produce.
  outputFilterSpec: holism.filters.factories.server.filterDescriptor.outputFilterSpec,
  bodyFunction: function bodyFunction(request_) {
    console.log(">>> " + this.operationID + "::" + this.operationName + " starting...");
    var response = {
      error: null,
      result: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true; // Make a copy of the application's declared app server configuration.

      var appServerConfig = arccore.util.clone(request_.config); // Merge the application and shared base file resource regisitrations giving preference to the shared base resources.

      for (var resourcePath_ in baseAppServerConfig.files) {
        if (appServerConfig.files[resourcePath_]) {
          errors.push("Invalid application resource file registration for '" + resourcePath_ + " conflicts with a shared resource of the same name.");
          break;
        }

        appServerConfig.files[resourcePath_] = baseAppServerConfig.files[resourcePath_];
      }

      if (errors.length) {
        errors.unshift("Failed to process application file resource registrations:");
        break;
      } // Build tables keyed by HTTP method:URI for the application and shared base service filter registrations.


      var appServiceRoutes = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = appServerConfig.services[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var serviceDescriptor_ = _step.value;
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = serviceDescriptor_.request_bindings.uris[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var uri_ = _step4.value;
              var serviceRoute = serviceDescriptor_.request_bindings.method + ":" + uri_;
              appServiceRoutes[serviceRoute] = serviceDescriptor_;
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var baseServiceRoutes = {};
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = baseAppServerConfig.services[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          serviceDescriptor_ = _step2.value;
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = serviceDescriptor_.request_bindings.uris[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              uri_ = _step5.value;
              serviceRoute = serviceDescriptor_.request_bindings.method + ":" + uri_;
              baseServiceRoutes[serviceRoute] = serviceDescriptor_;
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        } // Ensure that the application is not overriding any of the shared base service filter registrations.

      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      for (var serviceRoute_ in appServiceRoutes) {
        if (baseServiceRoutes[serviceRoute_]) {
          var appServiceDescriptor = appServiceRoutes[serviceRoute_];
          var baseServiceDescriptor = baseServiceRoutes[serviceRoute_];
          errors.push("Invalid application service filter registration on route '" + serviceRoute_ + "' for filter '" + appServiceDescriptor.filter.filterDescriptor.operationID + ":" + appServiceDescriptor.filter.filterDescriptor.operationName + "' conflicts with shared service registration for '" + baseServiceDescriptor.filter.filterDescriptor.operationID + ":" + baseServiceDescriptor.filter.filterDescriptor.operationName + "'.");
          break;
        }
      } // Merge the application and shared base service filter registrations.


      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = baseAppServerConfig.services[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          serviceDescriptor_ = _step3.value;
          appServerConfig.services.push(serviceDescriptor_);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (errors.length) {
        errors.unshift("Failed to process application service filter registrations:");
        break;
      } // So large because there are many references to filters that in the case of holism service filters have bulky composite filter specs attached.
      // console.log(JSON.stringify(appServerConfig, undefined, 4));
      // Create the merged app/base data store constructor filter.


      var factoryResponse = dataStoreConstructorFactory.request(request_.dataSpec);

      if (factoryResponse.error) {
        errors.push(factoryResponse.error);
        break;
      }

      var dataStoreConstructorFilter = factoryResponse.result; // Now create the actual runtime application data store.

      factoryResponse = dataStoreConstructorFilter.request(request_.data);

      if (factoryResponse.error) {
        errors.push(factoryResponse.error);
        break;
      }

      request_.appStateContext.appDataStore = factoryResponse.result;
      request_.appStateContext.appDataStoreConstructorFilter = dataStoreConstructorFilter; // Construct the merged application/base metadata store.

      factoryResponse = metadataStoreFactory.request(request_.metadata);

      if (factoryResponse.error) {
        errors.push(factoryResponse.error);
        break;
      }

      var appMetadataStore = factoryResponse.result;
      request_.appStateContext.appMetadataStore = appMetadataStore; // https://encapsule.io/docs/ARCcore/graph
      // Construct the React <ComponentRouter/> which is a mechanism for routing HTML render request messages
      // to one of N registered data view binding filters (which in turn bind the data values to a specific
      // React component and return the bound React component instance (typically back to React render loop)).
      // This operation additionally encapsulates the process of late binding all of the React component data
      // binding filters to the application data store namespace read and user input sink filters they depend
      // on.

      factoryResponse = reactComponentRouterFactory.create({
        dataViewBindingFilterSetOfSets: [request_.dataViewBindings, baseAppDataViewBindings],
        appStateContext: request_.appStateContext
      });

      if (factoryResponse.error) {
        errors.push(factoryResponse.error);
        break;
      }

      var reactComponentRouter = factoryResponse.result;
      request_.appStateContext.reactComponentRouter = reactComponentRouter; // Construct the set of required holism app server service plug-ins known collectively as integrations.

      factoryResponse = baseAppServerIntegrationsFactory(request_.appStateContext); // https://encapsule.io/docs/holism/integrations

      if (factoryResponse.error) {
        errors.push(factoryResponse.error);
        break;
      }

      var appServerIntegrations = factoryResponse.result; // Create the holism server instance

      factoryResponse = holismAppServerFactory.create({
        name: request_.instanceMetadata.name,
        description: request_.instanceMetadata.description,
        version: request_.instanceMetadata.version,
        build: {
          commit: request_.instanceMetadata.commit,
          timestamp: request_.instanceMetadata.timestamp
        },
        integrations: appServerIntegrations,
        config: appServerConfig
      }); // https://encapsule.io/docs/holism

      if (factoryResponse.error) {
        errors.push(factoryResponse.error);
        break;
      } // Return the holism app server instance (an object w/method `listen`) as the result.


      console.log("<<< " + this.operationID + "::" + this.operationName + " exit without error :)");
      response.result = factoryResponse.result;
      break;
    }

    if (errors.length) response.error = errors.join(" ");
    return response;
  }
});
if (factoryResponse.error) throw new Error(factoryResponse.error); // Dereference

var rainierUXServerAppFactory = factoryResponse.result; // Alias the filter object's request method.

rainierUXServerAppFactory.create = rainierUXServerAppFactory.request;
module.exports = rainierUXServerAppFactory;