// HolisticPageHeader.jsx

const React = require('react');

export class HolisticPageHeader extends React.Component {

    constructor(props) {
        super(props);
        this.onClickHome = this.onClickHome.bind(this);
    }

    onClickHome() {
        window.location = "/";
    }

    render() {
        const metadata = this.props.document.metadata;
        const session = metadata.session;
        const theme = metadata.site.theme;

        let key = 0;

        const makeKey = () => {
            return "SessionWidget" + key++;
        };

        let content = [];

        if (session.identity.username_sha256 === 'anonymous') {
            content.push(<a href='/login' key={makeKey()}><strong>Login</strong></a>);
        } else {
            content.push(<span key={makeKey()}>Hello, {session.data.firstName}.</span>);
            content.push(<span key={makeKey()}>{' '}</span>);
            content.push(<a href='/logout' key={makeKey()}><strong>Logout</strong></a>);
        }

        return (
                <div style={theme.sessionWidgetBlock}>
                <div style={theme.sessionWidgetTitleBlock}>
                <img src="/images/blue-burst-encapsule.io-icon-32x32.png" style={theme.sessionWidgetTitleOrgIcon} onClick={this.onClickHome} title={metadata.site.name + " Home..."} />
                {' '}
                <span style={theme.sessionWidgetTitle}>{metadata.page.pageTitle}</span>
                {' '}
                </div>
                <div style={theme.sessionWidgetButtonsBlock}>{content}</div>
                </div>

        ); // return

    } // end render method

} // end class

