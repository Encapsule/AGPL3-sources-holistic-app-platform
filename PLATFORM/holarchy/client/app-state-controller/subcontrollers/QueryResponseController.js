"use strict";

// sources/client/app-state-controller/subcontrollers/QueryResponseController.js
module.exports = {
  name: "QueryResponseController",
  description: "Tracks the state of a Rainier adhoc query submission and processing of the response.",
  stateNamespace: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryResult.state",
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
    description: "Waiting for dependencies to initialize.",
    transitions: [{
      nextState: "initializing",
      operator: {
        inState: "RainierBaseController:ready"
      }
    }]
  }, {
    name: "initializing",
    description: "Waiting for system to initialize.",
    transitions: [{
      nextState: "idle",
      operator: {
        inState: "QueryBuilderController:ready"
      }
    }]
  }, {
    name: "idle",
    description: "Waiting for for a query to be submitted.",
    transitions: [{
      nextState: "working",
      operator: {
        inState: "QueryBuilderController:submitted"
      }
    }]
  }, {
    name: "working",
    description: "Query in progress. Waiting for response.",
    actions: {
      exit: [{
        copy: {
          a: "~.base.RainierBaseController.network.POST_RainierAdhocQuery.response",
          b: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryResult.response"
        }
      }]
    },
    transitions: [{
      nextState: "ready",
      operator: {
        inState: "POST_RainierAdhocQueryController:ready"
      }
    }, {
      nextState: "error",
      operator: {
        inState: "POST_RainierAdhocQueryController:error"
      }
    }]
  }, {
    name: "ready",
    description: "Query completed successfully. Result is valid."
  }, {
    name: "error",
    description: "Query completed with error. Result is invalid."
  }, {
    name: "offline",
    description: "No queries can be executed because the system did not initialize correctly."
  }]
};