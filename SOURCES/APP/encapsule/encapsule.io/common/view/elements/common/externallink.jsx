// externallink.jsx

const React = require('react');

module.exports = class HolisticExternalLink extends React.component {

    constructor(props_) {
        super(props_);
        this.state = { hover: false, loading: false };
        this.toggleHover = this.toggleHover.bind(this);
        this.clickLink = this.clickLink.bind(this);
    }

    toggleHover() {
        this.setState({ hover: !this.state.hover});
    }
    
    clickLink() {
        this.setState({ loading: true });
    }

    render() {
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

} // end class HolisticExternalLink
