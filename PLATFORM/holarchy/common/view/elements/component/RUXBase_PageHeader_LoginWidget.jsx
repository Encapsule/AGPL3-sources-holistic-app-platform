// sources/common/view/elements/components/RUXBase_PageHeader_LoginWidget.jsx

const React = require('react');

module.exports = React.createClass({

    displayName: "RUXBase_PageHeader_LoginWidget",

    onClick: function() {
        window.location = (this.props.document.metadata.session.identity.sessionID?'/user/logout':'/user/login');
    },

    render: function() {
        const metadata = this.props.document.metadata;
        const theme = metadata.site.theme;
        const title = "test"; // (metadata.session.identity.sessionID?'Close session and logout...':'Login and create or resume session...');
        return (
                <div style={theme.base.RUXBase_PageHeader_LoginWidget.container} title={title} onClick={this.onClick}>Login</div>
        );
    }

});


