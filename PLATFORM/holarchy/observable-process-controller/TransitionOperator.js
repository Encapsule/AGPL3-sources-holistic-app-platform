"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var transitionOperatorDefinitionFilter = require("./lib/transition-operator-definition-filter");

var TransitionOperator = function TransitionOperator(constructionData_) {
  _classCallCheck(this, TransitionOperator);

  var filterResponse = transitionOperatorDefinitionFilter.request(constructionData_);

  if (filterResponse.error) {
    throw new Error(filterResponse.error);
  }

  this._private.transitionOperatorFilter = filterResponse.result;
};

module.exports = TransitionOperator;