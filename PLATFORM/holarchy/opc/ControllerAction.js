"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var constructorFilter = require("./filters/cac-method-constructor-filter");

module.exports =
/*#__PURE__*/
function () {
  function ControllerAction(constructionData_) {
    _classCallCheck(this, ControllerAction);

    var filterResponse = constructorFilter.request(constructionData_);

    if (filterResponse.error) {
      throw new Error(filterResponse.error);
    }

    this._private = {
      controllerActionFilter: filterResponse.result
    };
    this.getFilter = this.getFilter.bind(this);
  }

  _createClass(ControllerAction, [{
    key: "getFilter",
    value: function getFilter() {
      return this._private.controllerActionFilter;
    }
  }]);

  return ControllerAction;
}();