// sources/common/view/elements/component/PageContent_HttpServerError.jsx.jsx
//

const arccore = require("@encapsule/arccore");
const React = require("react");

const reactComponentBindingFilterFactory = require("./binding-factory");

const holismHttpResponseErrorResultSpec = require("@encapsule/holism/lib/iospecs/http-response-error-result-spec");
const holismHttpErrorDataSpec = holismHttpResponseErrorResultSpec.error_descriptor.data;

var holismHttpErrorMessageSpec = arccore.util.clone(holismHttpResponseErrorResultSpec.error_descriptor.data['ESCW71rwTz24meWiZpJb4A']); // snips off the routing namespace & deep copies

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
        }

        render()  {

            var ComponentRouter = this.props.renderContext.ComponentRouter;

            const renderData = this.props.renderData["HolismHttpServerErrorPageContent"];
            var keyIndex = 0;
            function makeKey() { return ("HolismHttpServerErrorPageContent" + keyIndex++); }
            var content = [];

            switch (renderData.http.code) {

            default:
                content.push(<h1 key={makeKey()}>App Server HTTP Error {renderData.http.code}{': '}{renderData.http.message}</h1>);
                content.push(<div key={makeKey()}>{renderData.error_message}</div>);
                content.push(<pre key={makeKey()}>{JSON.stringify(renderData, undefined, 4)}</pre>);
                content.push(<div key={makeKey()} style={{ marginTop: "1em", fontWeight: "bold", textAlign: "right" }} >
                             [ <a href="/" title="Go home...">Home</a> ]
                             [ <a href="/login" title="Login...">Login</a> ]
                             [ <a href="/logout" title="Logout...">Logout</a> ]
                             </div>
                            );
                break;
            }

            return (<div>{content}</div>);
        }
    }
});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
