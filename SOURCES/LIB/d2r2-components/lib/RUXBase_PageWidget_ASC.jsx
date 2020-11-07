// sources/common/view/elements/component/RUXBase_PageWidget_ASC.jsx

const arccore = require('@encapsule/arccore');
const React = require('react');
const reactComponentBindingFilterFactory = require('./binding-factory');

const knownStateColors = {

    uninitialized: 'rgba(0,0,0,0.3)',
    initializing: '#0CF', // preparing for use
    idle: '#09C', // waiting on request
    initialized: '#0A0', // prepared for use
    ready: '#0D0', // data availble
    reset: '#999', // data invalidated
    waiting: '#CCC', // blocked on external signal and/or internal state transition
    running: '#FF0', // in progress
    working: '#FF0', // in progress
    evaluating: '#F90', // processing response
    error: '#F00', // error

    // special cases
    'ready-to-submit': '#0FF',
    submitted: '#0CC',

    edited: '#0CC',
    locked: '#099',

    'wait-advertiser': '#F90', // RainierBaseController:wait-advertiser

};

var SubcontrollerStateBox = React.createClass({
    displayName: "RUXBase_PageWidget_ASCStateBox",
    render: function() {
        // Lookup known state -> color map entry
        var rgba = knownStateColors[this.props.subcontrollerState];
        // Synthesize a stable color derived from the state name for everything else.
        if (!rgba) {
            const hash = arccore.identifier.hash.fromUTF8((this.props.subcontrollerState + this.props.irutSeed));
            rgba = 'rgb(' + (hash & 0xFF) + ',' + ((hash & 0xFF00) >> 8) + ',' + ((hash & 0xFF0000) >> 16) + ')';
        }
        var styles = arccore.util.clone(this.props.themeStyles);
        styles.backgroundColor = rgba;
        return(<div style={styles} title={this.props.subcontrollerName + ":" + this.props.subcontrollerState}/>);
    }
});

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "UkmA_dcVTnqkmVvLgB6HGg",
    name: "RUXBase_PageWidget_ASC",
    description: "Displays a row of squares filled with background color that depends on app state controller subcontroller states.",

    renderDataBindingSpec: {
        ____types: "jsObject",
        // Currently, just a routing signature - this component renders information from the private state of the app state controller client subsystem.
        RUXBase_PageWidget_ASC: {
            ____label: "ASC Widget Request",
            ____types: "jsObject"
        }
    },
    reactComponent: React.createClass({
        displayName: "RUXBase_PageWidget_ASC",

        getInitialState: function() {
            return ({
                irutSeed: 'PHIowP2nTVeWkt-9zwmDWg'
            });
        },

        onClickScrambleColorBase: function(event_) {
            if (event_.detail === 3)
                this.setState({ irutSeed: arccore.identifier.irut.fromEther() });
        },

        render: function() {
            try {
                // var ComponentRouter = this.props.appStateContext.reactComponentRouter;
                const metadata = this.props.document.metadata;
                const theme = metadata.site.theme;
                var widgetTheme = theme.base.RUXBase_PageWidget_ASC;

                const renderData = this.props.renderData['RUXBase_PageWidget_ASC'];
                var keyIndex = 0;
                function makeKey() { return ("RUXBase_PageWidget_ASC" + keyIndex++); }
                var content = [];

                // This component will be rendered before the app state controller is initialized.
                // If this is the case, display the loading message instead of the subcontroller state indicators.

                if (!this.props.appStateContext.appStateController) {
                    content.push(<div key={makeKey()} style={widgetTheme.loadingTextContainer}>Initializing. One moment please...</div>);
                } else {
                    const appStateControllerMap = this.props.appStateContext.appStateController.controllerMap;
                    for (var subcontrollerName in appStateControllerMap) {
                        const subcontrollerStateDescriptor = appStateControllerMap[subcontrollerName];
                        content.push(<SubcontrollerStateBox key={makeKey()} subcontrollerName={subcontrollerName}
                        subcontrollerState={subcontrollerStateDescriptor.state} irutSeed={this.state.irutSeed}
                        themeStyles={theme.base.RUXBase_PageWidget_ASC.stateBoxContainer} />);
                    }
                }

                return (<div style={widgetTheme.container} onClick={this.onClickScrambleColorBase}>{content}</div>);

            } catch (exception_) {
                return (<div>RUXBase_PageWidget_ASC exception: {exception_.toString()}</div>);
            }
        }
    })
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
