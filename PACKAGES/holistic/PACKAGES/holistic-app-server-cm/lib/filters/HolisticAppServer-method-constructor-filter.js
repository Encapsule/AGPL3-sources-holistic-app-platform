"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// HolisticAppServerService-method-constructor-filter.js
var arccore = require("@encapsule/arccore");

var holism = require("@encapsule/holism");

var _require = require("@encapsule/holistic-app-common-cm"),
    HolisticAppCommon = _require.HolisticAppCommon;

var inputFilterSpec = require("./iospecs/HolisticAppServer-method-constructor-filter-input-spec");

var outputFilterSpec = require("./iospecs/HolisticAppServer-method-constructor-filter-output-spec");

var factoryResponse = arccore.filter.create({
  operationID: "365COUTSRWCt2PLogVt51g",
  operationName: "HolisticAppServer::constructor Filter",
  operationDescription: "Validates/normalizes a HolisticAppServer::constructor function request descriptor object. And, returns the new instance's private state data.",
  inputFilterSpec: inputFilterSpec,
  outputFilterSpec: outputFilterSpec,
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      result: {}
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true; // Cache the HolisticAppCommon definition.

      var appServiceCore = request_.appServiceCore instanceof HolisticAppCommon ? request_.appServiceCore : new HolisticAppCommon(request_.appServiceCore);

      if (!appServiceCore.isValid()) {
        errors.push("Invalid appServiceCore value cannot be resolved to valid HolisticAppCommon class instance:");
        errors.push(response.result.appServiceCore.toJSON());
        break;
      }

      response.result.appServiceCore = appServiceCore; // Obtain build-time @encapsule/holism HTTP server config information from the derived app server.
      // These are function callbacks wrapped in filters to ensure correctness of response and to provide
      // developers with reference on format of the request value they are sent.

      var _factoryResponse = arccore.filter.create({
        operationID: "tMYd-5e7Qm-iFV2TAufL6Q",
        operationName: "HolisticAppServer::constructor HTTP Mem-Cached Files Config Map Integration Filter",
        operationDescription: "Used to dispatch and validate the response.result of developer-defined getMemCachedFilesConfigMap function.",
        inputFilterSpec: {
          ____types: "jsObject",
          appBuild: _objectSpread({}, holism.filters.factories.server.filterDescriptor.inputFilterSpec.holisticAppBuildManifest),
          // <== THIS IS WRONG: we want this format set in common and we'll pick it up from there
          deploymentEnvironment: _objectSpread({}, holism.filters.factories.server.filterDescriptor.inputFilterSpec.appServerRuntimeEnvironment)
        },
        outputFilterSpec: _objectSpread({}, holism.filters.factories.server.filterDescriptor.inputFilterSpec.config.files)
      });

      if (_factoryResponse.error) {
        errors.push("Cannot build a wrapper filter to retrieve your app server's memory-cached file configuration map due to error:");
        errors.push(_factoryResponse.error);
        break;
      }

      _factoryResponse = arccore.filter.create({
        operationID: "0suEywsvTl200kgcEVBsLw",
        operationName: "HolisticAppServer::constructor HTTP Service Filter Config Map Integration Filter",
        operationDescription: "Used to dispatch and validate the response.result of developer-defined getServiceFilterConfigMap function.",
        inputFilterSpec: {
          ____types: "jsObject",
          appBuild: _objectSpread({}, holism.filters.factories.server.filterDescriptor.inputFilterSpec.holisticAppBuildManifest),
          // <== THIS IS WRONG: we want this format set in common and we'll pick it up from there
          deploymentEnvironment: _objectSpread({}, holism.filters.factories.server.filterDescriptor.inputFilterSpec.appServerRuntimeEnvironment)
        },
        outputFilterSpec: _objectSpread({}, holism.filters.factories.server.filterDescriptor.inputFilterSpec.config.files)
      });

      if (_factoryResponse.error) {
        errors.push("Cannot build a wrapper filter to retrieve your app server's service filter configuration map due to error:");
        errors.push(_factoryResponse.error);
        break;
      }

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