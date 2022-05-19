// HolisticHTML5Service_Loader.jsx

const d2r2 = require("@encapsule/d2r2");
const React = require("react");
const color = require("color");

const factoryResponse = d2r2.ComponentFactory.request({
    id: "jrxl_rGcQvKRCc0PpWqbtg",
    name: "HolisticHTML5Service_Loader",
    description: "Used to server render a generic HolisticHTML5Service loading page and perform dynamic updates during HolisticHTML5Service boot in the browser tab prior to dispatch of the service kernel's start lifecycle action.",

    renderDataBindingSpec: {
        ____types: "jsObject",
        HolisticHTML5Service_Loader: {
            ____types: "jsObject",
            authenticated: {
                ____types: "jsBoolean",
                ____defaultValue: false
            },
            appStarted: {
                ____accept: "jsBoolean",
                ____defaultValue: false // false when rendered on the server. set to true when the HTML5 service kernel re-activates the display process in the browser tab
            },
            appBuild: {
                ____accept: "jsObject"
            },
            deploymentEnvironment: {
                ____accept: "jsString",
                ____inValueSet: [ "development", "test", "staging", "production" ]
            }
        }
    },

    reactComponent: class HolisticHTML5Service_Loader extends React.Component {
        render() {
            try {
                const messageBody = this.props.renderData.HolisticHTML5Service_Loader;
                let key = 0;
                function makeKey() { return `HolisticHTML5Service_Loader${key++}`; }

                let content = [];
                let flexContent = [];

                const statusMessage = (this.props.renderContext.serverRender?"L O A D I N G":(!messageBody.appStarted?"S T A R T I N G":"W E L C O M E"));

                const backgroundColor = { development: "#CCCCCC", test: "#FFDDEE", staging: "#DDFFEE", production: "#BBDDFF" }[messageBody.deploymentEnvironment];

                const textColorMain = color(backgroundColor).darken(0.025).hex();
                const textColorMessage = "white";
                const textColorEnvironment = color(backgroundColor).darken(0.0125).hex();

                const textColorVersion = color(backgroundColor).darken(0.025).hex();
                const textColorVersionShadow = color(backgroundColor).darken(0.2).hex();

                // Application name...
                flexContent.push(<div key={makeKey()} style={{ fontFamily: "Play", fontSize: "8vw", fontWeight: "bold", color: textColorMain, paddingBottom: "1.3vw" }}>{messageBody.appBuild.app.name}</div>);

                // Application load status...
                flexContent.push(<div key={makeKey()} style={{ fontFamily: "Nunito", fontSize: "5vw", fontWeight: "bold", color: textColorMessage, textShadow: `0px 0px 1vw ${color(backgroundColor).darken(0.5).hex()}` }}>{statusMessage}</div>);

                // Application load spinner...
                if (this.props.renderContext.serverRender) {
                    flexContent.push(<div key={makeKey()} className="spinner-fast" />);
                } else {
                    if (!messageBody.appStarted) {
                        // This occurs when the HTML5 service kernel tells the display adapter cell to hydrate the server-rendered-via-React contents of the DOM via ReactDOM.hydrate API.
                        flexContent.push(<div key={makeKey()}>
                                         <div className="spinner-fast">
                                         <div className="spinner-fast">
                                         <div className="spinner-fast">
                                         <div className="spinner-fast"></div>
                                         </div>
                                         </div>
                                         </div>
                                         </div>
                                        );
                    } else {
                        // This occurs when the HTML5 service kernel tells the display adapter cell to render the now re-activated HTML5 service display process.
                        flexContent.push(<div key={makeKey()}>
                                         <div className="spinner-triple">
                                         <div className="spinner-triple">
                                         <div className="spinner-triple"></div>
                                         </div>
                                         </div>
                                         </div>
                                        );
                    }
                }


                // Application deployment environment...
                content.push(<div key={makeKey()} style={{ position: "fixed", top: "0px", left: "0px" }}>
                             <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" }}>
                                 <div style={{ fontFamily: "Play", fontSize: "6vw", color: textColorEnvironment }}><strong>{messageBody.deploymentEnvironment} environment</strong></div>
                             </div>
                             </div>
                            );

                // Application name / message / spinner black
                content.push(<div key={makeKey()} style={{ position: "fixed", top: "0px", left: "0px" }}>
                             <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" }}>{flexContent}</div>
                             </div>
                            );

                // Application version
                content.push(<div key={makeKey()} style={{ position: "fixed", top: "0px", left: "0px", zIndex: 1 }}>
                             <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", textAlign: "left", height: "100vh", width: "100vw" }}>
                             <div style={{ fontFamily: "Play", fontSize: "1.5vw", color: textColorVersion, paddingLeft: "1.5vw", paddingTop: "1.5vw", textShadow: `-1px -1px 2px ${textColorVersionShadow}` }}>
                             <strong>@{messageBody.appBuild.app.author}/{messageBody.appBuild.app.name} v{messageBody.appBuild.app.version}-{messageBody.appBuild.app.codename}</strong>&nbsp;&#x2BCE;&nbsp;{messageBody.appBuild.app.buildID}&nbsp;&#x2BCF;&nbsp;{messageBody.appBuild.app.buildSource}<br/>
                             <strong>@{messageBody.appBuild.platform.app.author}/{messageBody.appBuild.platform.app.name} v{messageBody.appBuild.platform.app.version}-{messageBody.appBuild.platform.app.codename}</strong>&nbsp;&#x2BCE;&nbsp;{messageBody.appBuild.platform.app.buildID}&nbsp;&#x2BCF;&nbsp;{messageBody.appBuild.platform.app.buildSource}<br/>
                             <strong>@{messageBody.appBuild.platform.data.author}/{messageBody.appBuild.platform.data.name} v{messageBody.appBuild.platform.data.version}-{messageBody.appBuild.platform.data.codename}</strong>&nbsp;&#x2BCE;&nbsp;{messageBody.appBuild.platform.data.buildID}&nbsp;&#x2BCF;&nbsp;{messageBody.appBuild.platform.data.buildSource}
                             </div>
                             </div>
                             </div>
                            );

                return (<div key={makeKey()} style={{ position: "fixed", top: "0px", left: "0px", width: "100%", height: "100%", backgroundColor }}>{content}</div>);

            } catch (exception_) {

                return (<div>Unhandled exception in HolisticHTML5Service_Loader React.Element: ${exception_.stack}</div>);

            } // end catch

        } // render

    } // PageView_LoadingApp extends React.Component

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

