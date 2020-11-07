// sources/common/view/elements/page/HolismHttpServerErrorPageView.jsx
//

const React = require("react");
const reactComponentBindingFilterFactory = require("./binding-factory");

const holismHttpResponseErrorResultSpec = require("@encapsule/holism/lib/iospecs/http-response-error-result-spec");
const holismHttpErrorDataSpec = holismHttpResponseErrorResultSpec.error_descriptor.data;

const factoryResponse = reactComponentBindingFilterFactory.create({
    id: "dzAy_Q-9SYauqxeeO0EIEQ",
    name: "<HolismHttpServerErrorPageView/>",
    description: "Responsible for rendering HTTP request errors produced by the @encapsule/holism server package.",
    // This is the format of an HTML render request to be routed to the React component specified below.
    renderDataBindingSpec: holismHttpErrorDataSpec,
    // When <ComponentRouter/> receives a render request whose signature matches our dataBindingSpec, bind the request to this.props and render via the React component specified here.
    reactComponent: class HolismHttpServerErrorPageView extends React.Component {
        render () {
            var ComponentRouter = this.props.appStateContext.ComponentRouter;
            const pageContentEP = {
                HolisticPageView: {
                    pageContentEP: [
                        { HolismHttpServerErrorPageContent: this.props.renderData['ESCW71rwTz24meWiZpJb4A'] }
                    ]
                }
            };
            return(<ComponentRouter {...this.props} renderData={pageContentEP} />);
        }
    }
});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

// Export the React component binding filter.
module.exports = factoryResponse.result;


