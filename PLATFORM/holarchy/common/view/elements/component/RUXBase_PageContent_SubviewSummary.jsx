// sources/common/view/elements/component/RUXBase_PageContent_SubviewSummary.jsx

const path = require('path');
const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "VAqVq3IgTF69dXTFHTLPMA",
    name: "RUXBase_PageContent_SubviewSummary",
    description: "<RUXBase_PageContent_SubviewSummary renders some markdown-encoded content, and a list of links to child views exposed in the app metadata store.",

    renderDataBindingSpec: {
        ____types: "jsObject",
        RUXBase_PageContent_SubviewSummary: {
            ____label: "RUXBase_PageContentSubviewSummary HTML Render Request.",
            ____types: "jsObject",
            renderOptions: {
                ____label: "Render Options",
                ____types: "jsObject",
                ____defaultValue: {},
                showPageTitle: {
                    ____label: "Show Page Title",
                    ____accept: "jsBoolean",
                    ____defaultValue: true
                },
                contentContainerStyles: {
                    ____label: "Content Container Styles",
                    ____description: "Programmatic style object to apply to the DIV around the content (if there is any).",
                    ____accept: "jsObject",
                    ____defaultValue: {
                        paddingTop: '1em',
                        paddingBottom: '1em'
                    }
                }
            },
            contentEP: {
                ____label: "Content Extension Point Array",
                ____description: "Expects an array of zero or more objects of arbitrary namespace:type signature to be rendered via <ComponentRouter/> in the order specified.",
                ____types: "jsArray",
                ____defaultValue: [],
                content: {
                    ____label: "Content Render Request",
                    ____accept: "jsObject"
                }
            }
        }
    },

    reactComponent: React.createClass({

        displayName: "RUXBase_PageContent_SubviewSummary",

        render: function() {

            try {

                var self = this;
                var ComponentRouter = this.props.appStateContext.reactComponentRouter;
                const metadata = this.props.document.metadata;
                const metadataStore = this.props.appStateContext.appMetadataStore;
                const theme = metadata.site.theme;
                const renderData = this.props.renderData['RUXBase_PageContent_SubviewSummary'];

                var keyIndex = 0;
                function makeKey() { return ("RUXBase_PageContent_SubviewSummary" + keyIndex++); }

                var content = [];
                var titleContent = [];
                var breadcrumbLinks = [];

                const siteMetadata = metadataStore.getVertexProperty('__website');
                const deployConfig = siteMetadata.build.buildConfig.deployConfig;

                function makeAbsoluteURI(uriSuffix_) {
                    return path.join(deployConfig.appBasePath, uriSuffix_);
                }

                if (renderData.renderOptions.showPageTitle) {

                    if (metadataStore.isVertex(metadata.page.uri)) {

                        if (metadata.page.ts.d === 0) { // tree depth is zero
                            breadcrumbLinks.push(<span key={makeKey()} style={theme.base.RUXBase_PageContent_SubviewSummary.breadcrumbsNonLinkTextHighlight}>{metadata.site.name} {metadata.page.name}</span>);
                        } else {
                            const homeMetadata = metadataStore.getVertexProperty('/');
                            if (metadata.page.ts.d > 1) {
                                // Breadcrumbs...
                                var examineURI = metadata.page.uri;
                                while (examineURI && (examineURI !== '/')) {
                                    var parentURI = metadataStore.inEdges(examineURI)[0].u;
                                    var parentMetadata = metadataStore.getVertexProperty(parentURI);
                                    if (parentMetadata.ts.d > 0)
                                        breadcrumbLinks.unshift(<span key={makeKey()}>
                                                                <a href={makeAbsoluteURI(parentURI)} title={parentMetadata.tooltip}>{parentMetadata.name}</a>
                                                                <span style={theme.base.RUXBase_PageContent_SubviewSummary.breadcrumbsNonLinkText}>{'/'}</span>
                                                                </span>);
                                    examineURI = parentURI;
                                }
                            }
                            breadcrumbLinks.unshift(<span key={makeKey()} style={theme.base.RUXBase_PageContent_SubviewSummary.breadcrumbsNonLinkText}>{'::'}</span>);
                            breadcrumbLinks.unshift(<a key={makeKey()} href={makeAbsoluteURI("/")} title={homeMetadata.tooltip}>{metadata.site.name}</a>);
                            breadcrumbLinks.push(<span key={makeKey()} style={theme.base.RUXBase_PageContent_SubviewSummary.breadcrumbsNonLinkTextHighlight}>{metadata.page.name}</span>);
                        } // else

                    } else {
                        breadcrumbLinks.unshift(<span key={makeKey()} style={theme.base.RUXBase_PageContent_SubviewSummary.breadcrumbsNonLinkTest}>
                                                Missing metadata for page URI
                                                {' '}<code>{metadata.page.uri}</code>
                                                </span>);
                    } // else

                } // if

                var subContent = [];
                renderData.contentEP.forEach(function (htmlRenderRequest_) {
                    subContent.push(<ComponentRouter key={makeKey()} {...self.props} renderData={htmlRenderRequest_}/>);
                });

                var childViewItems = [];
                var childViewItemsShort = [];

                if (metadataStore.isVertex(metadata.page.uri)) {
                    metadata.page.children.forEach(function(childPageViewURI_) {
                        let relativeChildUri = childPageViewURI_;
                        if(childPageViewURI_.indexOf('/') == 0){
                            relativeChildUri = childPageViewURI_.substring(1);
                        }

                        var childViewMetadata = metadataStore.getVertexProperty(childPageViewURI_);
                        if (childViewMetadata.view_options.show_in_sitemap) {
                            childViewItems.push(<li key={makeKey()}>
                                                <a href={makeAbsoluteURI(relativeChildUri)} title={childViewMetadata.tooltip}><strong>{childViewMetadata.name}</strong></a> - {childViewMetadata.description}
                                                </li>);
                            childViewItemsShort.push(<a key={makeKey()} href={makeAbsoluteURI(relativeChildUri)} title={childViewMetadata.tooltip}>{childViewMetadata.name}</a>);
                            childViewItemsShort.push(<span key={makeKey()} style={theme.base.RUXBase_PageContent_SubviewSummary.childViewListShortNonLinkText}>{'|'}</span>);
                        }
                    });
                }
                if (childViewItemsShort.length)
                    // Remove the trailing divider element.
                    delete childViewItemsShort[childViewItemsShort.length - 1];

                // Render the breadcrumbs title, description, and short child view list iff enabled.
                if (renderData.renderOptions.showPageTitle) {
                    content.push(<div key={makeKey()} style={theme.base.RUXBase_PageContent_SubviewSummary.breadcrumbsContainer}>{breadcrumbLinks}</div>);
                    if (metadataStore.isVertex(metadata.page.uri)) {
                        if (metadata.page.ts.d === 0) { // tree depth is zero
                            content.push(<div key={makeKey()} style={theme.base.RUXBase_PageContent_SubviewSummary.description}>{metadata.site.description}</div>);
                        } else {
                            content.push(<div key={makeKey()} style={theme.base.RUXBase_PageContent_SubviewSummary.description}>{metadata.page.description}</div>);
                        }
                    } else {
                        content.push(<div key={makeKey()} style={theme.base.RUXBase_PageContent_SubviewSummary.description}><i>No page metadata so no description...</i></div>);
                    }
                    if (childViewItemsShort.length && renderData.contentEP.length) {
                        content.push(<div key={makeKey()} style={theme.base.RUXBase_PageContent_SubviewSummary.childViewListShort}>
                                     <span style={theme.base.RUXBase_PageContent_SubviewSummary.childViewListShortNonLinkTextLabel}>
                                     {((childViewItemsShort.length > 2)?'Sections: ':'Section: ')}
                                     </span>
                                     {childViewItemsShort}
                                     </div>);
                    }
                }

                content.push(<div key={makeKey()} style={renderData.renderOptions.contentContainerStyles}>{subContent}</div>);

                if (childViewItems.length) {
                    content.push(<div key={makeKey()}>
                                 <span style={theme.base.RUXBase_PageContent_SubviewSummary.childViewListShortNonLinkTextLabel}>{((childViewItems.length > 1)?'Sections':'Section')}:</span>
                                 <ul key={makeKey()}>{childViewItems}</ul>
                                 </div>);
                }


                return (<div style={theme.base.RUXBase_PageContent_SubviewSummary.container}>{content}</div>);

            } catch (exception_) {
                return (<div>Unhandled exception in &lt;RUXBase_PageContent_SubviewSummary/&gt;: {exception_.toString()}</div>);
            }
        }
    })

});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;

