"use strict";

// transition-operator-always-filter.js
var transitionOperatorFilterFactory = require("../app-state-controller-toperator-factory");

var factoryResponse = transitionOperatorFilterFactory.request({
  id: "e89cwnP4Qd6MocAhzdOJgw",
  name: "Always (TRUE) Transition Operator",
  description: "Always returns true forcing a state transition to occur.",
  operatorFilterSpec: {
    ____types: "jsObject",
    always: {
      ____accept: "jsBoolean",
      ____inValueSet: [true]
    }
  },
  bodyFunction: function bodyFunction() {
    return {
      error: null,
      result: true
    };
  }
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;