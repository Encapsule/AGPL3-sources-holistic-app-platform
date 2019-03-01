"use strict";

// sources/common/view/elements/page/RUX_PagePanel_ReactDebug.jsx
//
var React = require('react');

var reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({
  id: "6q1nwXxaSWa6lCp1wCAB3Q",
  name: "RUXBase_PagePanel_ReactDebug",
  description: "<RUXBase_PagePanel_ReactDebug/> React Component Binding",
  renderDataBindingSpec: {
    ____types: "jsObject",
    RUXBase_PagePanel_ReactDebug: {
      ____types: "jsObject",
      options: {
        ____accept: "jsObject",
        ____defaultValue: {}
      }
    }
  },
  reactComponent: React.createClass({
    displayName: "RUXBase_PagePanel_ReactDebug",
    getInitialState: function getInitialState() {
      return {
        showDetails: false,
        showDocumentData: false,
        showAppDataStore: false,
        showAppStateController: false,
        showMetadataStore: false
      };
    },
    onClickToggleDetails: function onClickToggleDetails() {
      this.setState({
        showDetails: !this.state.showDetails
      });
    },
    onClickToggleDetailsSection: function onClickToggleDetailsSection(sectionName) {
      var state = this.state;
      state[sectionName] = !state[sectionName];
      this.setState(state);
    },
    render: function render() {
      var self = this;
      var ComponentRouter = this.props.appStateContext.reactComponentRouter;
      var metadata = this.props.document.metadata;
      var theme = metadata.site.theme;
      var renderData = this.props.renderData['RUXBase_PageContent_Error'];
      var keyIndex = 0;

      function makeKey() {
        return "RUXBase_PagePanel_ReactDebug" + keyIndex++;
      }

      var content = [];

      if (!this.state.showDetails) {
        content.push(React.createElement("div", {
          key: makeKey(),
          style: theme.base.RUXBase_PagePanel_ReactDebug.closed.container
        }, React.createElement("img", {
          src: "/advertise/rainier/images/react-logo.svg",
          style: theme.base.RUXBase_PagePanel_ReactDebug.closed.icon,
          onClick: this.onClickToggleDetails,
          title: "Show React JSON..."
        })));
      } else {
        content.push(React.createElement("div", {
          key: makeKey(),
          style: theme.base.RUXBase_PagePanel_ReactDebug.closed.container
        }, React.createElement("img", {
          src: "/advertise/rainier/images/react-logo.svg",
          style: theme.base.RUXBase_PagePanel_ReactDebug.closed.iconDisabled,
          onClick: this.onClickToggleDetails,
          title: "Hide React JSON..."
        })));
        var details = [];
        details.push(React.createElement("div", {
          key: makeKey(),
          style: theme.base.RUXBase_PagePanel_ReactDebug.open.hideDetails,
          onClick: this.onClickToggleDetails,
          title: "Hide React JSON..."
        }, React.createElement("img", {
          src: "/advertise/rainier/images/react-logo.svg",
          style: theme.base.RUXBase_PagePanel_ReactDebug.open.icon
        }), "In-Page React Data Viewer :: ", metadata.page.name));
        details.push(React.createElement("div", {
          key: makeKey(),
          style: theme.base.RUXBase_PagePanel_ReactDebug.open.guidance
        }, React.createElement("p", null, "To debug a rendering issue with a specific React component, set a breakpoint in its render method (or possibly lifecycle method(s)). Step through your view rendering logic to find errors handling input(s). Check your subcomponent delegations and specific values passed."), React.createElement("p", null, "To debug page-level layout rendering problems, set a breakpoint in the render method of ", React.createElement("strong", null, "<ComponentRouter/>"), ". Inspect the React component selected and specific data value(s) bound to the selected component before the call is delegated.")));
        details.push(React.createElement("p", {
          key: makeKey()
        }, React.createElement("strong", null, "Click each section title below to toggle JSON view...")));
        details.push(React.createElement("h3", {
          key: makeKey(),
          onClick: function onClick() {
            self.onClickToggleDetailsSection('showDocumentData');
          },
          style: {
            cursor: 'pointer'
          }
        }, this.state.showDocumentData ? '-' : '+', ' ', "this.props.document"));
        if (this.state.showDocumentData) details.push(React.createElement("pre", {
          key: makeKey(),
          style: theme.classPRE
        }, "this.props.document === '", JSON.stringify(this.props.document, undefined, 4), "'"));
        details.push(React.createElement("h3", {
          key: makeKey(),
          onClick: function onClick() {
            self.onClickToggleDetailsSection('showAppDataStore');
          },
          style: {
            cursor: 'pointer'
          }
        }, this.state.showAppDataStore ? '-' : '+', ' ', "this.props.appStateContext.appDataStore"));
        if (this.state.showAppDataStore) details.push(React.createElement("pre", {
          key: makeKey(),
          style: theme.classPRE
        }, "this.props.appStateContext.appDataStore === '", JSON.stringify(this.props.appStateContext.appDataStore, undefined, 4), "'"));
        details.push(React.createElement("h3", {
          key: makeKey(),
          onClick: function onClick() {
            self.onClickToggleDetailsSection('showMetadataStore');
          },
          style: {
            cursor: 'pointer'
          }
        }, this.state.showMetadataStore ? '-' : '+', ' ', "this.props.appStateContext.appMetadataStore"));
        if (this.state.showMetadataStore) details.push(React.createElement("pre", {
          key: makeKey(),
          style: theme.classPRE
        }, "this.props.appStateContext.appMetadataStore === '", this.props.appStateContext.appMetadataStore.stringify(undefined, 4)));
        details.push(React.createElement("h3", {
          key: makeKey(),
          onClick: function onClick() {
            self.onClickToggleDetailsSection('showAppStateController');
          },
          style: {
            cursor: 'pointer'
          }
        }, this.state.showAppStateController ? '-' : '+', ' ', "this.props.appStateContext.appStateController"));
        if (this.state.showAppStateController) details.push(React.createElement("pre", {
          key: makeKey(),
          style: theme.classPRE
        }, "this.props.appStateContext.appStateController === '", JSON.stringify(this.props.appStateContext.appStateController, undefined, 4)));
        content.push(React.createElement("div", {
          key: makeKey(),
          style: theme.base.RUXBase_PagePanel_ReactDebug.open.container
        }, details));
      }

      return React.createElement("div", null, content);
    }
  })
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;