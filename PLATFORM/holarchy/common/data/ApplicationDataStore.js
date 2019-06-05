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
    this.readNamespace = this.readNamespace.bind(this);
    this.writeNamespace = this.writeNamespace.bind(this);
  } // end constructor


  _createClass(ApplicationDataStore, [{
    key: "readNamespace",
    value: function readNamespace(path_) {
      if (!this.accessFilters.read[path_]) {
        var operationId = arccore.identifier.irut.fromReference("read-filter" + path_).result;
        var response = getNamespaceInReferenceFromPathFilter.request({
          namespacePath: path_,
          sourceRef: this.storeDataSpec
        });

        if (response.error) {
          throw new Error(["Cannot read app data store namespace path '" + path_ + "' because it's not possible to construct a read filter for this namespace.", response.error].join(" "));
        } // if error


        var targetNamespaceSpec = response.result;
        response = arccore.filter.create({
          operationID: operationId,
          operationName: "App Data Read Filter " + operationId,
          operationDescription: "Performs a filtered read operation on shared app data store namespace '" + path_ + "'.",
          inputFilterSpec: targetNamespaceSpec
        });

        if (response.error) {
          throw new Error(["Cannot read app data store namespace path '" + path_ + "' because it's not possible to construct a read filter for this namespace.", response.error].join(" "));
        } // if error


        this.accessFilters.read[path_] = response.result;
      }
    } // readNamespace

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