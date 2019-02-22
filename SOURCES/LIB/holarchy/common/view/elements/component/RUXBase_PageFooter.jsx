// sources/common/view/elements/page/RUX_PageFooter.jsx
//

const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "dON94Qi6SJqv1o6tXx0K3A",
    name: "RUXBase_PageFooter",
    description: "<RUXBase_PageFooter/> React Component Binding",
    renderDataBindingSpec: {
        ____types: "jsObject",
        RUXBase_PageFooter: {
            ____accept: "jsObject"
        }
    },
    reactComponent: React.createClass({
        displayName: "RUXBase_PageFooter",
        getInitialState: function() {
            return ({ showAppInfo: false });
        },
        toggleAppInfo: function() {
            this.setState({ showAppInfo: !this.state.showAppInfo });
        },
        render: function() {
            var ComponentRouter = this.props.appStateContext.reactComponentRouter;
            const metadata = this.props.document.metadata;
            const theme = metadata.site.theme;
            const renderData = this.props.renderData['RUXBase_PageFooter'];

            var keyIndex = 0;
            function makeKey() { return ("RUXBase_PageFooter" + keyIndex++); }
            var content = [];

            content.push(<span key={makeKey()}>
                         <span title={metadata.site.description} style={{ cursor: 'help' }} onClick={this.toggleAppInfo}>
                         {metadata.agent.app.name} v{metadata.agent.app.version}
                         </span>
                         {' '}&bull;
                         {' '}Copyright &copy; {metadata.agent.instance.fy}
                         {' '}<span title={( metadata.org.name + " " + metadata.org.location + "...")} onClick={function() { window.location = metadata.org.url; }} style={{ cursor: 'pointer' }}>
                         {metadata.org.copyrightHolder.name}
                         </span>
                         </span>);

            if (this.state.showAppInfo) {

                content.push(<div key={makeKey()} style={theme.base.RUXBase_PageFooter.versionText}>
                             {metadata.site.build.packageAuthor}_{metadata.site.build.packageName}_v{metadata.site.build.packageVersion}_{metadata.site.build.packageCodename}_{metadata.site.build.buildCommitShortHash}_{metadata.site.build.buildID} released {metadata.site.build.buildTimestamp}
                             </div>);
            }

            return (<div style={theme.base.RUXBase_PageFooter.container}>{content}</div>);
        } // end render
    }) // reactComponent
}); // componentBindingFilterFactory.create

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;

