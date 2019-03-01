"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

// sources/common/view/elements/component/RUXBase_PageHeader_QCGlobalNavWrapper_Client.jsx
require('callahan-styles/css/callahan.css');

var React = require('react');

var reactComponentBindingFilterFactory = require('rainier-ux-base/common').factories.view.reactComponentBindingFilter;

var GlobalNav = require('qc-global-navigation');

var build = require('../../../../../../../build/_build-tag.js');

var GlobalNavPageHeaderClient =
/*#__PURE__*/
function (_React$Component) {
  _inherits(GlobalNavPageHeaderClient, _React$Component);

  function GlobalNavPageHeaderClient(props) {
    var _this;

    _classCallCheck(this, GlobalNavPageHeaderClient);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GlobalNavPageHeaderClient).call(this, props));
    var globalNavConfig = {
      product: 'advertise',
      section: 'rainier',
      env: build.buildConfig.deployConfig.appDeployEnvironment == 'production' ? 'production' : 'test',
      footer: false
    };
    GlobalNav.init(globalNavConfig);
    _this.handleAdvertiserChange = _this.handleAdvertiserChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    GlobalNav.addObserver(_this.handleAdvertiserChange);
    return _this;
  }

  _createClass(GlobalNavPageHeaderClient, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var item = GlobalNav.getContext('account'); //returns an object like: //{rtbid: null, name: "Microsoft", pCode: "tTB93UFC5vepM", permission: null, isMarketer: true}

      if (item) {
        var advertiser = {
          pcode: "p-".concat(item.pCode)
        };
        var request = {
          actorAdvertiserInit: advertiser
        };

        var _factoryResponse = this.props.integrations.write.request(request);

        if (_factoryResponse.error) {
          console.log("Error getting state actor: ".concat(_factoryResponse.error)); //TODO write error to ~.base.client.runtime.errors
        }

        var stateActor = _factoryResponse.result;
      }
    }
  }, {
    key: "handleAdvertiserChange",
    value: function handleAdvertiserChange(event, item) {
      if (item.type === 'account') {
        var advertiser = {
          pcode: "p-".concat(item.data.pCode)
        };
        var request = {
          actorAdvertiserChange: advertiser
        };

        var _factoryResponse2 = this.props.integrations.write.request(request);

        if (_factoryResponse2.error) {
          console.log("Error getting state actor: ".concat(_factoryResponse2.error));
          throw "Error getting state actor: ".concat(_factoryResponse2.error);
        }

        var stateActor = _factoryResponse2.result;
        return stateActor;
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", null);
    }
  }]);

  return GlobalNavPageHeaderClient;
}(React.Component);

var factoryResponse = reactComponentBindingFilterFactory.request({
  id: "Acz_zi_YSI6nCgnyP4x7rw",
  name: 'RUXBase_PageHeader_QCGlobalNavWrapper_Client',
  description: "Filter spec for for GlobalNav for client",
  renderDataBindingSpec: {
    ____types: 'jsObject',
    RUXBase_PageHeader_QCGlobalNavWrapper: {
      ____types: 'jsObject'
    }
  },
  reactComponent: GlobalNavPageHeaderClient
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;