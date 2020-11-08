// sources/common/view/elements/page/HolisticPageView.jsx
//

const React = require('react');
const reactComponentBindingFilterFactory = require('./binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({
    id: "hCuVI2B6TbumErHrzPQjfQ",
    name: "<HolisticPageView/>",
    description: "Common single-page HTML5 page view template for use with D2R2.",
    renderDataBindingSpec: {
        ____types: "jsObject",
        HolisticPageView: {
            ____label: "RUXBase_Page HTML View Render Request",
            ____description: "HTML render request format for <RUXBase_Page/> React component.",
            ____types: "jsObject", // the caller must literally specify this subnamespace

            pageHeaderEP: {
                ____label: "Page Header Extension Point (EP)",
                ____description: "The contents of this namespace is created dynamically via <ComponentRouter/>.",
                ____accept: "jsObject",
                ____defaultValue: { ApplicationPageHeader: {} }
            },

            pageContentEP: {
                ____label: "Page Content Extension Point (EP)",
                ____description: "The contents of this namespace is created dynamically via <ComponentRouter/>.",
                ____accept: "jsArray",
                ____defaultValue: [ { ApplicationPageMissingContent: {} } ]
            },

            pageFooterEP: {
                ____label: "Page Footer Extension Point (EP)",
                ____description: "The contents of this namespace is created dynamically via <ComponentRouter/>.",
                ____accept: "jsObject",
                ____defaultValue: { ApplicationPageFooter: {} }
            },

            pageDebugEP: {
                ____label: "Page Debug Extenion Point (EP)",
                ____description: "The contents of this namespace is created dynamically via <ComponentRouter/>.",
                ____accept: "jsArray",
                ____defaultValue: [
                    { HolisticDebugReactComponentProps: {} }
                ]
            }
        }, // HolisticPageView
        styles: {
            ____label: "Styles",
            ____description: "Programmatic CSS for use with React.",
            ____types: "jsObject",
            ____defaultValue: {},
            container: {
                ____types: "jsObject",
                ____defaultValue: {},
                margin: {
                    ____accept: "jsString",
                    ____defaultValue: "0px"
                }, // margin
                padding: {
                    ____accept: "jsString",
                    ____defaultValue: "0px"
                }, // padding
                backgroundColor: {
                    ____accept: "jsString",
                    ____defaultValue: "white"
                }
            }, // container
        }
    }, // Renderdatabindingspec
    reactComponent: class HolisticPageView extends React.Component {
        render() {
            let self = this;
            const ComponentRouter = this.props.renderContext.ComponentRouter;
            const renderData = this.props.renderData;
            const renderMessage = renderData.HolisticPageView;

            let index = 0;
            function makeKey() { return ("HolisticPageView" + index++); }
            let content = [];

            content.push(<ComponentRouter key={makeKey()} {...this.props} renderData={renderMessage.pageHeaderEP} />);
            renderMessage.pageContentEP.forEach(function(contentRenderData_) {
                content.push(<ComponentRouter key={makeKey()} {...self.props} renderData={contentRenderData_} />);
            });
            content.push(<ComponentRouter key={makeKey()} {...this.props} renderData={renderMessage.pageFooterEP}/>);
            renderMessage.pageDebugEP.forEach(function(contentRenderData_) {
                content.push(<ComponentRouter key={makeKey()} {...self.props} renderData={contentRenderData_} />);
            });

            return (<div>{content}</div>);

        }
    }
});
if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
