"use strict";

// sources/client/app-state-controller/subcontrollers/templates/net-controller-generator.js
var arccore = require("@encapsule/arccore");

var factoryResponse = arccore.filter.create({
  operationID: "ZCEWCKkSSnqxBb4f39igPw",
  operationName: "Network Controller Template",
  operationDescription: "Generates a network controller definition from developer-specified inputs.",
  inputFilterSpec: {
    ____types: "jsObject",
    namespaceName: {
      ____label: "Network Controller Namespace Name",
      ____accept: "jsString" // e.g. 'Foo' --> '~.base.RainierBaseController.network.Foo'

    }
  },
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      result: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var subcontrollerName = request_.namespaceName + "Controller";
      var networkNamespace = "~.base.RainierBaseController.network";
      var subcontrollerNamespace = [networkNamespace, request_.namespaceName].join(".");
      var subcontrollerStateNamespace = [subcontrollerNamespace, "state"].join(".");
      var subcontrollerRequestNamespace = [subcontrollerNamespace, "request"].join(".");
      var subcontrollerResponseNamespace = [subcontrollerNamespace, "response"].join(".");
      response.result = {
        name: subcontrollerName,
        description: "Tracks process steps required to make remote data request.",
        stateNamespace: subcontrollerStateNamespace,
        states: [{
          name: "uninitialized",
          description: "Reserved initial state name.",
          transitions: [{
            nextState: "waiting",
            operator: {
              always: true
            }
          }]
        }, {
          name: "waiting",
          description: "Controller is waiting on selected advertiser.",
          transitions: [{
            nextState: "idle",
            operator: {
              inState: "RainierBaseSelectedAdvertiserController:ready"
            }
          }]
        }, {
          name: "idle",
          description: "Selected advertiser is set. Waiting for request.",
          transitions: [{
            nextState: "reset",
            operator: {
              not: {
                inState: "RainierBaseSelectedAdvertiserController:ready"
              }
            }
          }, {
            nextState: "working",
            operator: {
              exists: subcontrollerRequestNamespace
            }
          }]
        }, {
          name: "working",
          description: "Controller request is in progress.",
          transitions: [{
            nextState: "evaluate",
            operator: {
              exists: subcontrollerResponseNamespace
            }
          }]
        }, {
          name: "evaluate",
          description: "Controller has received a response which it is evaluating.",
          transitions: [{
            nextState: "reset",
            operator: {
              not: {
                inState: "RainierBaseSelectedAdvertiserController:ready"
              }
            }
          }, {
            nextState: "error",
            operator: {
              filterError: subcontrollerResponseNamespace
            }
          }, {
            nextState: "ready",
            operator: {
              always: true
            }
          }]
        }, {
          name: "ready",
          description: "Controller data is valid and ready to use.",
          transitions: [{
            nextState: "reset",
            operator: {
              inState: "RainierBaseController:reset"
            }
          }]
        }, {
          name: "reset",
          description: "Controller prerequisites have changed and controller data is now invalid.",
          actions: {
            enter: [{
              delete: subcontrollerRequestNamespace
            }, {
              delete: subcontrollerResponseNamespace
            }]
          },
          transitions: [{
            nextState: "idle",
            operator: {
              always: true
            }
          }]
        }, {
          name: "error",
          description: "An error has occurred.",
          transitions: [{
            nextState: "reset",
            operator: {
              inState: "RainierBaseController:reset"
            }
          }]
        }]
      };
      break;
    }

    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  } // bodyFunction

});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;