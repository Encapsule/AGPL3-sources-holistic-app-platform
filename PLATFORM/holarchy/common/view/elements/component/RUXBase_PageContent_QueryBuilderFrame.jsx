"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// sources/common/view/elements/component/RUXBase_PageContent_QueryBuilderFrame.jsx
//
var React = require('react');

var reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({
  id: "oieTYRDVRfOZZP8j7uj8VA",
  name: "RUXBase_PageContent_QueryBuilderFrame",
  description: "<RUXBase_PageContent_QueryBuilderFrame/> React component data binding filter.",
  renderDataBindingSpec: {
    ____types: "jsObject",
    RUXBase_PageContent_QueryBuilderFrame: {
      ____label: "Query Builder Frame Request",
      ____description: "Query builder frame implements display policy over the main Rainier query builder UI. This is not a security barrier (implemented separately) but rather a user experience feature.",
      ____types: "jsObject",
      contentEP: {
        ____label: "Content Extension Point",
        ____types: "jsArray",
        ____defaultValue: [],
        content: {
          ____label: "Some HTML Render Request Object",
          ____accept: "jsObject"
        }
      } // RUXBase_PageContent_QueryBuilderFrame

    }
  },
  dependencies: {
    read: [{
      storePath: "~.base.runtime.client.subsystems.rainier.state",
      filterBinding: {
        id: "ees0LgGuRNCroHv0PgAbwg",
        alias: "getRainierSubsystemStatus"
      }
    }]
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

        var self = this;
        var keyIndex = 0;
        var ComponentRouter = this.props.appStateContext.reactComponentRouter;
        var metadata = this.props.document.metadata;
        var theme = metadata.site.theme;
        var renderData = this.props.renderData['RUXBase_PageContent_QueryBuilderFrame'];
        var integrations = this.props.integrations;
        var content = [];
        content.push(React.createElement("h1", {
          key: makeKey()
        }, "Hello!"));
        content.push(React.createElement("p", {
          key: makeKey()
        }, "This is the <RUXBase_PageContent_QueryBuilderFrame/> React component."));
        var integrationResponse = integrations.read.getRainierSubsystemStatus.request();
        content.push(React.createElement("pre", {
          key: makeKey(),
          style: theme.classPRE
        }, JSON.stringify(integrationResponse, undefined, 4)));
        renderData.contentEP.forEach(function (htmlRenderRequest_) {
          content.push(React.createElement(ComponentRouter, _extends({
            key: makeKey()
          }, self.props, {
            renderData: htmlRenderRequest_
          })));
        });
        return React.createElement("div", {
          style: theme.base.RUXBase_PageContent_QueryBuilderFrame.container
        }, content);
      } catch (exception_) {
        return React.createElement("div", null, "Fatal exception in <RUXBase_PageContent_QueryBuilderFrame/>: ", exception_.toString());
      }
    }
  })
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;