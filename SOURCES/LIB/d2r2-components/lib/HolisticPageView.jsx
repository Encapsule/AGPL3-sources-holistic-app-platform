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
            ____label: "HolisticPageView Render Request Message",
            ____description: "@encapsule/d2r2 renderData request format used to dynamically bind a <HolisticPageView/> React element.",
            ____types: "jsObject", // Caller must explicitly specify the HolisticPageView namespace...

            pageHeaderEP: {
                ____label: "Page Header Extension Point (EP)",
                ____description: "The contents of this namespace is created dynamically via <ComponentRouter/>.",
                ____accept: [ "jsNull", "jsObject" ],
                ____defaultValue: { AppServiceDisplayExtenstion_PageHeader: {} }
            },

            pageContentEP: {
                ____label: "Page Content Extension Point (EP)",
                ____description: "The contents of this namespace is created dynamically via <ComponentRouter/>.",
                ____accept: "jsArray",
                ____defaultValue: []
            },

            pageFooterEP: {
                ____label: "Page Footer Extension Point (EP)",
                ____description: "The contents of this namespace is created dynamically via <ComponentRouter/>.",
                ____accept: [ "jsNull", "jsObject" ],
                ____defaultValue: { AppServiceDisplayExtension_PageFooter: {} }
            },

            pageDebugEP: {
                ____label: "Page Debug Extenion Point (EP)",
                ____description: "The contents of this namespace is created dynamically via <ComponentRouter/>.",
                ____accept: "jsArray",
                ____defaultValue: []
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
                } // padding
            }, // container
        }
    }, // Renderdatabindingspec
    reactComponent: class HolisticPageView extends React.Component {
        render() {

            try {

                let self = this;
                const ComponentRouter = this.props.renderContext.ComponentRouter;
                const renderData = this.props.renderData;
                const renderMessage = renderData.HolisticPageView;

                let index = 0;
                function makeKey() { return ("HolisticPageView" + index++); }
                let content = [];

                // Optionally inject custom page header element.
                if (renderMessage.pageHeaderEP) {
                    content.push(<ComponentRouter key={makeKey()} {...self.props} renderData={renderMessage.pageHeaderEP} />);
                }

                // Inject the page view's content element(s).
                if (renderMessage.pageContentEP.length) {
                    renderMessage.pageContentEP.forEach(function(contentRenderData_) {
                        content.push(<ComponentRouter key={makeKey()} {...self.props} renderData={contentRenderData_} />);
                    });
                } else {
                    content.push(<div key={makeKey()}>No page view content elements were specified. Nothing to display...</div>);
                }

                // Optionally inject custom page footer element.
                if (renderMessage.pageFooterEP) {
                    content.push(<ComponentRouter key={makeKey()} {...self.props} renderData={renderMessage.pageFooterEP}/>);
                }

                // Optionally inject developer tooling element(s).
                renderMessage.pageDebugEP.forEach(function(contentRenderData_) {
                    content.push(<ComponentRouter key={makeKey()} {...self.props} renderData={contentRenderData_} />);
                });

                return (<div>{content}</div>);

            } catch (exception_) {
                return (<div>An unhandled exception occurred inside HolisticPageView::render method: {exception_.message}</div>);
            }

        }
    }
});
if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
