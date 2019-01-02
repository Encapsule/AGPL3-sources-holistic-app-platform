// site-view-theme-data.js
//
/*
  Custom theme for this website.

  TODO: This theme was inherited from the Encapsule/snapsite project
  and needs to be scrubbed. And, then converted into a filter so that
  others can easily override the values without breaking any of the
  dependent React components.

*/

module.exports = {

    // Styles to apply to HTML BODY tag.
    body: {
        margin: '0px',
        padding: '0px'
    },

    // Default style for internal A tags
    link: {
        textDecoration: 'none',
        color: '#F00',
    },
    // Default style for internal A:hover (simulated)
    linkHover: {
        textDecoration: 'none',
        color: '#00F',
        borderBottom: '1px solid #00F'
    },
    // Default style for internal A:active (simulated)
    linkLoading: {
        textDecoration: 'none',
        color: '#069',
        borderBottom: '1px solid #069',
    },

    page: {
        fontSize: '12pt', // default font size
        fontFamily: "'Nunito', sans-serif"
        // fontFamily: "'Abel', sans-serif"
    },

    // Styles to apply to breadcrumbs block
    breadcrumbsBlock: {
        borderTop: '1px solid #CCC',
        borderBottom: '1px solid #CCC',
        boxShadow: '0px 1px 5px 0px #AFC6E9 inset',
        backgroundColor: 'rgba(215, 227, 244, 0.7)',
        paddingTop: '0.5em',
        paddingBottom: '0.5em',
        paddingLeft: '0.5em',
        cursor: 'ns-resize'
    },

    // Going to re-use this on Encapsule.io website
    contentBlock: {
        margin: '1em',
        backgroundColor: "rgba(256,256,256, 0.75)",
        border: '1px solid #DEF',
        borderRadius: '0.5em',
        padding: '1em'
    },

    // Styles to apply to DIV containing the copyright
    copyrightBlock: {
        borderTop: '1px solid #DDD',
        borderBottom: '1px solid #DDD',
        boxShadow: '0px 0.5em 1em 0px #FFF inset',
        backgroundColor: 'rgba(240,240,240,0.5)',
        padding: '0.5em',
        paddingLeft: '1.5em',
        paddingRight: '2em',
        color: '#999',
        textShadow: '1px 1px 0px white',
        fontSize: '10pt',
        fontFamily: "'Montserrat', sans-serif",
    },

    copyrightBlockClock: {
        fontFamily: "'Share Tech Mono', monospace",
    },

    snapBugBlock: {
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '10pt',
        color: '#AAA',
        paddingRight: '1em',
        marginTop: '2em',
        marginBottom: '2em',
        textAlign: 'center',
        cursor: 'help'
    },
    snapBugLink: {
        textDecoration: 'none',
        color: '#999'
    },


    // ----------------------------------------------------------------
    // MOVE HOLISTIC STYLES BELOW THIS LINE AS THEY'RE VERIFIED IN USE


    sessionWidgetBlock: {
        borderTop: '1px solid #DDD',
        borderBottom: '1px solid #DDD',
        boxShadow: '0px 0.25em 0.5em 0px #FFF inset',
        backgroundColor: 'rgba(238,238,238,0.5)',
        padding: '0.05em',
        paddingLeft: '0.5em',
        fontSize: '24pt'
    },

    sessionWidgetTitleBlock: {
        display: 'inline-block',
        color: '#777'
    },

    sessionWidgetTitleOrgIcon: {
        marginTop: '0.25em',
        marginBottom: '0.25em',
        width: '32px',
        height: '32px',
        cursor: 'pointer',
        verticalAlign: 'middle'
    },

    sessionWidgetTitle: {
        fontFamily: "'Play', sans-serif",
        fontWeight: 'normal',
        fontSize: '22pt',
        color: '#3771C8',
        textShadow: '1px 1px 0px white',
        verticalAlign: 'middle'
    },

    sessionWidgetButtonsBlock: {
        position: 'absolute',
        right: '-0px',
        display: 'inline-block',
        marginRight: '1em',
        marginTop: '0.7em',
        fontSize: '14pt'
    },

    // Styles applied to DIV enclosing entire HTML form.
    holisticFormBlock: {
        border: '1px solid #CCC',
        borderRadius: '0.5em',
        padding: '0.5em',
        backgroundColor: '#CDF',
        boxShadow: '1px 1px 1em #679 inset'
    },

    // Styles applied to DIV enclosing each HTML form input.
    holisticFormInputBlock: {
        border: '1px solid #CCC',
        borderRadius: '0.5em',
        padding: '0.5em',
        backgroundColor: '#DEF'
    },

    // Styles applied to DIV enclosing a form's submit button.
    holisticFormSubmitBlock: {
        marginTop: '1em',
        marginBottom: '1em',
        marginRight: '0.75em',
        textAlign: 'right'
    },


    header1: {
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 'bold',
        color: '#214478',
        fontSize: '24pt',
        verticalAlign: 'middle'
    },

    header2: {
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 'bold',
        color: '#2C5AA0',
        fontSize: '22pt',
        verticalAlign: 'middle'
    },

    header3: {
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 'bold',
        color: '#3771C8',
        fontSize: '20pt',
        verticalAlign: 'middle'
    },

    header4: {
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 'bold',
        color: '#5F8DD3',
        fontSize: '18pt',
        verticalAlign: 'middle'
    },

    header5: {
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 'bold',
        color: '#87AADE',
        fontSize: '16pt',
        verticalAlign: 'middle'
    },

    header6: {
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 'bold',
        color: '#AFC6E9',
        fontSize: '14pt',
        verticalAlign: 'middle'
    },

    softwarePackageLinkHeaderBlock: {
    }

};
