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
    console.log("[".concat(this.operationID, "::").concat(this.operationName, "]"));
    var response = {
      error: null,
      result: {
        appServiceCore: null,
        // invalid value type will cause output filter error if not overwritten below
        httpServerInstance: {
          holismInstance: {
            config: {
              filters: {
                getMemoryFileRegistrationMap: null,
                // as above
                getServiceFilterRegistrationMap: null // as above

              },
              data: {
                memoryFileRegistrations: null,
                // as above
                serviceFilterRegistrations: null // as above

              }
            }
          }
        }
      }
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
      // Create a filter to box the developer's getMemoryFileRegistrationMap callback function.

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
        outputFilterSpec: _objectSpread({}, holism.filters.factories.server.filterDescriptor.inputFilterSpec.config.files),
        bodyFunction: request_.httpServerConfig.holismConfig.registrations.resources.getMemoryFileRegistrationMap
      });

      if (_factoryResponse.error) {
        errors.push("Cannot build a wrapper filter to retrieve your app server's memory-cached file configuration map due to error:");
        errors.push(_factoryResponse.error);
        break;
      }

      var getMemoryFileRegistrationMapFilter = response.result.httpServerInstance.holismInstance.config.filters.getMemoryFileRegistrationMap = _factoryResponse.result; // Create a filter to box the developer's getServiceFilterRegistrationMap callback function.

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
        outputFilterSpec: _objectSpread({}, holism.filters.factories.server.filterDescriptor.inputFilterSpec.config.services),
        bodyFunction: request_.httpServerConfig.holismConfig.registrations.resources.getServiceFilterRegistrationMap
      });

      if (_factoryResponse.error) {
        errors.push("Cannot build a wrapper filter to retrieve your app server's service filter configuration map due to error:");
        errors.push(_factoryResponse.error);
        break;
      }

      var getServiceFilterRegistrationMapFilter = response.result.httpServerInstance.holismInstance.config.filters.getServiceFilterRegistrationMap = _factoryResponse.result; // Get the derived app server's memory file registration map via our filter.

      var callbackRequest = {
        appBuild: response.result.appServiceCore.appBuild,
        deploymentEnvironment: "development"
      }; // TODO deploymentEnvironment

      var filterResponse = getMemoryFileRegistrationMapFilter.request(callbackRequest);

      if (filterResponse.error) {
        errors.push("An error occurred while querying your app server for its memory file registration map:");
        errors.push(filterResponse.error);
        break;
      }

      var appServerMemoryFileRegistrationMap = response.result.httpServerInstance.holismInstance.config.data.memoryFileRegistrations = filterResponse.result; // Get the derived app server's service filter plug-in registration map.

      filterResponse = getServiceFilterRegistrationMapFilter.request(callbackRequest);

      if (filterResponse.error) {
        errors.push("An error occured while querying your app server for its service filter plug-in registration map:");
        errors.push(filterResponse.error);
        break;
      }

      var appServerServiceFilterRegistrationMap = response.result.httpServerInstance.holismInstance.config.data.serviceFilterRegistrations = filterResponse.result;
      break;
    }

    if (errors.length) {
      response.error = errors.join(" ");
    } // Wow... That's a lot of information ;-)
    // console.log(JSON.stringify(response, undefined, 4));


    return response;
  }
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;