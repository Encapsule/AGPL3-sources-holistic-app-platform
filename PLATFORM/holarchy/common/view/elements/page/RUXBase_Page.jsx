"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// sources/common/view/elements/page/RUXBase_Page.jsx
//
var React = require('react');

var reactComponentBindingFilterFactory = require('../binding-factory');

var RUXBase_Page_RenderRequestSpec = {
  ____types: "jsObject",
  RUXBase_Page: {
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
};
var RUXBase_Page = React.createClass({
  displayName: "RUXBase_Page",
  render: function render() {
    var ComponentRouter = this.props.appStateContext.reactComponentRouter;
    var metadata = this.props.document.metadata;
    var theme = metadata.site.theme;
    var renderData = this.props.renderData['RUXBase_Page'];
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
});
var factoryResponse = reactComponentBindingFilterFactory.create({
  id: "Sj6k3YInR92kcQgtnuu8aw",
  name: "RUXBase_Page",
  description: "Common single-page HTML5 application template for Rainier UX and derived applications.",
  renderDataBindingSpec: RUXBase_Page_RenderRequestSpec,
  reactComponent: RUXBase_Page
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
var RUXBase_Page_DataViewBindingFilter = factoryResponse.result;
module.exports = RUXBase_Page_DataViewBindingFilter;