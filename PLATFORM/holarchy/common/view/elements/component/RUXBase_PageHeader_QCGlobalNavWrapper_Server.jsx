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

// sources/common/view/elements/component/RUXBase_PageHeader_QCGlobalNavWrapper_Server.jsx
var React = require('react');

var reactComponentBindingFilterFactory = require('rainier-ux-base/common').factories.view.reactComponentBindingFilter;

var GlobalNavPageHeaderServer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(GlobalNavPageHeaderServer, _React$Component);

  function GlobalNavPageHeaderServer() {
    _classCallCheck(this, GlobalNavPageHeaderServer);

    return _possibleConstructorReturn(this, _getPrototypeOf(GlobalNavPageHeaderServer).apply(this, arguments));
  }

  _createClass(GlobalNavPageHeaderServer, [{
    key: "render",
    value: function render() {
      var theme = this.props.document.metadata.site.theme;
      return React.createElement("div", {
        style: theme.base.RUXBase_PageHeader_QCGlobalNavWrapper.server.container
      }, React.createElement("div", null, "One moment please..."));
    }
  }]);

  return GlobalNavPageHeaderServer;
}(React.Component);

var factoryResponse = reactComponentBindingFilterFactory.request({
  id: "B0Ll5xnzQ5aEty1iDSB3tQ",
  name: 'RUXBase_PageHeader_QCGlobalNavWrapper_Server',
  description: "Filter spec for GlobalNav for server (dummy)",
  renderDataBindingSpec: {
    ____types: 'jsObject',
    RUXBase_PageHeader_QCGlobalNavWrapper: {
      ____types: 'jsObject'
    }
  },
  reactComponent: GlobalNavPageHeaderServer
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;