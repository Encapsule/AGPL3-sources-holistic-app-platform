"use strict";

// sources/common/data/app-data-store-read-filter-factory.js
var arccore = require("@encapsule/arccore");

var getNamespaceInReferenceFromPath = require("./get-namespace-in-reference-from-path");

var factoryResponse = arccore.filter.create({
  operationID: "VCDpJOCVSCyYigCzr0fkCA",
  operationName: "App Data Store Read Filter Factory",
  operationDescription: "Responsible for constructing an app data store read filter.",
  inputFilterSpec: {
    ____label: "App Data Store Read Filter Factory Request",
    ____types: "jsObject",
    appDataStoreFilterSpec: {
      ____label: "Application State Data Store Filter Specification",
      ____description: "A reference to the app data store's master filter specification.",
      ____accept: "jsObject"
    },
    appStateContext: {
      ____label: "App State Context",
      ____accept: "jsObject"
    },
    id: {
      ____label: "Write Filter Operation ID",
      ____description: "The 22-character IRUT identifier to be used for the generated app data store read filter.",
      ____accept: "jsString"
    },
    namespacePath: {
      ____label: "State Namespace Path",
      ____description: "A dot-delimited ARCcore.filter-format namespace path specification path beginngin with ~.",
      ____accept: "jsString"
    }
  },
  // inputFilterSpec
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      result: null
    };
    var errors = [];
    var inBreakScope = false;

    var _loop = function _loop() {
      inBreakScope = true;

      if (!request_.namespacePath.length) {
        errors.push("Invalid zero-length namespacePath value specified.");
        return "break";
      }

      if (!request_.namespacePath.startsWith("~")) {
        errors.push("Invalid namespacePath value must be a dot-delimited ARCcore.filter namespace path beginning in `~`.");
        return "break";
      } // Retrieve the filter specification node from the application data store constructor filter.


      innerResponse = getNamespaceInReferenceFromPath.request({
        namespacePath: request_.namespacePath,
        sourceRef: request_.appDataStoreFilterSpec
      });

      if (innerResponse.error) {
        errors.push("Unable to retrieve a filter specification node for path '" + request_.namespacePath + "' due a fatal error:");
        errors.push(innerResponse.error);
        return "break";
      }

      var namespaceFilterSpec = innerResponse.result;

      if (!namespaceFilterSpec || !(namespaceFilterSpec.____types || namespaceFilterSpec.____accept || namespaceFilterSpec.____opaque)) {
        errors.push("Invalid or undefined app data store namespace path '" + request_.namespacePath + "'.");
        return "break";
      } // DEFINE A CUSTOM FACTORY INLINE TO CONSTRUCT THE SPECIALIZED APP DATA STORE READ FILTER.


      createReadFilter = function createReadFilter() {
        var appStateContext = request_.appStateContext;
        var appDataStorePath = request_.namespacePath;
        return arccore.filter.create({
          operationID: request_.id,
          operationName: namespaceFilterSpec.____label + " Read Filter",
          operationDescription: "Reads application data store namespace '" + appDataStorePath + "'.",
          inputFilterSpec: {
            ____accept: "jsUndefined"
          },
          // no request parameters
          bodyFunction: function bodyFunction() {
            var response = {
              error: null,
              result: undefined
            };
            var errors = [];
            var inBreakScope = false;

            while (!inBreakScope) {
              inBreakScope = true;
              console.log(["STATE READ <<< ", this.operationID, "::", this.operationName, " '", appDataStorePath, "'"].join(""));
              var innerResponse = getNamespaceInReferenceFromPath.request({
                namespacePath: appDataStorePath,
                sourceRef: appStateContext.appDataStore
              });

              if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
              }

              response.result = innerResponse.result;
              break;
            }

            if (errors.length) response.error = errors.join(" ");
            return response;
          },
          outputFilterSpec: namespaceFilterSpec
        });
      }; // createReadFilter


      innerResponse = createReadFilter();

      if (innerResponse.error) {
        errors.push("Unable to construct the requested read filter due to error.");
        errors.push(innerResponse.error);
        return "break";
      }

      response.result = innerResponse.result;
      return "break";
    };

    while (!inBreakScope) {
      var innerResponse;
      var createReadFilter;

      var _ret = _loop();

      if (_ret === "break") break;
    }

    if (errors.length) response.error = errors.join(" ");
    return response;
  },
  // bodyFunction
  outputFilterSpec: {
    ____label: "App Data Store Read Filter",
    ____accept: "jsObject" // outputFilterSpec

  }
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;