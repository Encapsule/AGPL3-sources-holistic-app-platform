"use strict";

// sources/client/app-state-controller/actors/state-net-get-rainier-data-availability.js
var HttpGetRainierDataGateway = require("../../communication/http-get-rainier-data-gateway");

module.exports = {
  id: "lGf3BFZ7QK-73gUW5nBS3g",
  name: "Network Get Rainier Data Availability",
  description: "Initiates a data gateway request to the Rainier backend to get data source availability and last update information.",
  namespaces: {
    read: [{
      filterBinding: {
        alias: "selectedAdvertiser",
        id: "AagDpBleQpGZCOxChy-RcQ"
      },
      storePath: "~.base.RainierBaseController.selectedAdvertiser.pcode"
    }],
    write: [{
      filterBinding: {
        alias: "netRequest",
        id: "nZEWAjY4RAagF2S21EniKQ"
      },
      storePath: "~.base.RainierBaseController.network.GET_RainierDataAvailability.request"
    }, {
      filterBinding: {
        alias: "netResponse",
        id: "6pprzJE2T5G8Qg8BdOKhSg"
      },
      storePath: "~.base.RainierBaseController.network.GET_RainierDataAvailability.response"
    }]
  },
  // namespaces
  commandSpec: {
    ____types: "jsObject",
    networkGetRainierDataAvailability: {
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
      var innerResponse = request_.namespaces.read.selectedAdvertiser.request();

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      }

      var pcode = innerResponse.result;
      var gatewayMessage = {
        GET: {
          backend: {
            rainier: {
              dataAvailability: {
                pcode: pcode
              }
            }
          }
        }
      };
      innerResponse = request_.namespaces.write.netRequest.request({
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