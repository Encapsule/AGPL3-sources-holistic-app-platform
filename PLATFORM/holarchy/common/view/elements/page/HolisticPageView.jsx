"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// sources/common/view/elements/page/HolisticPageView.jsx
//
var React = require('react');

var reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({
  id: "hCuVI2B6TbumErHrzPQjfQ",
  name: "HolisticPageView",
  description: "Common single-page HTML5 page view template for use with D2R2.",
  renderDataBindingSpec: {
    ____types: "jsObject",
    HolisticPageView: {
      ____label: "RUXBase_Page HTML View Render Request",
      ____description: "HTML render request format for <RUXBase_Page/> React component.",
      ____types: "jsObject",
      // the caller must literally specify this subnamespace
      pageHeaderEP: {
        ____label: "Page Header Extension Point (EP)",
        ____description: "The contents of this namespace is rendered dynamically via <ComponentRouter/>.",
        ____accept: "jsObject",
        ____defaultValue: {
          RUXBase_PageHeader_QCGlobalNavWrapper: {}
        }
      },
      pageContentEP: {
        ____label: "Page Content Extension Point (EP)",
        ____description: "The contents of this namespace is rendered dynamically via <ComponentRouter/>.",
        ____accept: "jsObject",
        ____defaultValue: {
          RUXBase_PageContent: {}
        }
      },
      pageFooterEP: {
        ____label: "Page Footer Extension Point (EP)",
        ____description: "The contents of this namespace is rendered dynamically via <ComponentRouter/>.",
        ____accept: "jsObject",
        ____defaultValue: {
          RUXBase_PageFooter: {}
        }
      },
      pageErrorsEP: {
        ____label: "Page Errors Extension Point (EP)",
        ____description: "The contents of this namespace is rendered dynamically via <ComponentRouter/>.",
        ____accept: "jsObject",
        ____defaultValue: {
          RUXBase_PagePanel_Errors: {}
        }
      },
      pageDebugEP: {
        ____label: "Page Debug Extenion Point (EP)",
        ____description: "The contents of this namespace is rendered dynamically via <ComponentRouter/>.",
        ____accept: "jsObject",
        ____defaultValue: {
          RUXBase_PagePanel_ReactDebug: {}
        }
      }
    }
  },
  // renderDataBindingSpec
  reactComponent:
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(HolisticPageView, _React$Component);

    function HolisticPageView() {
      _classCallCheck(this, HolisticPageView);

      return _possibleConstructorReturn(this, _getPrototypeOf(HolisticPageView).apply(this, arguments));
    }

    _createClass(HolisticPageView, [{
      key: "render",
      value: function render() {
        var ComponentRouter = this.props.appStateContext.ComponentRouter;
        var metadata = this.props.document.metadata;
        var theme = metadata.site.theme;
        var renderData = this.props.renderData['HolisticPageView'];
        return React.createElement("div", {
          id: "idRUXBase_Page",
          style: theme.base.RUXBase_Page.container
        }, React.createElement(ComponentRouter, _extends({}, this.props, {
          renderData: renderData.pageHeaderEP
        })), React.createElement(ComponentRouter, _extends({}, this.props, {
          renderData: renderData.pageContentEP
        })), React.createElement(ComponentRouter, _extends({}, this.props, {
          renderData: renderData.pageFooterEP
        })), React.createElement(ComponentRouter, _extends({}, this.props, {
          renderData: renderData.pageErrorsEP
        })), React.createElement(ComponentRouter, _extends({}, this.props, {
          renderData: renderData.pageDebugEP
        })), React.createElement(ComponentRouter, _extends({}, this.props, {
          renderData: {
            RUXBase_PageWidget_ASC: {}
          }
        })), React.createElement("br", null));
      }
    }]);

    return HolisticPageView;
  }(React.Component)
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;