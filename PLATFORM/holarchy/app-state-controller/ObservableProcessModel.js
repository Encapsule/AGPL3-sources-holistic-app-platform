"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var appStateSubcontrollerFactory = require("./lib/app-state-subcontroller-factory");

var ObservableProcessModel =
/*#__PURE__*/
function () {
  function ObservableProcessModel(request_) {
    _classCallCheck(this, ObservableProcessModel);

    this._private = {};
    var filterResponse = appStateSubcontrollerFactory.request(request_);

    if (filterResponse.error) {
      throw new Error(filterResponse.error);
    }

    this._private.opm = filterResponse.result;
  }

  _createClass(ObservableProcessModel, [{
    key: "toJSON",
    value: function toJSON() {
      return this._private.opm.toJSON();
    }
  }]);

  return ObservableProcessModel;
}();

module.exports = ObservableProcessModel;