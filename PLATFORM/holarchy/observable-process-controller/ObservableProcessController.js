"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var constructorRequestFilter = require("./ObservableProcessController-constructor-filter");

var ObservableProcessController =
/*#__PURE__*/
function () {
  function ObservableProcessController(request_) {
    _classCallCheck(this, ObservableProcessController);

    // Allocate private, per-class-instance state.
    this._private = {}; // Normalize the incoming request descriptor object.

    var filterResponse = constructorRequestFilter.request(request_);

    if (filterResponse.error) {
      throw new Error(filterResponse.error);
    } // Keep a copy of the normalized request passed to the constructor.


    this._private.request = filterResponse.result; // Bind instance methods.

    this.toJSON = this.toJSON.bind(this);
    this.act = this.act.bind(this);
  }

  _createClass(ObservableProcessController, [{
    key: "toJSON",
    value: function toJSON() {
      return this._private;
    }
  }, {
    key: "act",
    value: function act(request_) {
      request_;
    }
  }]);

  return ObservableProcessController;
}();

module.exports = ObservableProcessController;