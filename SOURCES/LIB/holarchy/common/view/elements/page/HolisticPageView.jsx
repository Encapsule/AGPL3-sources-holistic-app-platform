// sources/common/view/elements/page/HolisticPageView.jsx
//

const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({
    id: "hCuVI2B6TbumErHrzPQjfQ",
    name: "HolisticPageView",
    description: "Common single-page HTML5 page view template for use with D2R2.",
    renderDataBindingSpec: {
        ____types: "jsObject",
        HolisticPageView: {
            ____label: "RUXBase_Page HTML View Render Request",
            ____description: "HTML render request format for <RUXBase_Page/> React component.",
            ____types: "jsObject", // the caller must literally specify this subnamespace

            pageHeaderEP: {
                ____label: "Page Header Extension Point (EP)",
                ____description: "The contents of this namespace is rendered dynamically via <ComponentRouter/>.",
                ____accept: "jsObject",
                ____defaultValue: { RUXBase_PageHeader_QCGlobalNavWrapper: {} }
            },

            pageContentEP: {
                ____label: "Page Content Extension Point (EP)",
                ____description: "The contents of this namespace is rendered dynamically via <ComponentRouter/>.",
                ____accept: "jsObject",
                ____defaultValue: { RUXBase_PageContent: {} }
            },

            pageFooterEP: {
                ____label: "Page Footer Extension Point (EP)",
                ____description: "The contents of this namespace is rendered dynamically via <ComponentRouter/>.",
                ____accept: "jsObject",
                ____defaultValue: { RUXBase_PageFooter: {} }
            },

            pageErrorsEP: {
                ____label: "Page Errors Extension Point (EP)",
                ____description: "The contents of this namespace is rendered dynamically via <ComponentRouter/>.",
                ____accept: "jsObject",
                ____defaultValue: { RUXBase_PagePanel_Errors: {} }
            },

            pageDebugEP: {
                ____label: "Page Debug Extenion Point (EP)",
                ____description: "The contents of this namespace is rendered dynamically via <ComponentRouter/>.",
                ____accept: "jsObject",
                ____defaultValue: { RUXBase_PagePanel_ReactDebug: {} }
            }
        }
    }, // renderDataBindingSpec
    reactComponent: class HolisticPageView extends React.Component {
        render() {
            const ComponentRouter = this.props.appStateContext.ComponentRouter;
            const metadata = this.props.document.metadata;
            const theme = metadata.site.theme;
            const renderData = this.props.renderData['HolisticPageView'];
            return (
                    <div id="idRUXBase_Page" style={theme.base.RUXBase_Page.container}>
                    <ComponentRouter {...this.props} renderData={renderData.pageHeaderEP}/>
                    <ComponentRouter {...this.props} renderData={renderData.pageContentEP}/>
                    <ComponentRouter {...this.props} renderData={renderData.pageFooterEP}/>
                    <ComponentRouter {...this.props} renderData={renderData.pageErrorsEP}/>
                    <ComponentRouter {...this.props} renderData={renderData.pageDebugEP}/>
                    <ComponentRouter {...this.props} renderData={{ RUXBase_PageWidget_ASC: {} }}/>
                    <br/>
                    </div>
            );
        }
    }
});
if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;


