// sources/common/view/elements/page/RUXBase_HttpServerError.jsx
//

const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');

const holismHttpResponseErrorResultSpec = require('holism/lib/iospecs/http-response-error-result-spec');
const holismHttpErrorDataSpec = holismHttpResponseErrorResultSpec.error_descriptor.data;

var factoryResponse = reactComponentBindingFilterFactory.create({

    // Metadata
    id: "9gtelAjwRhSvc2BfybyiLw",
    name: "RUXBase_HttpServerError",
    description: "If an error occurs while processing an inbound HTTP request, the Encapsule/holism HTTP response processor will forward a report to the HTML rendering subsystem " +
        "with details regarding the error (iff content-type utf8 and content-encoding text/html). Those reports end up here via <ContentRouter/> for rendering to HTML.",

    // This is the format of an HTML render request to be routed to the React component specified below.
    renderDataBindingSpec: holismHttpErrorDataSpec,

    // When <ComponentRouter/> receives a render request whose signature matches our dataBindingSpec, bind the request to this.props and render via the React component specified here.
    reactComponent: React.createClass({
        displayName: "RUXBase_HttpServerError",
        render: function() {
            var ComponentRouter = this.props.appStateContext.reactComponentRouter;

            const pageContentEP = {
                RUXBase_Page: {
                    pageContentEP: {
                        RUXBase_PageContent_HttpServerError: this.props.renderData['ESCW71rwTz24meWiZpJb4A']
                    }
                }
            };

            return(<ComponentRouter {...this.props} renderData={pageContentEP}  />);
        }
    })
});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

// Export the React component binding filter.
module.exports = factoryResponse.result;


