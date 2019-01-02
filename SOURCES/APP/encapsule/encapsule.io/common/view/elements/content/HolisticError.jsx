// HolisticError.jsx

const React = require('react');
const HolisticIconPageHeader = require('../common/HolisticIconPageHeader.jsx');

module.exports = React.createClass({
    displayName: "HolisticError",

    getInitialState: function() {
        return ({
            extended: false
        });
    },

    toggleDebugInfo: function() {
        var state = this.state;
        this.setState({ extended: !state.extended });
    },

    render: function() {
        var errorMessage = this.props.document.data["ESCW71rwTz24meWiZpJb4A"];

        var routeMethodNameSplit = errorMessage.request.route_method_name.split(":");

        var debugInfo = []
        if (this.state.extended) {
            debugInfo.push(<div key={'debugInfo'}>
                           <h2>Debug Information</h2>
                           <h3>Error Message JSON</h3>
                           <pre>{JSON.stringify(errorMessage, undefined, 2)}</pre>
                           <h3>Full Context</h3>
                           <p>This is the entirety of `this.props` as passed to the {"<HolisticError/>"} React component.</p>
                           <pre>{JSON.stringify(this.props, undefined, 2)}</pre>
                           </div>);
        }

        var errorTitleText = "Error " + errorMessage.http.code + ": " + errorMessage.http.message;

        return (<div>

                <HolisticIconPageHeader svg={this.props.document.metadata.page.icons.svg} title={errorTitleText} />

                <h2>Hello, {errorMessage.request.session.data.firstName} {errorMessage.request.session.data.lastName}.</h2>
                <p>Sorry to interrupt you but something has gone wrong.</p>
                <p>In response to your HTTP request to <code>{routeMethodNameSplit[0]}</code> resource URI <code>{routeMethodNameSplit[1]}</code> ...</p>
                <p>... the server responded with HTTP error code <code>{errorMessage.http.code}</code>{' '}(<code>{errorMessage.http.message}</code>).</p>
                <p>The explanation for this problem was as follows:</p>
                <p><code>{errorMessage.error_message}</code></p>
                <h2>Further Troubleshooting</h2>
                <p>The following information was provided by the application layer:</p>
                <p><code>{JSON.stringify(errorMessage.error_context)}</code></p>
                <p><a onClick={this.toggleDebugInfo} style={{ cursor: (this.state.extended?'zoom-out':'zoom-in') }}><strong>Toggle debug view</strong></a>.</p>
                {debugInfo}
                </div>
               );
    }
});
