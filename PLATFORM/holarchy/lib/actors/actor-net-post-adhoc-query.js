"use strict";

// sources/client/app-state-controller/actors/state-actor-net-post-adhoc-query.js
var HttpPostRainierDataGateway = require("../../communication/http-post-rainier-data-gateway");

module.exports = {
  id: "SF6xJxf1R3-MpTrxmsaptA",
  name: "Network POST Rainier Adhoc Query",
  description: "Performs Rainier ad hoc query POST operation to the Node.js app server that relays it to the Rainier API service.",
  namespaces: {
    read: [{
      filterBinding: {
        alias: "netRequest",
        id: "xt172wWBSlSdsyAXKj9jjg"
      },
      storePath: "~.base.RainierBaseController.network.POST_RainierAdhocQuery.request"
    }],
    write: [{
      filterBinding: {
        alias: "netResponse",
        id: "Rx-VjHLlS4eQiMw98sv9KA"
      },
      storePath: "~.base.RainierBaseController.network.POST_RainierAdhocQuery.response"
    }]
  },
  // namespaces
  commandSpec: {
    ____types: "jsObject",
    actorNetPostRainierAdhocQuery: {
      ____types: "jsObject" // acts upon data in the app data store

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
      var innerResponse = request_.namespaces.read.netRequest.request();

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      }

      var gatewayRequestMessageBody = innerResponse.result;
      var gatewayRequest = {
        POST: {
          backend: {
            rainier: {
              adhocQuery: gatewayRequestMessageBody
            }
          }
        }
      };
      innerResponse = HttpPostRainierDataGateway.request({
        request: gatewayRequest,
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

          request_.runtimeContext.appStateContext.appStateController.controllerRunFilter(); // Update App State Controller subcontroller states.

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
              result: undefined
            }
          });

          if (writerResponse.error) {
            return {
              error: writerResponse.error
            };
          }

          request_.runtimeContext.appStateContext.appStateController.controllerRunFilter(); // Update App State Controller subcontroller states.

          return {
            error: null,
            result: undefined
          };
        }
      });

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      } // The synchronous bodyFunction doesn't return a meaningful result if it succeeds.


      break;
    }

    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  } // bodyFunction

};