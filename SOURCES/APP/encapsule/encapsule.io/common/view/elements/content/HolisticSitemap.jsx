////
// sitemap.jsx - renders a simple sitemap indicating the
// currently selected page if a route hash is specified
// via React props.

const ARCCORE = require('arccore');
const React = require('react');
const HolisticIconPageHeader = require('../common/HolisticIconPageHeader.jsx');
const color = require('color');

module.exports = class HolisticSitemap extends React.Component {

    render() {
        try {
            var self = this;
            var viewStore = this.props.appStateContext.viewStore;
            var thisPageMetadata = this.props.document.metadata.page;
            var thisPageURI = thisPageMetadata.uri;

            var totalPages = 0;

            var renderPageLinkAndDescription = function(pageURI_, numberX_, ofY_) {
                var pageMetadata = viewStore.getVertexProperty(pageURI_);

                var x = 0;
                var y = pageMetadata.children.length;

                var childPageLinksAndDescriptions = pageMetadata.children.map(function(childPageURI_) {
                    return renderPageLinkAndDescription(childPageURI_, x++, y);
                });

                var marginTop = numberX_?'0.125em':'0.125em';
                var marginLeft = (pageMetadata.ts.d?'1em':'0em');

                var pageBlockStylesOuter = {
                    margin: '0em',
                    marginTop: marginTop,
                    marginLeft: marginLeft,
                    padding: '0.125em',
                    paddingLeft: "1em",
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderLeft: "2px solid #EEE"
                };

                var iconStyles = { position: 'relative', top: '-2px', width: '24px', height: '24px', verticalAlign: 'middle' };

                totalPages++;

                var descriptionStyles = {
                    paddingTop: '0.0em',
                };

                if (pageMetadata.children.length) {
                    return (<div key={"Sitemap" + pageURI_} style={pageBlockStylesOuter}>
                            <div>
                            <img src={pageMetadata.icons.svg} style={iconStyles} />
                            <span style={{verticalAlign: 'middle'}}>{' '}
                            <a href={pageURI_} title={pageMetadata.tooltip}><strong>{pageMetadata.name}</strong> - {pageMetadata.pageTitle}</a>
                            </span></div>
                            <div style={descriptionStyles}>{pageMetadata.pageDescription}</div>
                            {(childPageLinksAndDescriptions.length?childPageLinksAndDescriptions:'')}
                            </div>
                           );
                } else {
                    return (<div key={"Sitemap" + pageURI_} style={pageBlockStylesOuter}>
                            <div>
                            <img src={pageMetadata.icons.svg} style={iconStyles} />
                            <span style={{verticalAlign: 'middle'}}>{' '}
                            <a href={pageURI_} title={pageMetadata.tooltip}><strong>{pageMetadata.name}</strong> - {pageMetadata.pageTitle}</a>
                            </span></div>
                            <div style={descriptionStyles}>{pageMetadata.pageDescription}</div>
                            </div>
                           );
                }
            };
            return (<div>
                    <HolisticIconPageHeader svg={thisPageMetadata.icons.svg} title={thisPageMetadata.contentTitle}
                    subtitle={thisPageMetadata.contentSubtitle} />
                    {renderPageLinkAndDescription('/', 0, 1)}
                    </div>);
        } catch (exception_) {
            return (<div>Fatal exception in {this.className}: + {exception_.toString()}</div>);
        }

    } // end render method

} // end class HolisticSitemap
