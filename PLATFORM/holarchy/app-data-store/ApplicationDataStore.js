"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// @encapsule/holistic/SOURCES/LIB/holarchy/common/data/ApplictionDataStore.js
//
var arccore = require("@encapsule/arccore");

var appDataStoreConstructorFactory = require("./lib/app-data-store-constructor-filter-factory");

var getNamespaceInReferenceFromPathFilter = require("./lib/get-namespace-in-reference-from-path");

var ApplicationDataStore =
/*#__PURE__*/
function () {
  function ApplicationDataStore(sharedAppDataStoreSpec_) {
    _classCallCheck(this, ApplicationDataStore);

    var factoryResponse = appDataStoreConstructorFactory.request(sharedAppDataStoreSpec_);

    if (factoryResponse.error) {
      throw new Error(["Unable to construct an ApplicationDataStore class instance due to an error in the application's shared data filter specification.", factoryResponse.error].join(" "));
    } // if error


    var storeConstructorFilter = factoryResponse.result;
    var filterResponse = storeConstructorFilter.request();

    if (filterResponse.error) {
      throw new Error(["Unable to construct an ApplicationDataStore class instance due to an error executing the construction filter.", filterResponse.error].join(" "));
    } // if error
    // Private implementation data...
    // Do not deference; use class methods to access private implementation data


    this._private = {
      storeData: filterResponse.result,
      storeDataSpec: storeConstructorFilter.filterDescriptor.inputFilterSpec,
      accessFilters: {
        read: {},
        write: {}
      }
    }; // API methods... Use these methods.

    this.toJSON = this.toJSON.bind(this);
    this.readNamespace = this.readNamespace.bind(this);
    this.writeNamespace = this.writeNamespace.bind(this);
  } // end constructor


  _createClass(ApplicationDataStore, [{
    key: "toJSON",
    value: function toJSON() {
      // Only return the data; no other runtime state maintained by this class instance should ever be serialized.
      return this._private.storeData;
    } // Returns an arccore.filter-style response descriptor object.

  }, {
    key: "readNamespace",
    value: function readNamespace(path_) {
      var _this = this;

      var methodResponse = {
        error: null,
        result: undefined
      };
      var errors = [];
      var inBreakScope = false;

      while (!inBreakScope) {
        inBreakScope = true; // Determine if we have already instantiated a read filter for this namespace.

        if (!this._private.accessFilters.read[path_]) {
          // Cache miss. Create a new read filter for the requested namespace.
          var operationId = arccore.identifier.irut.fromReference("read-filter" + path_).result;
          var filterResponse = getNamespaceInReferenceFromPathFilter.request({
            namespacePath: path_,
            sourceRef: this._private.storeDataSpec,
            parseFilterSpec: true
          });

          if (filterResponse.error) {
            errors.push("Cannot read app data store namespace path '".concat(path_, "' because it is not possible to construct a read filter for this namespace."));
            errors.push(filterResponse.error);
            break;
          } // if error


          var targetNamespaceSpec = filterResponse.result;
          filterResponse = arccore.filter.create({
            operationID: operationId,
            operationName: "App Data Read Filter ".concat(operationId),
            operationDescription: "Validated/normalized read operations from ADS namespace '".concat(path_, "'."),
            bodyFunction: function bodyFunction() {
              return getNamespaceInReferenceFromPathFilter.request({
                namespacePath: path_,
                sourceRef: _this._private.storeData
              });
            },
            outputFilterSpec: targetNamespaceSpec
          });

          if (filterResponse.error) {
            errors.push("Cannot read app data store namespace path '".concat(path_, "' because it is not possible to construct a read filter for this namespace."));
            errors.push(filterResponse.error);
            break;
          } // if error
          // Cache the newly-created read filter.


          this._private.accessFilters.read[path_] = filterResponse.result;
        } // if read filter doesn't exist


        var readFilter = this._private.accessFilters.read[path_];
        methodResponse = readFilter.request();
        break;
      } // end while


      if (errors.length) {
        methodResponse.error = errors.join(" ");
      }

      return methodResponse;
    } // readNamespace
    // Returns an arccore.filter-style response descriptor object.

  }, {
    key: "writeNamespace",
    value: function writeNamespace(path_, value_) {
      var _this2 = this;

      var methodResponse = {
        error: null,
        result: undefined
      };
      var errors = [];
      var inBreakScope = false;

      while (!inBreakScope) {
        inBreakScope = true; // Determine if we have already instantiated a read filter for this namespace.

        if (!this._private.accessFilters.write[path_]) {
          var _ret = function () {
            // Cache miss. Create a new write filter for the requested namespace.
            var operationId = arccore.identifier.irut.fromReference("write-filter" + path_).result;
            var pathTokens = path_.split(".");

            if (pathTokens.length < 2) {
              errors.push("Cannot write to app data store namespace '".concat(path_, "'; invalid attempt to overwrite the entire store."));
              return "break";
            } // if invalid write attempt


            var parentPath = pathTokens.slice(0, pathTokens.length - 1).join(".");
            var targetNamespace = pathTokens[pathTokens.length - 1];
            var filterResponse = getNamespaceInReferenceFromPathFilter.request({
              namespacePath: path_,
              sourceRef: _this2._private.storeDataSpec,
              parseFilterSpec: true
            });

            if (filterResponse.error) {
              errors.push("Cannot write app data store namespace path '".concat(path_, "' because it is not possible to construct a write filter for this namespace."));
              errors.push(filterResponse.error);
              return "break";
            } // if error


            var targetNamespaceSpec = filterResponse.result;
            filterResponse = arccore.filter.create({
              operationID: operationId,
              operationName: "App Data Write Filter ".concat(operationId),
              operationDescription: "Validated/normalized write to ADS namespace '".concat(path_, "'."),
              inputFilterSpec: targetNamespaceSpec,
              bodyFunction: function bodyFunction(request_) {
                var response = {
                  error: null,
                  result: undefined
                };
                var errors = [];
                var inBreakScope = false;

                while (!inBreakScope) {
                  inBreakScope = true;
                  var innerResponse = getNamespaceInReferenceFromPathFilter.request({
                    namespacePath: parentPath,
                    sourceRef: _this2._private.storeData
                  });

                  if (innerResponse.error) {
                    errors.push("Unable to write to ADS namespace '".concat(path_, "' due to an error reading parent namespace '").concat(parentPath, "'."));
                    errors.push(innerResponse.error);
                    break;
                  }

                  var parentNamespace = innerResponse.result;
                  parentNamespace[targetNamespace] = request_; // the actual write

                  response.result = request_; // return the validated/normalized data written to the ADS

                  break;
                }

                if (errors.length) {
                  response.error = errors.join(" ");
                }

                return response;
              }
            });

            if (filterResponse.error) {
              errors.push("Cannot write app data store namespace path '".concat(path_, "' because it is not possible to construct a write filter for this namespace."));
              errors.push(filterResponse.error);
              return "break";
            } // if error
            // Cache the newly-created write filter.


            _this2._private.accessFilters.write[path_] = filterResponse.result;
          }();

          if (_ret === "break") break;
        } // if write filter doesn't exist


        var writeFilter = this._private.accessFilters.write[path_];
        methodResponse = writeFilter.request(value_);
        break;
      } // end while


      if (errors.length) {
        methodResponse.error = errors.join(" ");
      }

      return methodResponse;
    } // writeNamespace

  }]);

  return ApplicationDataStore;
}(); // class ApplicationDataStore


module.exports = ApplicationDataStore;