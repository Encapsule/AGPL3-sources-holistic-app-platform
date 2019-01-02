// Logout.jsx

const React = require('react');
const HolisticIconPageHeader = require('../common/HolisticIconPageHeader.jsx');

module.exports = React.createClass({
    displayName: "Logout",

    onClickLogout: function(event_) {
        console.log("Clicked the logout button!");
        this.props.appStateContext.viewActions.logout()
    },

    render: function() {
        return (<span>
                <HolisticIconPageHeader svg={this.props.document.metadata.page.icons.svg} title={this.props.document.metadata.site.name + " Logout"}
                subtitle={"Click the logout button if you're sure you want to log out of " + this.props.document.metadata.site.name + "."}/>
                <p>
                <button onClick={this.props.onClickLogout}>Logout</button>
                </p>
                </span>
               );
    }
    }
);
