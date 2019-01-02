// header1.jsx

const React = require('react');

// this.props.heading
// this.props.size (number 1-6)

var SnapHeader = React.createClass({
    displayName: "SnapHeader",
    render: function() {
        var theme = this.props.site.context.theme;
        var headerStyles = theme['header'+this.props.size];
        if (headerStyles === undefined) {
            return (<div><strong>Invalid header size specified. Must be 1-6.</strong></div>);
        }
        return (<div style={headerStyles}>{this.props.heading}</div>);
    }
});

module.exports = SnapHeader;
