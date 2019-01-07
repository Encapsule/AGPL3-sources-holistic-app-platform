////
// HolisticBreadcrumbs.jsx

const ARCCORE = require('arccore');
const React = require('react');
const HorizontalMenuItem = require('./HolisticHorizontalMenuItem.jsx');

export class Breadcrumbs extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        try {
            const metadata = this.props.document.metadata;

            var key = 0;
            function makeKey() { return ("breadcrumbs" + key++); };

            var viewStore = this.props.appStateContext.viewStore;
            var pageViewURI = metadata.page.uri;
            var targetViewURI = pageViewURI;
            var targetViewURITokens = targetViewURI.split('/');

            while (!viewStore.isVertex(targetViewURI)) {
                targetViewURITokens.pop();
                targetViewURI = targetViewURITokens.join('/');
                if (targetViewURI.length === 0) {
                    targetViewURI = '/';
                    break;
                }
            }

            var breadcrumbs = [];
            breadcrumbs.unshift(<HorizontalMenuItem {...this.props} targetViewURI={targetViewURI} selectedViewURI={pageViewURI} key={makeKey()} />);

            var dividerStyles = {
                textAlign: 'middle',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '9pt',
                position: 'relative',
                fontWeight: 'bold',
                paddingTop: '0.2em',
                paddingBottom: '0.2em',
                color: '#07C',
                verticalAlign: 'middle'
            };

            while (targetViewURI !== '/') {

                targetViewURI = viewStore.inEdges(targetViewURI)[0].u;
                breadcrumbs.unshift(<span key={makeKey()} style={dividerStyles}>/</span>);
                breadcrumbs.unshift(<HorizontalMenuItem {...this.props} targetViewURI={targetViewURI} selectedViewURI={pageViewURI} key={makeKey()} />);
            }

            return (<div style={metadata.site.theme.breadcrumbsBlock} onClick={this.props.toggleMenuBars} title="Click to hide/show menu bars...">{breadcrumbs}</div>);

        } catch (exception_) {
            return (<div>Fatal exception in {this.className}: {exception_.toString()}</div>);
        }

    } // end render method

} // end class Breadcrumbs
