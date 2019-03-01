"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// sources/common/view/elements/page/RUXBase_HttpServerError.jsx
//
var React = require('react');

var reactComponentBindingFilterFactory = require('../binding-factory');

var holismHttpResponseErrorResultSpec = require('holism/lib/iospecs/http-response-error-result-spec');

var holismHttpErrorDataSpec = holismHttpResponseErrorResultSpec.error_descriptor.data;
var factoryResponse = reactComponentBindingFilterFactory.create({
  // Metadata
  id: "9gtelAjwRhSvc2BfybyiLw",
  name: "RUXBase_HttpServerError",
  description: "If an error occurs while processing an inbound HTTP request, the Encapsule/holism HTTP response processor will forward a report to the HTML rendering subsystem " + "with details regarding the error (iff content-type utf8 and content-encoding text/html). Those reports end up here via <ContentRouter/> for rendering to HTML.",
  // This is the format of an HTML render request to be routed to the React component specified below.
  renderDataBindingSpec: holismHttpErrorDataSpec,
  // When <ComponentRouter/> receives a render request whose signature matches our dataBindingSpec, bind the request to this.props and render via the React component specified here.
  reactComponent: React.createClass({
    displayName: "RUXBase_HttpServerError",
    render: function render() {
      var ComponentRouter = this.props.appStateContext.reactComponentRouter;
      var pageContentEP = {
        RUXBase_Page: {
          pageContentEP: {
            RUXBase_PageContent_HttpServerError: this.props.renderData['ESCW71rwTz24meWiZpJb4A']
          }
        }
      };
      return React.createElement(ComponentRouter, _extends({}, this.props, {
        renderData: pageContentEP
      }));
    }
  })
});
if (factoryResponse.error) throw new Error(factoryResponse.error); // Export the React component binding filter.

module.exports = factoryResponse.result;