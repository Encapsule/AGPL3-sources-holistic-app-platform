"use strict";

// sources/server/services/service-rainier-ux-data/gateway-filters/get-rainier-demographic-categories.js
var dataGatewayFilterFactory = require("../lib/data-gateway-filter-factory"); // These can be derived from parsing rainier categories, but they rarely change
// so listing them here with nice labeling.


var geoCategories = {
  categoryGroup: "GEO",
  categories: [{
    label: "City",
    id: "/qc/geo/city"
  }, {
    label: "Country",
    id: "/qc/geo/country"
  }, {
    label: "Metro",
    id: "/qc/geo/metro"
  }, {
    label: "Postal code",
    id: "/qc/geo/postal-code"
  }, {
    label: "Region",
    id: "/qc/geo/region"
  }]
};
var factoryResponse = dataGatewayFilterFactory.request({
  id: "lNnNu3wNS9GJRy0h7E8IKA",
  name: "GET Rainier Geo Categories",
  description: "Retrieves a list of geo categories",
  gatewayMessageSpec: {
    ____types: "jsObject",
    GET: {
      ____types: "jsObject",
      backend: {
        ____types: "jsObject",
        rainier: {
          ____types: "jsObject",
          geographicCategories: {
            ____accept: "jsObject" // TODO: parameterize this specification

          } // rainier

        } // backend

      } // POST

    }
  },
  // gatewayMessageSpec
  gatewayMessageHandler: function gatewayMessageHandler(gatewayRequest_) {
    console.log("..... " + module.exports.filterDescriptor.operationID + "::" + module.exports.filterDescriptor.operationName);
    var response = {
      error: null,
      result: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var gatewayServiceRequest = gatewayRequest_.gatewayServiceFilterRequest;
      var httpResponseFilters = gatewayServiceRequest.response_filters;
      var resultResponderResponse = httpResponseFilters.result.request({
        streams: gatewayServiceRequest.streams,
        integrations: gatewayServiceRequest.integrations,
        request_descriptor: gatewayServiceRequest.request_descriptor,
        response_descriptor: {
          http: {
            code: 200
          },
          content: {
            encoding: "utf8",
            type: "application/json"
          },
          data: {
            youPassedMe: gatewayRequest_.gatewayMessage,
            data: geoCategories
          }
        }
      });

      if (resultResponderResponse.error) {
        httpResponseFilters.result.request({
          streams: gatewayServiceRequest.streams,
          integrations: gatewayServiceRequest.integrations,
          request_descriptor: gatewayServiceRequest.request_descriptor,
          response_descriptor: {
            http: {
              code: 500
            },
            content: {
              encoding: "utf8",
              type: "application/json"
            },
            data: {
              error_message: resultResponderResponse.error,
              error_context: {
                source_tag: "rainier-ux-base::hGUP_Se-RJybVFSbzzMVmA"
              }
            }
          }
        });
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