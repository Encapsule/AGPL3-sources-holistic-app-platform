// sources/common/view/elements/page/RUX_PageContent.jsx
//

const reactComponentBindingFilterFactory = require('../binding-factory');


const React = require('react');

var factoryResponse = reactComponentBindingFilterFactory.create({
    id: "aEV3VWjNS_60Xb_q33o-kA",
    name: "RUXBase_PageContent",
    description: "<RUXBase_PageContent/> React component data binding filter.",

    renderDataBindingSpec: {
    ____types: "jsObject",
        RUXBase_PageContent: {
            ____accept: "jsObject",
        }
    },
    reactComponent: React.createClass({
        displayName: "RUXBase_PageContent",
        render: function() {
            const metadata = this.props.document.metadata;
            const theme = metadata.site.theme;
            return (<div style={theme.base.RUXBase_PageContent.container}>
                    <h1>&lt;RUXBase_PageContent/&gt;</h1>
                    <h2>&lt;RUXBase_Page/&gt; found no content to render.</h2>
                    <h3><code>RUXBase_Page.pageContentEP === undefined</code></h3>
                    </div>);
        }
    })
});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
