// sources/common/view/elements/page/RUXBase_PageContent_AdminStatus.jsx
//

const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "0PiQdhAIQXKcg76QdedXzw",
    name: "RUXBase_PageContent_AdminStatus",
    description: "<RUXBase_PageContent_AdminStatus/> React component data binding filter.",

    renderDataBindingSpec: {
    ____types: "jsObject",
        RUXBase_PageContent_AdminStatus: {
            ____accept: "jsObject",
        }
    },

    reactComponent: React.createClass({
        displayName: "RUXBase_PageContent_AdminStatus",

        render: function() {
            var ComponentRouter = this.props.appStateContext.reactComponentRouter;
            const metadata = this.props.document.metadata;
            const theme = metadata.site.theme;
            const renderData = this.props.renderData['RUXBase_PageContent_AdminStatus'];

            var clock = new Date().toString();

            return (<div style={theme.base.RUXBase_PageContent_AdminStatus.container}>
                    <h1>Administrative Status</h1>
                    <pre style={theme.classPRE}>{JSON.stringify(renderData, undefined, 4)}</pre>
                    <code>{clock}</code>
                    </div>);
        }
    })

});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
