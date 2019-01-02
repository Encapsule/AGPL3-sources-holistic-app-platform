// Horzmenuitex.jsx

const React = require('react');
const color = require('color');

// snapsite page context via this.props
// + this.props.targetRouteHash
// + this.props.selectedRouteHash

// New:
// this.props.targetViewURI
// this.props.selectedViewURI

// if selected route is the target route -> children unselected
// if selected route is neither the target nor descendent -> same as above
// if selected route is a descendent and it's a child -> children with select
// if selected route is a descendent but not a child -> children with active

const arccore = require('arccore');


// TODO: Move this awesome function, round, into arccore.util
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

module.exports = React.createClass({
    displayName: "HorizontalMenuItem",

    onMouseEnter: function() {
        // console.log("setting mouse over state");
        this.setMouseMode('over');
    },

    onMouseLeave: function() {
        // console.log("setting mouse out state");
        this.setMouseMode('out');
    },

    onClick: function(targetUrl_) {
        // console.log("setting mouse clicked state");
        this.setMouseMode('clicked');
        window.location = targetUrl_;
    },

    setMouseMode: function(mouseMode_) {
        this.props.appStateContext.viewActions.updateMenuState({
            mouseMode: mouseMode_,
            mouseTargetURI: this.props.targetViewURI
        });
    },

    render: function() {

        try {

            var content = [];

            var keyIndex = 0;
            var makeKey = function() { return ("hbi"+keyIndex++) };

            const viewStore = this.props.appStateContext.viewStore;
            const targetViewURI = this.props.targetViewURI;

            if (!viewStore.isVertex(targetViewURI)) {
                return (<div>HorizontalMenuItem invalid target view URI '{targetViewURI}'</div>);
            }

            // This is the URI of the menu item we're being asked to render. This resource is required to exist in the view store.
            var targetViewProperties = viewStore.getVertexProperty(targetViewURI);
            var tsiTarget = targetViewProperties.ts.i;
            var tsoTarget = targetViewProperties.ts.o;
            var tsdTarget = targetViewProperties.ts.d;
            var tswTarget = targetViewProperties.ts.w;

            // This is URI of the menu item that's currently selected. Note that this may not exist in the view store.
            var selectedViewURI = this.props.selectedViewURI;
            var selectedViewURITokens = selectedViewURI.split('/');
            var selectedViewURIForcedActive = false;

            while (!viewStore.isVertex(selectedViewURI)) {
                selectedViewURIForcedActive = true;
                selectedViewURITokens.pop();
                selectedViewURI = selectedViewURITokens.join('/');
                if (selectedViewURI.length === 0) {
                    selectedViewURI = '/';
                    break;
                }
            }

            var selectedViewProperties = viewStore.getVertexProperty(selectedViewURI);
            var tsiSelected = selectedViewURIForcedActive?(selectedViewProperties.ts.o):(selectedViewProperties.ts.i);
            var tsdSelected = selectedViewProperties.ts.d + 1;

            var mode;
            if ((tsiSelected < tsiTarget) || (tsoTarget < tsiSelected)) {
                mode = 'inactive';
            } else {
                if (tsiSelected === tsiTarget) {
                    mode = 'selected';
                } else {
                    mode = 'active';
                }
            }

            var baseStyles = {
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '12pt',
                fontWeight: 'normal',
                display: 'inline-block',
                margin: '0px',
                marginRight: '0.25em',
                marginLeft: '0.25em',
                paddingLeft: '0.5em',
                paddingRight: '0.5em',
                paddingTop: '0.1em',
                boxShadow: '1px 1px 2px 0px #DDD',
                textAlign: 'center',
                borderRadius: '0.25em',
                border: '1px solid #ABC',
                opacity: '1.0',
                verticalAlign: 'middle',
                cursor: (((mode === 'selected') && (targetViewURI === '/'))?'default':'pointer')
            };

            var buttonTextStyles = {
                textAlign: 'middle',
            };

            var buttonTextModePrefixStyles = {
                fontFamily: 'Courier, monospace',
                fontSize: '12pt'
            };

            const outOpacity = '1.0';
            const activeOutOpacity = '1.0'

            const hoverTextShadow = '1px 1px 1px #AAA';

            var activeBase = "#D7E3F4";
            // var activeBackgroundColor = color(activeBase).darken((tsdSelected - tsdTarget) * 0.0125).saturate((tsdSelected - tsdTarget) * 0.1).string();
            var activeBackgroundColor = color(activeBase).darken((tsdSelected - tsdTarget) * 0.015).rotate(tsdTarget * -5).saturate((tsdSelected - tsdTarget) * 0.1).string();

            var activeShadowInset = color(activeBackgroundColor).darken(0.25).string();
            var activeTextShadow = color(activeBackgroundColor).lighten(0.1).string();
            var activeTextColor = color(activeBackgroundColor).darken(0.7).string();

            var selectBackgroundColor = "#D7F4E3";
            var selectShadowInset = color(selectBackgroundColor).darken(0.5).string();
            var selectShadowInset2 = color(selectBackgroundColor).darken(0.25).saturate(-0.5).string();
            var selectTextShadow = color(selectBackgroundColor).lighten(0.25).string();
            var selectTextColor = '#124';

            const modeStyles = {
                inactive: {
                    out: {
                        color: '#07A',
                        backgroundColor: '#F0F0F0',
                        boxShadow: '0px 0.75em 0.5em 0px white inset',
                        opacity: outOpacity
                    },
                    over: {
                        color: '#069',
                        boxShadow: '0px 0.5em 0.5em 0px ' + selectBackgroundColor + ' inset',
                        backgroundColor: 'white',
                        border: '1px solid #666'
                    },
                    clicked: {
                        color: 'black',
                        backgroundColor: '#B0F4C0',
                        boxShadow: '0.1em 0.1em 0.125em 0em ' + selectShadowInset + ' inset',
                        border: '1px solid #666'
                    }
                },
                selected: {
                    out: {
                        backgroundColor: selectBackgroundColor,
                        boxShadow: '0.1em 0.1em 0.125em 0em ' + selectShadowInset + ' inset',
                        color: selectTextColor,
                        textShadow: '1px 1px 1px ' + selectTextShadow,
                    },
                    over: {
                        backgroundColor: '#FFF',
                        textShadow: hoverTextShadow
                    },
                    clicked: {
                        backgroundColor: 'white',
                        border: '1px solid #999',
                        boxShadow: '2px 2px 4px 0px #999'
                    }
                },
                active: {
                    out: {
                        opacity: activeOutOpacity,
                        backgroundColor: activeBackgroundColor,
                        boxShadow: '0.1em 0.1em 0.1em 0px ' + activeShadowInset + ' inset',
                        textShadow: '1px 1px 1px ' + activeTextShadow,
                        color: activeTextColor
                    },
                    over: {
                        color: selectTextColor,
                        boxShadow: '0px 0.5em 0.5em 0px ' + selectBackgroundColor + ' inset',
                        backgroundColor: 'white',
                        border: '1px solid #999'
                    },
                    clicked: {
                        color: 'black',
                        backgroundColor: '#B0F4C0',
                        boxShadow: '0.1em 0.1em 0.125em 0em ' + selectShadowInset + ' inset',
                        border: '1px solid #666'
                    }
                }
            };

            const collectionLinkTextPrefix = {
                inactive: {
                    out: "+",
                    over: '-',
                    clicked: '-'
                },
                selected: {
                    out: '-',
                    over: '+',
                    clicked: '+'
                },
                active: {
                    out: '-',
                    over: '-',
                    clicked: '-'
                }
            };


            var mouseMode = 'out';
            if (this.props.appStateContext.menuSubsystem.mouseMode !== 'out') {
                var mouseTargetURI = this.props.appStateContext.menuSubsystem.mouseTargetURI;
                var mouseOverTargetProps = viewStore.getVertexProperty(mouseTargetURI);
                if (tsiTarget === mouseOverTargetProps.ts.i) {
                    mouseMode = this.props.appStateContext.menuSubsystem.mouseMode;
                }
            }

            for (var name in modeStyles[mode][mouseMode]) {
                baseStyles[name] = modeStyles[mode][mouseMode][name];
            }

            var targetUrl;
            var targetTooltip;
            var linkText;
            var targetUrlStrategy = 'target';

            if (mode === 'selected') {
                if (viewStore.inDegree(targetViewURI)) {
                    targetUrlStrategy = 'parent';
                }
            }

            if (targetUrlStrategy === 'target') {
                targetUrl = targetViewURI;
                if (targetViewProperties.ts.w) {
                    targetTooltip = "Open \"" + targetViewProperties.tooltip + "\" (" + targetViewProperties.ts.w + " subpages)";
                } else {
                    targetTooltip = "Open \"" + targetViewProperties.tooltip + "\"";
                }
            } else {
                // TODO: Ensure targetUrlStrategy === 'parent'
                if (targetViewURI !== '/') {
                    var parentViewURI = viewStore.inEdges(targetViewURI)[0].u;
                    var parentViewProperties = viewStore.getVertexProperty(parentViewURI);
                    targetUrl = parentViewURI;
                    targetTooltip = "Close & open \"" + parentViewProperties.pageTitle + "...\"";
                } else {
                    targetUrl = null;
                    targetTooltip = "Welcome to " + targetViewProperties.pageTitle + "!"
                }
            }

            // Prefix (typically +/- for collections).
            if (!tswTarget) {
                linkText = (<div key={makeKey()}>
                            <span style={buttonTextStyles}>{targetViewProperties.name}</span>
                            </div>);
            } else {
                linkText = (<div key={makeKey()}>
                            <span style={buttonTextModePrefixStyles}>{collectionLinkTextPrefix[mode][mouseMode]}</span>
                            <span style={buttonTextStyles}>{targetViewProperties.name}</span>
                            </div>);
            }

            if (targetUrl) {
                var self = this;
                var clicker = function(event_) {
                    event_.preventDefault();
                    event_.stopPropagation();
                    self.onClick(targetUrl);
                };
                return (<div style={baseStyles} title={targetTooltip} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={clicker}>{linkText}</div>);
            } else {
                return (<div style={baseStyles}>{linkText}</div>);
            }

        } catch (exception_) {
            return (<div>Fatal exception in {this.className}: {exception_.toString()}</div>);
        }

    }
});


