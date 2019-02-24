// sources/common/view/elements/component/RUXBase_PageContent_HttpServerError.jsx.jsx
//

const arccore = require('@encapsule/arccore');
const React = require('react');

const reactComponentBindingFilterFactory = require('../binding-factory');

const holismHttpResponseErrorResultSpec = require('holism/lib/iospecs/http-response-error-result-spec');

var holismHttpErrorMessageSpec = arccore.util.clone(holismHttpResponseErrorResultSpec.error_descriptor.data['ESCW71rwTz24meWiZpJb4A']); // snips off the routing namespace & deep copies
delete holismHttpErrorMessageSpec.request.headers; // i.e. filter this data out of the view React view entirely so it's not rendered on the server or the client

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "PTcu5VXwQx6zSotW93ORPQ",
    name: "RUXBase_PageContent_HttpServerError",
    description: "<RUXBase_PageContent_HttpServerError/> React component data binding filter.",

    renderDataBindingSpec: {
        ____types: "jsObject",
        RUXBase_PageContent_HttpServerError: holismHttpErrorMessageSpec,
    },

    reactComponent: React.createClass({
        displayName: "RUXBase_PageContent_HttpServerError",

        getInitialState: function() {
            return {
                showRawResponse: false
            };
        },

        onClickToggleDetail: function() {
            this.setState({
                showRawResponse: !this.state.showRawResponse
            });
        },

        render: function() {
            var ComponentRouter = this.props.appStateContext.reactComponentRouter;
            const metadata = this.props.document.metadata;
            const theme = metadata.site.theme;
            const renderData = this.props.renderData['RUXBase_PageContent_HttpServerError'];
            var keyIndex = 0;
            function makeKey() { return ("RUXBase_PageContent_HttpServerError" + keyIndex++); }
            var content = [];
            switch (renderData.http.code) {
            default:
                content.push(<h1 key={makeKey()}>{metadata.site.name} Error {renderData.http.code}{': '}{renderData.http.message}</h1>);
                content.push(<div key={makeKey()}>
                             <p>The {metadata.site.name} application server cannot process your request.</p>
                             <p style={theme.base.RUXBase_PageContent_HttpServerError.errorMessage}>{renderData.error_message}</p>
                             </div>);

                if (!this.state.showRawResponse)
                    content.push(<div key={makeKey()} title="Show response details..." onClick={this.onClickToggleDetail} style={theme.base.RUXBase_PageContent_HttpServerError.detailsSummary}>
                                 <pre style={theme.classPRE}>
                                 HTTP request ....... <strong>{renderData.request.route_method_name}</strong> failed.<br/>
                                 Query/search URI ... <strong>{renderData.request.url_parse.href}</strong>
                                 </pre>
                                 </div>);
                else {
                    content.push(<div key={makeKey()} style={theme.base.RUXBase_PageContent_HttpServerError.hideDetails} onClick={this.onClickToggleDetail} title="Hide response details...">
                                 <strong>Hide Details</strong>
                                 </div>);

                    content.push(<pre key={makeKey()} style={theme.classPRE}>
                                 {JSON.stringify(renderData, undefined, 4)}
                                 </pre>);
                }

                break;
            }

            return (<div style={theme.base.RUXBase_PageContent_HttpServerError.container}>{content}</div>);
        }
    })

});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
