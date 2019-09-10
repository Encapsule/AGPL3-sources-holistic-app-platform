"use strict";

// sources/server/services/service-rainier-ux-data/data-gateway-router-factory.js
var arccore = require("@encapsule/arccore");

var factoryResponse = arccore.filter.create({
  operationID: "8q8sOAYyT5K9oviGZumYgQ",
  operationName: "Data Gateway Router Factory",
  operationDescription: "Constructs a filter that routes its request to an appropriate holism service filter for further processing.",
  inputFilterSpec: {
    ____label: "Data Gateway Router Factory Request",
    ____types: "jsObject",
    serviceFilters: {
      ____label: "Service Filter Array",
      ____types: "jsArray",
      serviceFilter: {
        ____label: "Data Gateway Filter Object",
        ____accept: "jsObject"
      }
    }
  },
  // inputFilterSpec
  bodyFunction: function bodyFunction(factoryRequest_) {
    var response = {
      error: null,
      result: null
    };
    var errors = [];
    var inBreakScope = false;

    var _loop = function _loop() {
      inBreakScope = true;
      var serviceFilterMap = {};
      var routingFilters = [];
      var ids = [];
      factoryRequest_.serviceFilters.forEach(function (serviceFilter_) {
        var innerRequestFilter = serviceFilter_.implementation.innerRequestFilter;
        var innerRequestFilterId = innerRequestFilter.filterDescriptor.operationID;

        if (serviceFilterMap[innerRequestFilterId]) {
          errors.push("Duplicate service filter ID '".concat(serviceFilter_.filterDescriptor.operationID, "'."));
        } else {
          serviceFilterMap[innerRequestFilterId] = serviceFilter_;
          routingFilters.push(innerRequestFilter);
          ids.push(innerRequestFilterId);
        }
      });

      if (errors.length) {
        return "break";
      }

      var innerFactoryResponse = arccore.discriminator.create({
        filters: routingFilters,
        options: {
          action: "getFilterID"
        }
      });

      if (innerFactoryResponse.error) {
        errors.push(innerFactoryResponse.error);
        return "break";
      }

      var discriminator = innerFactoryResponse.result;
      var routerId = arccore.identifier.irut.fromReference(ids.join("")).result;
      innerFactoryResponse = arccore.filter.create({
        operationID: routerId,
        operationName: "Data Gateway Message Router",
        operationDescription: "1:N routing to [".concat(ids.join(", "), "]..."),
        bodyFunction: function bodyFunction(request_) {
          // Pass the incoming request into our specialized arccore.discriminator instance.
          // It will either reject the request message. Or, it will tell us the IRUT identifier
          // of the target service's inner request processor filter which is responsible for
          // validating/normalizing the incoming HTTP request...
          var discriminatorResponse = discriminator.request(request_); // Did the discriminator reject the request message?

          if (discriminatorResponse.error) {
            return discriminatorResponse;
          }

          var targetServiceInnerRequestFilterId = discriminatorResponse.result;
          var targetServiceFilter = serviceFilterMap[targetServiceInnerRequestFilterId];
          var delegationResponse = targetServiceFilter.request(request_);
          return delegationResponse;
        }
      });

      if (innerFactoryResponse.error) {
        errors.push(innerFactoryResponse.error);
        return "break";
      }

      response.result = innerFactoryResponse.result;
      return "break";
    };

    while (!inBreakScope) {
      var _ret = _loop();

      if (_ret === "break") break;
    }

    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  },
  // bodyFunction
  outputFilterSpec: {
    ____label: "Data Gateway Router Filter",
    ____description: "An arccore.discriminator filter instance used to route incoming data gateway request messages from the HTTP layer to a specific request handler for servicing.",
    ____accept: "jsObject"
  }
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;