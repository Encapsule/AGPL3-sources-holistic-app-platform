// HolisticDocLibraryPageView.jsx

const React = require('react');

module.exports = React.createClass({
    displayName: "HolisticDocLibraryPageView",
    render: function() {

        var data = this.props.document.data;
        var unboxed = data[Object.keys(data)[0]];

        return (<div>
                <h1>HolisticDocLibraryPageView</h1>
                <p>{unboxed.vertexID}</p>
                </div>);
    }
});

