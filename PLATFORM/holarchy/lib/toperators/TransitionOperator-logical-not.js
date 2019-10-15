"use strict";

var TransitionOperator = require("../../opc/TransitionOperator");

module.exports = new TransitionOperator({
  id: "TLSHkl73SO-utuzM7dyN2g",
  name: "NOT Transition Expression Operator",
  description: "Input negation operator.",
  operatorFilterSpec: {
    ____types: "jsObject",
    not: {
      ____accept: "jsObject"
    }
  },
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      result: true
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var operatorResponse = request_.context.transitionOperatorsDiscriminator.request({
        context: request_.context,
        operator: request_.operator.not
      });

      if (operatorResponse.error) {
        errors.push("In transition operator NOT process operatorRequest='" + JSON.stringify(request_.operator.not) + "':");
        errors.push(operatorResponse.error);
        break;
      }

      if (operatorResponse.result) {
        response.result = false;
        break;
      }
    }

    if (errors.length) response.error = errors.join(" ");
    return response;
  }
});