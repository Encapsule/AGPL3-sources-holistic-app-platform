"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// sources/common/view/elements/components/RUX_PageHeader.jsx
//
var React = require('react');

var reactComponentBindingFilterFactory = require('../binding-factory');

var RUXBase_PageHeader_LoginWidget = require('./RUXBase_PageHeader_LoginWidget.jsx');

var factoryResponse = reactComponentBindingFilterFactory.create({
  id: "YSEtrMkpTGu3MJW07JANbg",
  name: "RUXBase_PageHeader",
  description: "<RUXBase_PageHeader/> React Component Binding",
  renderDataBindingSpec: {
    ____types: "jsObject",
    RUXBase_PageHeader: {
      ____accept: "jsObject"
    }
  },
  reactComponent: React.createClass({
    displayName: "RUXBase_PageHeader",
    onClickIcon: function onClickIcon() {
      var metadata = this.props.document.metadata;
      var qcHomeIconLinkURL = metadata.page.uri !== '/sitemap' ? '/sitemap' : '/';
      window.location = qcHomeIconLinkURL;
    },
    render: function render() {
      var ComponentRouter = this.props.appStateContext.reactComponentRouter;
      var metadata = this.props.document.metadata;
      var theme = metadata.site.theme;
      var renderData = this.props.renderData['RUXBase_PageHeader_Error'];
      var keyIndex = 0;

      function makeKey() {
        return "RUXBase_PageHeader" + keyIndex++;
      }

      var content = [];
      var titleBarContent = [];
      var qcHomeIconLinkTitle = metadata.page.uri !== '/sitemap' ? 'Sitemap...' : 'Home...';
      titleBarContent.push(React.createElement("span", {
        key: makeKey(),
        title: qcHomeIconLinkTitle,
        onClick: this.onClickIcon,
        style: {
          cursor: "pointer"
        }
      }, "WHATEVER"));
      titleBarContent.push(React.createElement("div", {
        key: makeKey(),
        style: theme.base.RUXBase_PageHeader.titleBlock
      }, React.createElement("span", {
        style: theme.base.RUXBase_PageHeader.titleBlockCompany
      }, metadata.org.copyrightHolder.name), ' ', React.createElement("span", {
        style: theme.base.RUXBase_PageHeader.titleBlockTitle
      }, metadata.agent.app.name), React.createElement("br", null), React.createElement("span", {
        style: theme.base.RUXBase_PageHeader.titleBlockSubtitle
      }, "\xA0", metadata.site.description)));
      titleBarContent.push(React.createElement(RUXBase_PageHeader_LoginWidget, _extends({
        key: makeKey()
      }, this.props)));
      content.push(React.createElement("div", {
        key: makeKey(),
        style: theme.base.RUXBase_PageHeader.titleBar
      }, titleBarContent));
      return React.createElement("div", {
        style: theme.base.RUXBase_PageHeader.containerShadow
      }, React.createElement("div", {
        style: theme.base.RUXBase_PageHeader.container
      }, content));
    }
  })
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;