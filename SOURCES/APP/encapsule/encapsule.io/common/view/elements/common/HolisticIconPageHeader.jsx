// HolisticIconPageHeader.jsx

const React = require('react');

const container0Styles = {
    marginBottom: '1em'
};

const container1Styles = {
    borderBottom: "2px solid #D7E3F4"
}

const container2Styles = {
    display: "inline-block",
};

const iconStyles = {
    width: '72px',
    height: '72px',
    verticalAlign: 'middle'
};

const titleStyles = {
    fontFamily: "'Play', sans-serif",
    fontWeight: 'bold',
    color: '#214478',
    fontSize: '26pt',
    verticalAlign: 'middle',
    paddingLeft: '16px'
};

// Approximates H6 styles minus extra padding
const subtitleStyles = {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 'bold',
    color: '#5F8DD3',
    fontSize: '14pt',
    position: 'relative',
    marginLeft: '72px',
    paddingLeft: '1em',
    top: '-0.5em'
};


export class IconPageHeader extends React.Component {

    // this.props.svg -> site-relative SVG icon path
    // this.props.title -> page title to display next to icon (typically page metadata contentTitle)
    // this.props.substitle -> page subtitle to display beneath the title (typically page metadata contentSubtitle)
    render() {
        try {
            return (<div style={container0Styles}>
                    <div style={container1Styles}>
                    <div style={container2Styles}>
                    <img src={this.props.svg} title={this.props.title} style={iconStyles} />
                    <span style={titleStyles}>{this.props.title}</span><br/>
                    <span style={subtitleStyles}>{this.props.subtitle}</span>
                    </div></div></div>
                   );
        } catch (exception_) {
            return (<div>HolisticIconPageHeader exception: {exception_.toString()}</div>);
        }
    }
}

