"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var transitionOperatorDefinitionFilter = require("./lib/transition-operator-definition-filter");

var TransitionOperator =
/*#__PURE__*/
function () {
  function TransitionOperator(constructionData_) {
    _classCallCheck(this, TransitionOperator);

    var filterResponse = transitionOperatorDefinitionFilter.request(constructionData_);

    if (filterResponse.error) {
      throw new Error(filterResponse.error);
    }

    this._private.transitionOperatorFilter = filterResponse.result;
    this.getFilter = this.getFilter.bind(this);
  }

  _createClass(TransitionOperator, [{
    key: "getFilter",
    value: function getFilter() {
      return this._private.transitionOperatorFilter;
    }
  }]);

  return TransitionOperator;
}();

module.exports = TransitionOperator;