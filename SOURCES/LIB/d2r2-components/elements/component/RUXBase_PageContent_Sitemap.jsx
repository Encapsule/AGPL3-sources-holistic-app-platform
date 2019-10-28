////
//
// RUXBase_PageContent_Sitemap.jsx - renders a simple sitemap indicating the currently selected page
// if a route hash is specified via React props. This is a very simple example of accessing
// the application metadata store that is made available to server-side 'service' filter
// plug-ins, client-side application logic, and React components via this.props on both
// client and server.
//

const path = require('path');
const arccore = require('@encapsule/arccore');
const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');
const color = require('color');

// TODO OCT 2019 --- The primary value of keeping this around right now seems to be that it's
// a reasonable example of accessing the app metadata store.

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "_JY7rlS2R3u-oBHS8K-dCg",
    name: "<RUXBase_PageContent_Sitemap/>",
    description: "Data binding filter for <RUXBase_PageContent_Sitemap/> React component.",
    renderDataBindingSpec: {
        ____types: "jsObject",
        "RUXBase_PageContent_Sitemap": {
            ____accept: "jsObject"
        }
    },
    reactComponent: React.createClass({
        displayName: "RUXBase_PageContent_Sitemap",
        render: function() {
            try {
                var self = this;
                var ComponentRouter = this.props.appStateContext.reactComponentRouter;
                const metadata = this.props.document.metadata;
                const theme = metadata.site.theme;
                const renderData = this.props.renderData['RUXBase_PageContent_Sitemap'];
                var keyIndex = 0;
                function makeKey() { return ("RUXBase_PageContent_Sitemap" + keyIndex++); }

                var appMetadataStore = this.props.appStateContext.appMetadataStore;
                var thisPageMetadata = this.props.document.metadata.page;
                var thisPageURI = thisPageMetadata.uri;

                const siteMetadata = appMetadataStore.getVertexProperty('__website');
                const deployConfig = siteMetadata.build.buildConfig.deployConfig;

                function makeAbsoluteURI(uriSuffix_) {
                    return path.join(deployConfig.appBasePath, uriSuffix_);
                }

                var totalPages = 0;

                var renderPageLinkAndDescription = function(pageURI_, numberX_, ofY_) {
                    var pageMetadata = appMetadataStore.getVertexProperty(pageURI_);

                    var x = 0;
                    var y = pageMetadata.children.length;

                    var childPageLinksAndDescriptions = [];

                    pageMetadata.children.forEach(function(childPageURI_) {
                        var childPageMetadata = appMetadataStore.getVertexProperty(childPageURI_);
                        if (childPageMetadata.view_options.show_in_sitemap)
                            childPageLinksAndDescriptions.push(<span key={makeKey()}>{renderPageLinkAndDescription(childPageURI_, x++, y)}</span>);
                    });

                    var marginTop = numberX_?'0.5em':'0em';
                    var marginLeft = (pageMetadata.ts.d?'1em':'0em');

                    var iconStyles = { position: 'relative', top: '-2px', width: '24px', height: '24px', verticalAlign: 'middle' };

                    totalPages++;

                    var descriptionStyles = {
                        paddingTop: '0.0em',
                    };

                    var pageContainerStyles = arccore.util.clone(theme.base.RUXBase_PageContent_Sitemap.pageContainer);
                    pageContainerStyles.marginTop = marginTop;
                    pageContainerStyles.marginLeft = marginLeft;

                    if (pageMetadata.children.length) {
                        return (<div key={"Sitemap" + pageURI_} style={pageContainerStyles}>
                                <div style={{ marginBottom: '0.75em'}}>
                                <span style={{verticalAlign: 'middle'}}>-{' '}
                                <a href={makeAbsoluteURI(pageURI_)} title={pageMetadata.tooltip}><strong>{pageMetadata.name}</strong> - {pageMetadata.description}</a>
                                </span>
                                </div>
                                <div style={descriptionStyles}>{pageMetadata.pageDescription}</div>
                                {(childPageLinksAndDescriptions.length?childPageLinksAndDescriptions:'')}
                                </div>
                               );
                    } else {
                        return (<div key={"Sitemap" + pageURI_} style={pageContainerStyles}>
                                <div>
                                <span style={{verticalAlign: 'middle'}}>&bull;{' '}
                                <a href={makeAbsoluteURI(pageURI_)} title={pageMetadata.tooltip}><strong>{pageMetadata.name}</strong> - {pageMetadata.description}</a>
                                </span></div>
                                <div style={descriptionStyles}>{pageMetadata.pageDescription}</div>
                                </div>
                               );
                    }
                };

                return (<div style={theme.base.RUXBase_PageContent_Sitemap.container}>
                        {renderPageLinkAndDescription('/', 0, 1)}
                        </div>);

            } catch (exception_) {
                return (<div>Fatal exception in &lt;RUXBase_PageContent_Sitemap&gt;: + {exception_.toString()}</div>);
            }
        } // render()
    }) // React.createClass
}); // reactComponentBindingFilterFactory.create

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
