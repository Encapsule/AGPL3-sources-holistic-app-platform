"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// const arccore = require("@encapsule/arccore");
var ControllerAction =
/*#__PURE__*/
function () {
  function ControllerAction() {
    _classCallCheck(this, ControllerAction);
  }

  _createClass(ControllerAction, [{
    key: "construction",
    value: function construction(request_) {
      request_;
      this._private = {};
      this.getFilter = this.getFilter.bind(this);
    }
  }, {
    key: "getFilter",
    value: function getFilter() {
      return this._private.filter;
    }
  }]);

  return ControllerAction;
}();

module.exports = ControllerAction;