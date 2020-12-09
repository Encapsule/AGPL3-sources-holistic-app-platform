"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// HolisticAppCommon-method-constructor-filter.js
var arccore = require("@encapsule/arccore"); // TODO: Migrate


var holismMetadataFactory = require("@encapsule/holism-metadata");

var appMetadataBaseObjectSpecs = require("./iospecs/app-metadata-base-object-specs"); // intrinsic properties of org, app, page, and hashroute metadata required by the platform


(function () {
  var factoryResponse = arccore.filter.create({
    operationID: "P9-aWxR5Ts6AhYSQ7Ymgbg",
    operationName: "HolisticAppCommon::constructor Filter",
    operationDescription: "Validates/normalizes a HolisticAppCommon::constructor function request object and returns the new instance's private state data.",
    inputFilterSpec: require("./iospecs/HolisticAppCommon-method-constructor-filter-input-spec"),
    // This is what you need to pass to new @encapsule/holon-core/HolonCore
    outputFilterSpec: require("./iospecs/HolisticAppCommon-method-constructor-filter-output-spec"),
    // This is the _private instance state of a HolonCore class instance
    bodyFunction: function bodyFunction(request_) {
      var response = {
        error: null,
        result: {
          // set the outer levels of the response.result up assuming we'll be successful splicing in the required values later in this bodyFunction
          nonvolatile: {
            // Nothing in this namespace should ever be written to during the lifespan of a derived app service process.
            // This is the validated/normalized value passed by the derived app to HolisticAppCommon constructor function.
            appCommonDefinition: request_ // Copy the filtered constructor request data immediately; this is an immutable reference copy to support deep introspection of a holistic app service runtime.

          }
        }
      };
      var errors = [];
      var inBreakScope = false;

      while (!inBreakScope) {
        inBreakScope = true; // @encapsule/holism-metadata exports a factory filter that is unaware of how the filter specs it is passed are generated.
        // We take care of that detail here in HolisticAppCommon class constructor filter.
        // Synthesize a filter spec to validate the derived app service's metadata values.

        var derivedAppService_MetadataInputSpec = {
          ____types: "jsObject",
          org: _objectSpread(_objectSpread({}, request_.appMetadata.specs.org), appMetadataBaseObjectSpecs.input.org),
          app: _objectSpread(_objectSpread({}, request_.appMetadata.specs.app), appMetadataBaseObjectSpecs.input.app),
          pages: {
            ____types: "jsObject",
            ____asMap: true,
            pageURI: _objectSpread(_objectSpread({}, request_.appMetadata.specs.page), appMetadataBaseObjectSpecs.input.page)
          },
          hashroutes: {
            ____types: "jsObject",
            ____asMap: true,
            hashroutePathname: _objectSpread(_objectSpread({}, request_.appMetadata.specs.hashroute), appMetadataBaseObjectSpecs.input.hashroute)
          }
        }; // derivedAppMetadataInputSpec
        // Synthesize a filter spec to validate (or simply document) the metadata values returned by any app metadata query by bucket org/app/page/hashroute.

        var derivedAppService_MetadataOutputSpec = {
          ____types: "jsObject",
          org: _objectSpread(_objectSpread({}, derivedAppService_MetadataInputSpec.org), appMetadataBaseObjectSpecs.output.org),
          app: _objectSpread(_objectSpread({}, derivedAppService_MetadataInputSpec.app), appMetadataBaseObjectSpecs.output.app),
          page: _objectSpread(_objectSpread({}, derivedAppService_MetadataInputSpec.page), appMetadataBaseObjectSpecs.output.page),
          hashroute: _objectSpread(_objectSpread({}, derivedAppService_MetadataInputSpec.hashroute), appMetadataBaseObjectSpecs.output.hashroute)
        }; // Construct a filter specialized on our metadata types that builds the app metadata digraph.
        // Call into current @encapsule/holism-metadata package that basically just has this factory in it.

        var digraphBuilderFactoryResponse = holismMetadataFactory.request({
          id: "RRvaL94rQfm-fS0rxSOTxw",
          // id is required but of little significance we throw away the builder after we use it once here.
          name: "App Metadata Digraph Builder Filter",
          description: "A filter that accepts app-specific metadata values and produces a normalized holistic app metadata digraph model used to satisfy value and topological queries on app metadata.",
          constraints: {
            metadata: derivedAppService_MetadataOutputSpec
          }
        });

        if (digraphBuilderFactoryResponse.error) {
          errors.push("An error occurred while constructing a filter to process your app metadata values and build your app service's metadata digraph.");
          errors.push("Usually this indicates error(s) in app service metadata filter spec(s) provided to this constructor function.");
          errors.push(digraphBuilderFactoryResponse.error);
          break;
        }

        var digraphBuilder = digraphBuilderFactoryResponse.result; // Use the digraphBuilder to filter the developer-supplied app metadata values and build the app metadata digraph.

        var digraphBuilderResponse = digraphBuilder.request({
          org: request_.appMetadata.values.org,
          app: request_.appMetadata.values.app,
          pages: request_.appMetadata.values.pages,
          hashroutes: request_.appMetadata.values.hashroutes
        });

        if (digraphBuilderResponse.error) {
          errors.push("An error occured while processing the app metadata value(s) specified to this constructor function.");
          errors.push(digraphBuilderResponse.error);
          break;
        }

        var appMetadataDigraph = digraphBuilderResponse.result;
        response.result.nonvolatile.appMetadata = {
          values: {
            digraph: appMetadataDigraph
          },
          specs: derivedAppService_MetadataOutputSpec
        };
        console.log(JSON.stringify(response, undefined, 4));
        break;
      }

      if (errors.length) {
        response.error = errors.join(" ");
      }

      return response;
    }
  });

  if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
  }

  module.exports = factoryResponse.result;
})();