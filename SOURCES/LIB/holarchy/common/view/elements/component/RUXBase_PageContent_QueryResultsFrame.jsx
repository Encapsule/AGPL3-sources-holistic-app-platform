// sources/common/view/elements/component/RUXBase_PageContent_QueryResultsFrame.jsx
//

const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "pglGOR9YQTy5XL23VkeMXg",
    name: "RUXBase_PageContent_QueryResultsFrame",
    description: "<RUXBase_PageContent_QueryResultsFrame/> React component data binding filter.",

    renderDataBindingSpec: {
        ____types: "jsObject",
        RUXBase_PageContent_QueryResultsFrame: {
            ____accept: "jsObject"
        } // RUXBase_PageContent_QueryResultsFrame
    },

    reactComponent: React.createClass({
        displayName: "RUXBase_PageContent_QueryBuilderFrame",

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
            try {
                var ComponentRouter = this.props.appStateContext.reactComponentRouter;
                const metadata = this.props.document.metadata;
                const theme = metadata.site.theme;
                const renderData = this.props.renderData['RUXBase_PageContent_QueryBuilderFrame'];
                var keyIndex = 0;
                function makeKey() { return ("RUXBase_PageContent_QueryBuilderFrame" + keyIndex++); }
                var content = [];

                content.push(<h1 key={makeKey()}>Hello!</h1>);
                content.push(<p key={makeKey()}>This is the &lt;RUXBase_PageContent_QueryResultsFrame/&gt; React component.</p>);

                return (<div style={theme.base.RUXBase_PageContent_QueryResultsFrame.container}>{content}</div>);
            } catch (exception_) {
                return (<div>Fatal exception in &lt;RUXBase_PageContent_QueryResultsFrame/&gt;: {exception_.toString()}</div>);
            }
        }
    })

});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
