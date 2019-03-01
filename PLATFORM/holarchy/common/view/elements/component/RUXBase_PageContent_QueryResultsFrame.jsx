"use strict";

// sources/common/view/elements/component/RUXBase_PageContent_QueryResultsFrame.jsx
//
var React = require('react');

var reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({
  id: "pglGOR9YQTy5XL23VkeMXg",
  name: "RUXBase_PageContent_QueryResultsFrame",
  description: "<RUXBase_PageContent_QueryResultsFrame/> React component data binding filter.",
  renderDataBindingSpec: {
    ____types: "jsObject",
    RUXBase_PageContent_QueryResultsFrame: {
      ____accept: "jsObject" // RUXBase_PageContent_QueryResultsFrame

    }
  },
  reactComponent: React.createClass({
    displayName: "RUXBase_PageContent_QueryBuilderFrame",
    getInitialState: function getInitialState() {
      return {
        showRawResponse: false
      };
    },
    onClickToggleDetail: function onClickToggleDetail() {
      this.setState({
        showRawResponse: !this.state.showRawResponse
      });
    },
    render: function render() {
      try {
        var makeKey = function makeKey() {
          return "RUXBase_PageContent_QueryBuilderFrame" + keyIndex++;
        };

        var ComponentRouter = this.props.appStateContext.reactComponentRouter;
        var metadata = this.props.document.metadata;
        var theme = metadata.site.theme;
        var renderData = this.props.renderData['RUXBase_PageContent_QueryBuilderFrame'];
        var keyIndex = 0;
        var content = [];
        content.push(React.createElement("h1", {
          key: makeKey()
        }, "Hello!"));
        content.push(React.createElement("p", {
          key: makeKey()
        }, "This is the <RUXBase_PageContent_QueryResultsFrame/> React component."));
        return React.createElement("div", {
          style: theme.base.RUXBase_PageContent_QueryResultsFrame.container
        }, content);
      } catch (exception_) {
        return React.createElement("div", null, "Fatal exception in <RUXBase_PageContent_QueryResultsFrame/>: ", exception_.toString());
      }
    }
  })
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;