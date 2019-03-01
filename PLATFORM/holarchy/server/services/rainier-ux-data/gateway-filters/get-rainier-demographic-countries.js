"use strict";

// sources/server/services/service-rainier-ux-data/gateway-filters/get-rainier-demographic-countries.js
var dataGatewayFilterFactory = require("../lib/data-gateway-filter-factory");

var countries = [{
  countryCode: "US",
  name: "United States"
}, {
  countryCode: "DE",
  name: "Germany"
}, {
  countryCode: "FR",
  name: "France"
}, {
  countryCode: "UK",
  name: "United Kingdom"
}, {
  countryCode: "IT",
  name: "Italy"
}, {
  countryCode: "NZ",
  name: "New Zealand"
}];
var factoryResponse = dataGatewayFilterFactory.request({
  id: "jglTHPi5TUKUmbjW_BQlGA",
  name: "GET Rainier Demographic Countries",
  description: "Retrieve a list of countries that for which specific segment categories are defined by the Rainier backend.",
  gatewayMessageSpec: {
    ____types: "jsObject",
    GET: {
      ____types: "jsObject",
      backend: {
        ____types: "jsObject",
        rainier: {
          ____types: "jsObject",
          demographicCountries: {
            ____types: "jsObject"
          } // rainier

        } // backend

      } // POST

    }
  },
  // gatewayMessageSpec
  gatewayMessageHandler: function gatewayMessageHandler(gatewayMessage_) {
    console.log("..... " + module.exports.filterDescriptor.operationID + "::" + module.exports.filterDescriptor.operationName);
    var response = {
      error: null,
      result: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var gatewayServiceRequest = gatewayMessage_.gatewayServiceFilterRequest;
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
            youPassedMe: gatewayMessage_.gatewayMessage,
            data: countries
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
                source_tag: "rainier-ux-base::ImSYodkMTjyBJTSBpV_Seg"
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