"use strict";

// sources/common/view/elements/component/RUXBase_PageContent_RuntimeFilterError.jsx
var React = require('react');

var reactComponentBindingFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFactory.create({
  id: "TRZSvirYSyKpQWwOzEDahg",
  name: "RUXBase_PageContent_RuntimeFilterError",
  description: "<RUXBase_PageContent_RuntimeFilterError/> React component data binding filter.",
  renderDataBindingSpec: {
    ____types: "jsObject",
    RUXBase_PageContent_RuntimeFilterError: {
      ____types: "jsObject",
      error: {
        ____accept: ["jsNull", "jsString"]
      },
      result: {
        ____opaque: true
      }
    }
  },
  reactComponent: React.createClass({
    displayName: "RUXBase_PageContent_RuntimeFilterError",
    render: function render() {
      var renderData = this.props.renderData['RUXBase_PageContent_RuntimeFilterError'];
      var styles = {
        border: '1px solid #999',
        borderRadius: '0.5em',
        marginBottom: '0.5em',
        padding: '0.5em'
      };
      return React.createElement("div", {
        style: styles
      }, React.createElement("h4", null, "Runtime Filter Error"), React.createElement("span", {
        style: {
          fontFamily: "Share Tech Mono, Courier",
          fontSize: '8pt',
          color: '#666'
        }
      }, renderData.error));
    }
  })
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;