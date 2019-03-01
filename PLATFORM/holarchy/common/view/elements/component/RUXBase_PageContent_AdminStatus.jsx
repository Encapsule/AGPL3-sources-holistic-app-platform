"use strict";

// sources/common/view/elements/page/RUXBase_PageContent_AdminStatus.jsx
//
var React = require('react');

var reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({
  id: "0PiQdhAIQXKcg76QdedXzw",
  name: "RUXBase_PageContent_AdminStatus",
  description: "<RUXBase_PageContent_AdminStatus/> React component data binding filter.",
  renderDataBindingSpec: {
    ____types: "jsObject",
    RUXBase_PageContent_AdminStatus: {
      ____accept: "jsObject"
    }
  },
  reactComponent: React.createClass({
    displayName: "RUXBase_PageContent_AdminStatus",
    render: function render() {
      var ComponentRouter = this.props.appStateContext.reactComponentRouter;
      var metadata = this.props.document.metadata;
      var theme = metadata.site.theme;
      var renderData = this.props.renderData['RUXBase_PageContent_AdminStatus'];
      var clock = new Date().toString();
      return React.createElement("div", {
        style: theme.base.RUXBase_PageContent_AdminStatus.container
      }, React.createElement("h1", null, "Administrative Status"), React.createElement("pre", {
        style: theme.classPRE
      }, JSON.stringify(renderData, undefined, 4)), React.createElement("code", null, clock));
    }
  })
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;