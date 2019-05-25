"use strict";

// sources/common/rainier-app-data-store/app-data-store-constructor-factory.js
//
var arccore = require("@encapsule/arccore");

var holisticApplicationDataModelSpec = require("../filter-specs/data/");

var factoryResponse = arccore.filter.create({
  operationID: "Umc09pbMT-2exlufs5X-6Q",
  operationName: "Application Data Store Constructor Factory",
  operationDescription: "Produces a filter used to construct a holistic application data store instance (aka JSON document).",
  inputFilterSpec: {
    ____label: "Application Data Model Specification",
    ____description: "A filter specification object that schematizes the the `derived` namespace of the application data store object.",
    ____accept: "jsObject"
  },
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      response: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var appDataStoreSpec = arccore.util.clone(holisticApplicationDataModelSpec);
      appDataStoreSpec.holisticApplicationData_2k6VQsiuSb2ghMX6Wt1eKQ.application = request_;
      var innerFactoryResponse = arccore.filter.create({
        operationID: "3aDV_cacQByO0tTzVrBxnA",
        operationName: "Aplication Data Store Constructor",
        operationDescription: "Constructs an in-memory data structure used to store application state data at runtime.",
        inputFilterSpec: appDataStoreSpec
      });

      if (innerFactoryResponse.error) {
        errors.push(innerFactoryResponse.error);
        break;
      }

      response.result = innerFactoryResponse.result;
      break;
    }

    if (errors.length) response.error = errors.join(" ");
    return response;
  },
  outputFilterSpec: {
    ____label: "Application Data Store Constructor Filter",
    ____types: "jsObject",
    filterDescriptor: {
      ____accept: "jsObject"
    },
    request: {
      ____accept: "jsFunction"
    }
  }
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;