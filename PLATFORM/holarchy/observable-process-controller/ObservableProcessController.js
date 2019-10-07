"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var constructorFilter = require("./ObservableProcessController-constructor-filter");

var ApplicationStateController =
/*#__PURE__*/
function () {
  function ApplicationStateController(request_) {
    _classCallCheck(this, ApplicationStateController);

    // Allocate private, per-class-instance state.
    this._private = {}; // Normalize the incoming request descriptor object.

    var filterResponse = constructorFilter.request(request_);

    if (filterResponse.error) {
      throw new Error(filterResponse.error);
    }

    var request = filterResponse.result;
    this._private.request = request; // Bind instance methods.

    this.toJSON = this.toJSON.bind(this);
    this.callActionFilter = this.callActionFilter.bind(this);
  }

  _createClass(ApplicationStateController, [{
    key: "toJSON",
    value: function toJSON() {
      return this._private;
    }
  }, {
    key: "callActionFilter",
    value: function callActionFilter(actionRequestDescriptor_) {
      actionRequestDescriptor_;
    }
  }]);

  return ApplicationStateController;
}();

module.exports = ApplicationStateController;