// HolisticDocLibraryPageView.jsx

const React = require('react');

module.exports = class HolisticDocLibraryPageView extends React.Component {

    render() {

        var data = this.props.document.data;
        var unboxed = data[Object.keys(data)[0]];

        return (<div>
                <h1>HolisticDocLibraryPageView</h1>
                <p>{unboxed.vertexID}</p>
                </div>);
    } // end render method
    
} // end class HolisticDocLibraryyPageView

