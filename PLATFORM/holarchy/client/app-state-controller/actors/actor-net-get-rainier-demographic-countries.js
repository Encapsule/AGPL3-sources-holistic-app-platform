"use strict";

// sources/client/app-state-controller/actors/state-net-get-rainier-demographic-countries.js
var HttpGetRainierDataGateway = require("../../communication/http-get-rainier-data-gateway");

module.exports = {
  id: "ZaVzprxcTaWVZv1VB-mFkA",
  name: "Network Get Rainier Demographic Countries",
  description: "Initiates a data gateway request to the Rainier backend to get the set of supported demographic countries.",
  namespaces: {
    write: [{
      filterBinding: {
        alias: "netRequest",
        id: "a9_yTegtQCadukINSt2qog"
      },
      storePath: "~.base.RainierBaseController.network.GET_RainierDemographicCountries.request"
    }, {
      filterBinding: {
        alias: "netResponse",
        id: "toEjbcsrTyePGX4uRNagPw"
      },
      storePath: "~.base.RainierBaseController.network.GET_RainierDemographicCountries.response"
    }]
  },
  // namespaces
  commandSpec: {
    ____types: "jsObject",
    networkGetRainierDemographicCountries: {
      ____accept: "jsObject"
    }
  },
  // commandSpec
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      result: false
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var gatewayMessage = {
        GET: {
          backend: {
            rainier: {
              demographicCountries: request_.command
            }
          }
        }
      };
      var innerResponse = request_.namespaces.write.netRequest.request({
        appDataStore: request_.runtimeContext.appStateContext.appDataStore,
        writeData: gatewayMessage
      });

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      }

      innerResponse = HttpGetRainierDataGateway.request({
        request: gatewayMessage,
        resultHandler: function resultHandler(result_) {
          console.log("Got a response!");
          var writerResponse = request_.namespaces.write.netResponse.request({
            appDataStore: request_.runtimeContext.appStateContext.appDataStore,
            writeData: {
              error: null,
              result: result_
            }
          });

          if (writerResponse.error) {
            return {
              error: writerResponse.error
            };
          }

          request_.runtimeContext.appStateContext.appStateController.controllerRunFilter(); // Force App State Controller re-evaluation (TODO: FIX THE NAME)

          return {
            error: null,
            result: undefined
          };
        },
        errorHandler: function errorHandler(error_) {
          console.log("Got an error!");
          var writerResponse = request_.namespaces.write.netResponse.request({
            appDataStore: request_.runtimeContext.appStateContext.appDataStore,
            writeData: {
              error: error_,
              result: null
            }
          });

          if (writerResponse.error) {
            return {
              error: writerResponse.error
            };
          }

          request_.runtimeContext.appStateContext.appStateController.controllerRunFilter(); // Force App State Controller re-evaluation (TODO: FIX THE NAME)

          return {
            error: null,
            result: undefined
          };
        }
      });

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      }

      break;
    }

    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  } // bodyFunction

};