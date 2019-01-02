// routelink.jsx

const ARCCORE = require('arccore');
const React = require('react');

const RouteHashLink = require('./routehashlink.jsx');

var RouteLink = React.createClass({

    displayName: "RouteLink",

    render: function() {

        var pagesGraph = this.props.pagesGraph;
        var route = this.props.route;

        var errorStyles = {
            backgroundColor: '#FFCC99',
            fontWeight: 'bold'
        };

        if (route === undefined) {
            return (<span style={errorStyles}><strong>Missing route! No link produced.</strong></span>);
        }

        var routeHash = this.props.lookup.routeToRouteHashMap[route];
        if (routeHash === undefined) {
            return (<span style={errorStyles}><strong>Route '{route}' is not defined! No link produced.</strong></span>);
        }

        if (!pagesGraph.isVertex(routeHash)) {
            return (<span style={errorStyles}><strong>Route '{route}' is not associated with React JS subsystem! No link produced.</strong></span>);
        }

        return (<RouteHashLink {...this.props} routeHash={routeHash} />);

    }

});

module.exports = RouteLink;


