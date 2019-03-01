"use strict";

// sources/common/view/elements/component/RUXBase_PageContent_HttpServerError.jsx.jsx
//
var arccore = require('@encapsule/arccore');

var React = require('react');

var reactComponentBindingFilterFactory = require('../binding-factory');

var holismHttpResponseErrorResultSpec = require('holism/lib/iospecs/http-response-error-result-spec');

var holismHttpErrorMessageSpec = arccore.util.clone(holismHttpResponseErrorResultSpec.error_descriptor.data['ESCW71rwTz24meWiZpJb4A']); // snips off the routing namespace & deep copies

delete holismHttpErrorMessageSpec.request.headers; // i.e. filter this data out of the view React view entirely so it's not rendered on the server or the client

var factoryResponse = reactComponentBindingFilterFactory.create({
  id: "PTcu5VXwQx6zSotW93ORPQ",
  name: "RUXBase_PageContent_HttpServerError",
  description: "<RUXBase_PageContent_HttpServerError/> React component data binding filter.",
  renderDataBindingSpec: {
    ____types: "jsObject",
    RUXBase_PageContent_HttpServerError: holismHttpErrorMessageSpec
  },
  reactComponent: React.createClass({
    displayName: "RUXBase_PageContent_HttpServerError",
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
      var ComponentRouter = this.props.appStateContext.reactComponentRouter;
      var metadata = this.props.document.metadata;
      var theme = metadata.site.theme;
      var renderData = this.props.renderData['RUXBase_PageContent_HttpServerError'];
      var keyIndex = 0;

      function makeKey() {
        return "RUXBase_PageContent_HttpServerError" + keyIndex++;
      }

      var content = [];

      switch (renderData.http.code) {
        default:
          content.push(React.createElement("h1", {
            key: makeKey()
          }, metadata.site.name, " Error ", renderData.http.code, ': ', renderData.http.message));
          content.push(React.createElement("div", {
            key: makeKey()
          }, React.createElement("p", null, "The ", metadata.site.name, " application server cannot process your request."), React.createElement("p", {
            style: theme.base.RUXBase_PageContent_HttpServerError.errorMessage
          }, renderData.error_message)));
          if (!this.state.showRawResponse) content.push(React.createElement("div", {
            key: makeKey(),
            title: "Show response details...",
            onClick: this.onClickToggleDetail,
            style: theme.base.RUXBase_PageContent_HttpServerError.detailsSummary
          }, React.createElement("pre", {
            style: theme.classPRE
          }, "HTTP request ....... ", React.createElement("strong", null, renderData.request.route_method_name), " failed.", React.createElement("br", null), "Query/search URI ... ", React.createElement("strong", null, renderData.request.url_parse.href))));else {
            content.push(React.createElement("div", {
              key: makeKey(),
              style: theme.base.RUXBase_PageContent_HttpServerError.hideDetails,
              onClick: this.onClickToggleDetail,
              title: "Hide response details..."
            }, React.createElement("strong", null, "Hide Details")));
            content.push(React.createElement("pre", {
              key: makeKey(),
              style: theme.classPRE
            }, JSON.stringify(renderData, undefined, 4)));
          }
          break;
      }

      return React.createElement("div", {
        style: theme.base.RUXBase_PageContent_HttpServerError.container
      }, content);
    }
  })
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;