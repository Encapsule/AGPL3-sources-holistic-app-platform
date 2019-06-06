"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// @encapsule/holistic/SOURCES/LIB/holarchy/common/data/ApplictionDataStore.js
//
var arccore = require("@encapsule/arccore");

var appDataStoreConstructorFactory = require("./app-data-store-constructor-factory");

var getNamespaceInReferenceFromPathFilter = require("./get-namespace-in-reference-from-path");

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


    this.storeData = filterResponse.result;
    this.storeDataSpec = storeConstructorFilter.filterDescriptor.inputFilterSpec;
    this.accessFilters = {
      read: {},
      write: {}
    };
    this.toJSON = this.toJSON.bind(this);
    this.readNamespace = this.readNamespace.bind(this);
    this.writeNamespace = this.writeNamespace.bind(this);
  } // end constructor


  _createClass(ApplicationDataStore, [{
    key: "toJSON",
    value: function toJSON() {
      // Only return the data; no other runtime state maintained by this class instance should ever be serialized.
      return this.storeData;
    } // Returns an arccore.filter-style response descriptor object.

  }, {
    key: "readNamespace",
    value: function readNamespace(path_) {
      var methodResponse = {
        error: null,
        result: undefined
      };
      var errors = [];
      var inBreakScope = false;

      while (!inBreakScope) {
        inBreakScope = true; // Determine if we have already instantiated a read filter for this namespace.

        if (!this.accessFilters.read[path_]) {
          // Cache miss. Create a new read filter for the requested namespace.
          var operationId = arccore.identifier.irut.fromReference("read-filter" + path_).result;
          var filterResponse = getNamespaceInReferenceFromPathFilter.request({
            namespacePath: path_,
            sourceRef: this.storeDataSpec
          });

          if (filterResponse.error) {
            errors.push("Cannot read app data store namespace path '".concat(path_, "' because it is not possible to construct a read filter for this namespace."));
            errors.push(filterResponse.error);
            break;
          } // if error


          var targetNamespaceSpec = filterResponse.result;
          filterResponse = arccore.filter.create({
            operationID: operationId,
            operationName: "App Data Filter ".concat(operationId),
            operationDescription: "Validate/normalize data for ADS namespace '".concat(path_, "'."),
            outputFilterSpec: targetNamespaceSpec
          });

          if (filterResponse.error) {
            errors.push("Cannot read app data store namespace path '".concat(path_, "' because it is not possible to construct a read filter for this namespace."));
            errors.push(filterResponse.error);
            break;
          } // if error
          // Cache the newly-created read filter.


          this.accessFilters.read[path_] = filterResponse.result;
        } // if read filter doesn't exist
        // const readFilter = this.accessFilters.read[path_];

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
      path_;
      value_;
    } // writeNamespace

  }]);

  return ApplicationDataStore;
}();

module.exports = ApplicationDataStore;