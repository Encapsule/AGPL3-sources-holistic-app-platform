// externallink.jsx

const React = require('react');
//const ReactBootstrap = require('react-bootstrap');
//const Glyphicon = ReactBootstrap.Glyphicon;

var ExternalLink = React.createClass({
    displayName: "ExternalLink",
    getInitialState: function() {
        return {
            hover: false,
            loading: false
        };
    },
    toggleHover: function() {
        this.setState({ hover: !this.state.hover});
    },
    clickLink: function() {
        this.setState({ loading: true });
    },
    render: function() {
        try {
            const title = this.props.title;
            const targetUrl = this.props.target;
            const tooltip = this.props.tooltip?this.props.tooltip:"Follow link...";

            var linkStyles = this.props.document.metadata.site.theme[this.state.loading?'xlinkLoading':(this.state.hover?'xlinkHover':'xlink')];
            return(<span><a href={targetUrl} title={tooltip} style={linkStyles} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} onClick={this.clickLink}>{title}</a></span>);
        } catch (exception_) {
            return (<div>Fatal exception in {this.className}: {exception_.toString()}</div>);
        }
    }
});

module.exports = ExternalLink;
