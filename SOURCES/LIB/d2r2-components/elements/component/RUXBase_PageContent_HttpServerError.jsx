// sources/common/view/elements/component/PageContent_HttpServerError.jsx.jsx
//

const arccore = require("@encapsule/arccore");
const React = require("react");

const reactComponentBindingFilterFactory = require("../binding-factory");

const holismHttpResponseErrorResultSpec = require("@encapsule/holism/lib/iospecs/http-response-error-result-spec");
const holismHttpErrorDataSpec = holismHttpResponseErrorResultSpec.error_descriptor.data;

var holismHttpErrorMessageSpec = arccore.util.clone(holismHttpResponseErrorResultSpec.error_descriptor.data['ESCW71rwTz24meWiZpJb4A']); // snips off the routing namespace & deep copies

// ----------------------------------------------------------------
// EXERCISE EXTREME CAUTION.
// For production purposes we never want to share the deserialized request headers.

delete holismHttpErrorMessageSpec.request.headers; // i.e. filter this data out of the React view entirely so it's not rendered on the server or the client
// ^--- good - we're working on a cloned copy at least
//
// TODO: Oct 2019 --- the above comment was once a valid concern. However, I've come around to
// think that it is not the job of React component authors to care much about such details.
// If React gets handed some data it's clean. Period. It's the responsibility of the app
// developer to take care of the data before it's handed off to React.


var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "hO7kzwr3SmmnWFJQ6mUEiQ",
    name: "<HolismHttpServerErrorPageContent/>",
    description: "Renders the inner page content of @encapsule/holism-produced HTTP server error message.",

    renderDataBindingSpec: {
        ____types: "jsObject",
        HolismHttpServerErrorPageContent: holismHttpErrorMessageSpec
    },

    reactComponent: class HolismHttpServerErrorPageContent extends React.Component {

        constructor(props_) {
            super(props_);
            this.state = { showRawResponse: false };
            this.onClickToggleDetail = this.onClickToggleDetail.bind(this);
        }

        onClickToggleDetail() {
            this.setState({
                showRawResponse: !this.state.showRawResponse
            });
        }

        render()  {
            var ComponentRouter = this.props.appStateContext.ComponentRouter;
            const metadata = this.props.document.metadata;
            const theme = metadata.site.theme;
            const renderData = this.props.renderData["HolismHttpServerErrorPageContent"];
            var keyIndex = 0;
            function makeKey() { return ("HolismHttpServerErrorPageContent" + keyIndex++); }
            var content = [];
            switch (renderData.http.code) {
            default:
                content.push(<h1 key={makeKey()}>{metadata.site.name} Error {renderData.http.code}{': '}{renderData.http.message}</h1>);
                content.push(<div key={makeKey()}>
                             <p><span style={{ fontSize: "larger" }}>The {metadata.site.name} application server cannot process your request.</span></p>
                             <p style={theme.base.PageContent_HttpServerError.errorMessage}>{renderData.error_message}</p>
                             </div>);

                if (!this.state.showRawResponse)
                    content.push(<div key={makeKey()} title="Show response details..." onClick={this.onClickToggleDetail} style={theme.base.PageContent_HttpServerError.detailsSummary}>
                                 <pre style={theme.classPRE}>
                                 HTTP request ....... <strong>{renderData.request.route_method_name}</strong> failed.<br/>
                                 Query/search URI ... <strong>{renderData.request.url_parse.href}</strong>
                                 </pre>
                                 </div>);
                else {
                    content.push(<div key={makeKey()} style={theme.base.PageContent_HttpServerError.hideDetails} onClick={this.onClickToggleDetail} title="Hide response details...">
                                 <strong>Hide Details</strong>
                                 </div>);

                    content.push(<pre key={makeKey()} style={theme.classPRE}>
                                 {JSON.stringify(renderData, undefined, 4)}
                                 </pre>);
                }

                content.push(<div key={makeKey()} style={{ marginTop: "1em", fontWeight: "bold", textAlign: "right" }} >
                             [ <a href="/" title="Go home...">Home</a> ]
                             [ <a href="/login" title="Login...">Login</a> ]
                             [ <a href="/logout" title="Logout...">Logout</a> ]
                             [ <a href="/user" title="User settings...">User</a> ]
                             </div>
                            );
                break;
            }

            return (<div style={theme.base.PageContent_HttpServerError.container}>{content}</div>);
        }
    }
});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
