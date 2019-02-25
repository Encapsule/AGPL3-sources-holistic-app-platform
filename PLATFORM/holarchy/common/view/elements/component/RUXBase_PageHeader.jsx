// sources/common/view/elements/components/RUX_PageHeader.jsx
//

const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');

const RUXBase_PageHeader_LoginWidget = require('./RUXBase_PageHeader_LoginWidget.jsx');

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "YSEtrMkpTGu3MJW07JANbg",
    name: "RUXBase_PageHeader",
    description: "<RUXBase_PageHeader/> React Component Binding",
    renderDataBindingSpec: {
        ____types: "jsObject",
        RUXBase_PageHeader: {
            ____accept: "jsObject"
        }
    },
    reactComponent: React.createClass({
        displayName: "RUXBase_PageHeader",
        onClickIcon: function() {
            const metadata = this.props.document.metadata;
            const qcHomeIconLinkURL = ((metadata.page.uri !== '/sitemap')?'/sitemap':'/');
            window.location = qcHomeIconLinkURL;
        },
        render: function() {
            var ComponentRouter = this.props.appStateContext.reactComponentRouter;
            const metadata = this.props.document.metadata;
            const theme = metadata.site.theme;
            const renderData = this.props.renderData['RUXBase_PageHeader_Error'];
            var keyIndex = 0;
            function makeKey() { return ("RUXBase_PageHeader" + keyIndex++); }
            var content = [];
            var titleBarContent = [];
            var qcHomeIconLinkTitle = ((metadata.page.uri !== '/sitemap')?'Sitemap...':'Home...');
            titleBarContent.push(<span key={makeKey()} title={qcHomeIconLinkTitle} onClick={this.onClickIcon} style={{ cursor: "pointer" }}>
                                 WHATEVER
                                 </span>);
            titleBarContent.push(<div key={makeKey()} style={theme.base.RUXBase_PageHeader.titleBlock}>
                                 <span style={theme.base.RUXBase_PageHeader.titleBlockCompany}>{metadata.org.copyrightHolder.name}</span>
                                 {' '}<span style={theme.base.RUXBase_PageHeader.titleBlockTitle}>{metadata.agent.app.name}</span><br/>
                                 <span style={theme.base.RUXBase_PageHeader.titleBlockSubtitle}>&nbsp;{metadata.site.description}</span>
                                 </div>);
            titleBarContent.push(<RUXBase_PageHeader_LoginWidget key={makeKey()} {...this.props}/>);

            content.push(<div key={makeKey()} style={theme.base.RUXBase_PageHeader.titleBar}>{titleBarContent}</div>);

            return (<div style={theme.base.RUXBase_PageHeader.containerShadow}>
            <div style={theme.base.RUXBase_PageHeader.container}>{content}</div>
            </div>);
        }
    })
});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
