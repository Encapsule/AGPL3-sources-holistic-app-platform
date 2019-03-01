"use strict";

// sources/common/view/elements/page/RUX_PageFooter.jsx
//
var React = require('react');

var reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({
  id: "dON94Qi6SJqv1o6tXx0K3A",
  name: "RUXBase_PageFooter",
  description: "<RUXBase_PageFooter/> React Component Binding",
  renderDataBindingSpec: {
    ____types: "jsObject",
    RUXBase_PageFooter: {
      ____accept: "jsObject"
    }
  },
  reactComponent: React.createClass({
    displayName: "RUXBase_PageFooter",
    getInitialState: function getInitialState() {
      return {
        showAppInfo: false
      };
    },
    toggleAppInfo: function toggleAppInfo() {
      this.setState({
        showAppInfo: !this.state.showAppInfo
      });
    },
    render: function render() {
      var ComponentRouter = this.props.appStateContext.reactComponentRouter;
      var metadata = this.props.document.metadata;
      var theme = metadata.site.theme;
      var renderData = this.props.renderData['RUXBase_PageFooter'];
      var keyIndex = 0;

      function makeKey() {
        return "RUXBase_PageFooter" + keyIndex++;
      }

      var content = [];
      content.push(React.createElement("span", {
        key: makeKey()
      }, React.createElement("span", {
        title: metadata.site.description,
        style: {
          cursor: 'help'
        },
        onClick: this.toggleAppInfo
      }, metadata.agent.app.name, " v", metadata.agent.app.version), ' ', "\u2022", ' ', "Copyright \xA9 ", metadata.agent.instance.fy, ' ', React.createElement("span", {
        title: metadata.org.name + " " + metadata.org.location + "...",
        onClick: function onClick() {
          window.location = metadata.org.url;
        },
        style: {
          cursor: 'pointer'
        }
      }, metadata.org.copyrightHolder.name)));

      if (this.state.showAppInfo) {
        content.push(React.createElement("div", {
          key: makeKey(),
          style: theme.base.RUXBase_PageFooter.versionText
        }, metadata.site.build.packageAuthor, "_", metadata.site.build.packageName, "_v", metadata.site.build.packageVersion, "_", metadata.site.build.packageCodename, "_", metadata.site.build.buildCommitShortHash, "_", metadata.site.build.buildID, " released ", metadata.site.build.buildTimestamp));
      }

      return React.createElement("div", {
        style: theme.base.RUXBase_PageFooter.container
      }, content);
    } // end render

  }) // reactComponent

}); // componentBindingFilterFactory.create

if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;