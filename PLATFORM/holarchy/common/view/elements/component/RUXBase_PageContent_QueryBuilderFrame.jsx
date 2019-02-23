// sources/common/view/elements/component/RUXBase_PageContent_QueryBuilderFrame.jsx
//

const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "oieTYRDVRfOZZP8j7uj8VA",
    name: "RUXBase_PageContent_QueryBuilderFrame",
    description: "<RUXBase_PageContent_QueryBuilderFrame/> React component data binding filter.",

    renderDataBindingSpec: {
        ____types: "jsObject",
        RUXBase_PageContent_QueryBuilderFrame: {
            ____label: "Query Builder Frame Request",
            ____description: "Query builder frame implements display policy over the main Rainier query builder UI. This is not a security barrier (implemented separately) but rather a user experience feature.",
            ____types: "jsObject",
            contentEP: {
                ____label: "Content Extension Point",
                ____types: "jsArray",
                ____defaultValue: [],
                content: {
                    ____label: "Some HTML Render Request Object",
                    ____accept: "jsObject"
                }
            }
        } // RUXBase_PageContent_QueryBuilderFrame
    },

    dependencies: {
        read: [
            {
                storePath: "~.base.runtime.client.subsystems.rainier.state",
                filterBinding: {
                    id: "ees0LgGuRNCroHv0PgAbwg",
                    alias: "getRainierSubsystemStatus"
                }
            }
        ]
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
                var self = this;
                var keyIndex = 0;

                function makeKey() { return ("RUXBase_PageContent_QueryBuilderFrame" + keyIndex++); }
                var ComponentRouter = this.props.appStateContext.reactComponentRouter;
                const metadata = this.props.document.metadata;
                const theme = metadata.site.theme;
                const renderData = this.props.renderData['RUXBase_PageContent_QueryBuilderFrame'];

                const integrations = this.props.integrations;

                var content = [];
                content.push(<h1 key={makeKey()}>Hello!</h1>);
                content.push(<p key={makeKey()}>This is the &lt;RUXBase_PageContent_QueryBuilderFrame/&gt; React component.</p>);


                var integrationResponse = integrations.read.getRainierSubsystemStatus.request();
                content.push(<pre key={makeKey()} style={theme.classPRE}>{JSON.stringify(integrationResponse, undefined, 4)}</pre>);

                renderData.contentEP.forEach(function(htmlRenderRequest_) { content.push(<ComponentRouter key={makeKey()} {...self.props} renderData={htmlRenderRequest_} />); });



                return (<div style={theme.base.RUXBase_PageContent_QueryBuilderFrame.container}>{content}</div>);

            } catch (exception_) {
                return (<div>Fatal exception in &lt;RUXBase_PageContent_QueryBuilderFrame/&gt;: {exception_.toString()}</div>);
            }
        }
    })

});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
