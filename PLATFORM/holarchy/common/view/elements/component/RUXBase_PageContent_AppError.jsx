"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// rainier-ux-base/sources/common/view/elements/component/RUXBase_PageContent_AppError.jsx
var React = require('react');

var reactComponentBindingFilterFactory = require('rainier-ux-base/common').factories.view.reactComponentBindingFilter;

var RUXBase_PageContent_AppError =
/*#__PURE__*/
function (_React$Component) {
  _inherits(RUXBase_PageContent_AppError, _React$Component);

  function RUXBase_PageContent_AppError() {
    _classCallCheck(this, RUXBase_PageContent_AppError);

    return _possibleConstructorReturn(this, _getPrototypeOf(RUXBase_PageContent_AppError).apply(this, arguments));
  }

  _createClass(RUXBase_PageContent_AppError, [{
    key: "render",
    value: function render() {
      var metadata = this.props.document.metadata;
      var theme = metadata.site.theme;
      var renderData = this.props.renderData.RUXBase_PageContent_AppError;
      return React.createElement("div", {
        style: theme.base.RUXBase_PageContent_AppError.container
      }, React.createElement("h2", null, metadata.site.name, " Application Error"), React.createElement("p", {
        style: theme.base.RUXBase_PageContent_AppError.errorMessage
      }, renderData.error_message));
    }
  }]);

  return RUXBase_PageContent_AppError;
}(React.Component);

var factoryResponse = reactComponentBindingFilterFactory.request({
  id: "jBKQjQ1tTJy_xlHZUthfkA",
  name: "RUXBase_PageContent_AppError",
  description: "Filter spec for bound component to render application errors",
  renderDataBindingSpec: {
    ____types: "jsObject",
    RUXBase_PageContent_AppError: {
      ____types: "jsObject",
      error_message: {
        ____accept: "jsString",
        ____defaultValue: "RUX Application Error"
      }
    }
  },
  reactComponent: RUXBase_PageContent_AppError
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;