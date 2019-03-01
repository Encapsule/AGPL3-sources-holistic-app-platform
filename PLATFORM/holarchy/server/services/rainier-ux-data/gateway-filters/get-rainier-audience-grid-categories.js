"use strict";

// sources/server/services/service-rainier-ux-data/gateway-filters/get-rainier-ag-categories.js
var dataGatewayFilterFactory = require("../lib/data-gateway-filter-factory");

var buildProxyHeaders = require("../lib/build-outgoing-headers-for-backend-proxy");

var rainierProxyGetCategories = require("../../../communication/rainier/get-audience-grid-categories-request-filter");

var factoryResponse = dataGatewayFilterFactory.request({
  id: "lALGtnDaSke8oRs_0aBolg",
  name: "GET Rainier Audience Grid Categories",
  description: "Proxies a request to the Rainier backend to get audience grid categories",
  gatewayMessageSpec: {
    ____types: "jsObject",
    GET: {
      ____types: "jsObject",
      backend: {
        ____types: "jsObject",
        rainier: {
          ____types: "jsObject",
          audienceGridCategories: {
            ____types: "jsObject",
            pcode: {
              ____label: "Advertiser pcode",
              ____description: "The current advertiser pcode to be included in the qaccount header",
              ____accept: "jsString" // pcode

            } // audienceGridCategories

          } // rainier

        } // backend

      } // GET

    }
  },
  // gatewayMessageSpec
  gatewayMessageHandler: function gatewayMessageHandler(gatewayRequest_) {
    var response = {
      error: null,
      result: null
    };
    var errors = [];
    var inBreakScope = false;

    var _loop = function _loop() {
      inBreakScope = true;
      var response_filters = gatewayRequest_.gatewayServiceFilterRequest.response_filters;
      var streams = gatewayRequest_.gatewayServiceFilterRequest.streams;
      var integrations = gatewayRequest_.gatewayServiceFilterRequest.integrations;
      var request_descriptor = gatewayRequest_.gatewayServiceFilterRequest.request_descriptor;
      var pcode = gatewayRequest_.gatewayMessage.GET.backend.rainier.audienceGridCategories.pcode;
      httpProxyResponse = rainierProxyGetCategories.request({
        options: {
          headers: buildProxyHeaders(gatewayRequest_, pcode)
        },
        resultHandler: function resultHandler(result_) {
          console.log("rainierProxyGetAudienceGridCategories.result");
          console.log(JSON.stringify(result_, undefined, 4));
          response_filters.result.request({
            streams: streams,
            integrations: integrations,
            request_descriptor: request_descriptor,
            response_descriptor: {
              http: {
                code: 200,
                message: "Rainier!"
              },
              content: {
                encoding: "utf8",
                type: "application/json"
              },
              data: result_
            }
          });
        },
        errorHandler: function errorHandler(error_) {
          console.log("Errror getting audience grid categories");
          console.log(JSON.stringify(error_, undefined, 4));
          response_filters.result.request({
            streams: streams,
            integrations: integrations,
            request_descriptor: request_descriptor,
            response_descriptor: {
              http: {
                code: 400
              },
              content: {
                encoding: "utf8",
                type: "application/json"
              },
              data: {
                error_message: error_,
                error_context: {
                  source_tag: "rainier-ux-base::X2f_jJgqRe2m9nXt7PnNJw"
                }
              }
            }
          });
        }
      });

      if (httpProxyResponse.error) {
        errors.push(httpProxyResponse.error);
        return "break";
      } // No meaningful response.result.


      return "break";
    };

    while (!inBreakScope) {
      var httpProxyResponse;

      var _ret = _loop();

      if (_ret === "break") break;
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