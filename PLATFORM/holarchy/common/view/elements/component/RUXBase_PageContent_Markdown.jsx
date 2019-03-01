"use strict";

// RUXBase_PageContent_Markdown.jsx
//
// A think wrapper around the `react-markdown` package.
//
var React = require('react');

var reactComponentBindingFilterFactory = require('../binding-factory');

var ReactMarkdown = require('react-markdown');

var factoryResponse = reactComponentBindingFilterFactory.create({
  id: "84jqUkLzTLecFmu2PMI6qQ",
  name: "RUXBase_PageContent_Markdown",
  description: "React component binding filter for <RUXBase_PageContent_Markdown/>.",
  renderDataBindingSpec: {
    ____types: "jsObject",
    RUXBase_PageContent_Markdown: {
      ____label: "Markdown Content HTML Render Request",
      ____description: "Renders an array of markdown-encoded strings as HTML content.",
      ____types: "jsObject",
      markdownContent: {
        ____label: "Markdown Content Array",
        ____description: "An array of markdown-encoded strings joined with space delimiters.",
        ____types: "jsArray",
        ____defaultValue: ["## Missing Content\n\n", "Sorry, no markdown-encoded content was specified.\n\n"],
        markdownLine: {
          ____label: "Markdown Line",
          ____description: "A markdown-encoded string taken as a markdown section.",
          ____accept: "jsString"
        }
      },
      markdownOptions: {
        ____label: "Markdown Options",
        ____description: "An options object to pass through to the underlying <ReactMarkdown/> component.",
        ____accept: "jsObject",
        ____defaultValue: {}
      },
      viewOptions: {
        ____label: "View Options",
        ____description: "An options object used to customize the React rendering of the wrapper around the hosted <Markdown/> component.",
        ____types: "jsObject",
        ____defaultValue: {},
        useContainerStyles: {
          ____label: "Use Container Styles Flag",
          ____description: "Indicates if RUXBase_PageContent_Markdown should use its programmatic container styles or just a plain <DIV/>.",
          ____accept: "jsBoolean",
          ____defaultValue: false
        }
      }
    }
  },
  reactComponent: React.createClass({
    displayName: "MarkdownContent",
    render: function render() {
      try {
        var makeKey = function makeKey() {
          return "RUXBase_PageContent_Markdown" + keyIndex++;
        };

        // var ComponentRouter = this.props.appStateContext.reactComponentRouter;
        var metadata = this.props.document.metadata;
        var theme = metadata.site.theme;
        var renderData = this.props.renderData['RUXBase_PageContent_Markdown'];
        var keyIndex = 0;
        var content = [];
        var markdownSource = renderData.markdownContent.join(' ');
        content.push(React.createElement(ReactMarkdown, {
          key: makeKey(),
          options: renderData.markdownOptions,
          source: markdownSource
        }));
        if (renderData.viewOptions.useContainerStyles) return React.createElement("div", {
          style: theme.base.RUXBase_PageContent_Markdown.container
        }, content);else return React.createElement("div", null, content);
      } catch (exception_) {
        return React.createElement("div", null, "RUXBase_PageContent_Markdown exception: ", exception_.toString());
      }
    }
  })
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;