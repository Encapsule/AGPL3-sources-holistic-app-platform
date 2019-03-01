"use strict";

// sources/client/app-state-controller/subcontrollers/RainierBaseNetworkController.js
//
module.exports = {
  name: "RainierBaseNetworkController",
  description: "Manages the state of network I/O to/from the client HTML application.",
  stateNamespace: "~.base.RainierBaseController.network.state",
  states: [{
    name: "uninitialized",
    description: "Required initial state.",
    transitions: [{
      nextState: "idle",
      operator: {
        always: true
      }
    }]
  }, {
    name: "idle",
    description: "No data gateway network requests currently running.",
    transitions: [{
      nextState: "working",
      operator: {
        not: {
          dictionaryCardinalityEqual: {
            namespace: "~.base.RainierBaseController.network.requestQueue",
            value: 0
          }
        }
      }
    }]
  }, {
    name: "working",
    description: "One or more data gateway network requests is currently running.",
    transitions: [{
      nextState: "idle",
      operator: {
        dictionaryCardinalityEqual: {
          namespace: "~.base.RainierBaseController.network.requestQueue",
          value: 0
        }
      }
    }]
  }]
};