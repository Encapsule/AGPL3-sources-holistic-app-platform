// HolisticHorizontalMenuBar

const React = require('react');
const HorizontalMenuItem = require('./HolisticHorizontalMenuItem.jsx');
const color = require('color');

// snapsite page context via this.props
// + this.props.parentRoute
// + this.props.selectedRoute

// NEW:
// this.props.parentViewURI
// this.props.currentViewURI

// if selected route is the parent route -> children unselected
// if selected route is neither the parent nor descendent -> same as above
// if selected route is a descendent and it's a child -> children with select
// if selected route is a descendent but not a child -> children with active

module.exports = React.createClass({
    displayName: 'HolisticHorizontalMenuBar',
    render: function() {

        try {

            const metadata = this.props.document.metadata;
            const viewStore = this.props.appStateContext.viewStore;
            const parentViewURI = this.props.parentViewURI;
            const selectedViewURI = this.props.selectedViewURI;

            var keyIndex = 0;
            var self = this;
            var makeKey = function() {
                return "hmb" + keyIndex++;
            };

            if (!viewStore.isVertex(parentViewURI)) {
                return (<div>HorizontalMenuBar unknown parent view URI '{parentViewURI}'.</div>);
            }

            const parentViewProperties = viewStore.getVertexProperty(parentViewURI);
            const selectedViewProperties = viewStore.getVertexProperty(selectedViewURI);

            // The root of the pages digraph has no associated property object in the view store model.
            var childrenViewURIs = parentViewProperties?parentViewProperties.children:['/'];

            var childMenuItems = [];

            var depthIndicatorStyles = {
                textAlign: 'middle',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '10pt',
                paddingTop: '0.2em',
                paddingBottom: '0.2em',
                verticalAlign: 'middle',
                color: '#07C'
            };

            /*
            if (parentViewProperties) {
                childMenuItems.push(<span key={makeKey()} style={depthIndicatorStyles}>{parentViewProperties.ts.d}{': '}</span>);
                childMenuItems.push(<HorizontalMenuItem
                                    {...this.props}
                                    targetViewURI={parentViewURI}
                                    selectedViewURI={selectedViewURI}
                                    key={makeKey()}
                                    />);

                childMenuItems.push(<span key={makeKey()} style={depthIndicatorStyles}>{' / '}{parentViewProperties.ts.d + 1}{': '}</span>);
            }
            */

            for (var childViewURI of childrenViewURIs) {
                childMenuItems.push(<HorizontalMenuItem {...this.props} targetViewURI={childViewURI} selectedViewURI={selectedViewURI} key={makeKey()}/>);
            }

            // TODO: Move this awesome function, round, into arccore.util
            function round(value, decimals) {
                return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
            }

            var tweakRed = 1;
            var tweakGreen = 1;
            const base = 0xFF;

            var colorBase = '#F7F7F7';
            var color1 = null;
            if (parentViewProperties) {
                color1 = color(colorBase).darken(parentViewProperties.ts.d * 0.025).alpha(0.5);
            } else {
                color1 = baseBase;
            }

            var color2 = color1;
            var color3 = color(color1).darken(0.1);


            var styles = {
                backgroundColor: color1,
                boxShadow: '0px 1px 2px 0px ' + color2 + ' inset',
                borderBottom: '1px solid ' + color3,
                padding: '0.5em',
                verticalAlign: 'middle',
                color: '#036',
                fontSize: '12pt'
            };

            return (<div style={styles}>{childMenuItems}</div>);

        } catch (exception_) {
            return (<div>Fatal exception in {this.className}: {exception_.toString()}</div>);
        }
    }
});
