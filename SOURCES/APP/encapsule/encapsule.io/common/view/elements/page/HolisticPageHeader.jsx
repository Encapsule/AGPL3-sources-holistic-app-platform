// session-widget.jsx

const React = require('react');

var SessionWidget = React.createClass({
    displayName: "HolisticPageHeader",

    goHome: function() {
        window.location = "/";
    },

    render: function() {
        var metadata = this.props.document.metadata;
        var session = metadata.session;
        var theme = metadata.site.theme;
        var key = 0;
        function makeKey() {
            return "SessionWidget" + key++;
        }
        var content = [];

        if (session.identity.username_sha256 === 'anonymous') {
            content.push(<a href='/login' key={makeKey()}><strong>Login</strong></a>);
        } else {
            content.push(<span key={makeKey()}>Hello, {session.data.firstName}.</span>);
            content.push(<span key={makeKey()}>{' '}</span>);
            content.push(<a href='/logout' key={makeKey()}><strong>Logout</strong></a>);
        }

        return (<div style={theme.sessionWidgetBlock}>
                <div style={theme.sessionWidgetTitleBlock}>
                <img src="/images/blue-burst-encapsule.io-icon-32x32.png" style={theme.sessionWidgetTitleOrgIcon} onClick={this.goHome} title={metadata.site.name + " Home..."} />
                {' '}
                <span style={theme.sessionWidgetTitle}>{metadata.page.pageTitle}</span>
                {' '}
                </div>
                <div style={theme.sessionWidgetButtonsBlock}>
                {content}
                </div>
                </div>);
    }
});

module.exports = SessionWidget;
