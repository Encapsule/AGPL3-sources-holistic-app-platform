"use strict";

// sources/common/view/elements/components/RUXBase_PageHeader_LoginWidget.jsx
var React = require('react');

module.exports = React.createClass({
  displayName: "RUXBase_PageHeader_LoginWidget",
  onClick: function onClick() {
    window.location = this.props.document.metadata.session.identity.sessionID ? '/user/logout' : '/user/login';
  },
  render: function render() {
    var metadata = this.props.document.metadata;
    var theme = metadata.site.theme;
    var title = "test"; // (metadata.session.identity.sessionID?'Close session and logout...':'Login and create or resume session...');

    return React.createElement("div", {
      style: theme.base.RUXBase_PageHeader_LoginWidget.container,
      title: title,
      onClick: this.onClick
    }, "Login");
  }
});