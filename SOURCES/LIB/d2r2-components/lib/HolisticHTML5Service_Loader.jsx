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

                const statusMessage = (this.props.renderContext.serverRender?"L O A D I N G":(!messageBody.appStarted?"S T A R T I N G":"W E L C O M E !"));

                const backgroundColor = { development: "dodgerblue", test: "turquoise", staging: "coral", production: "limegreen" }[messageBody.deploymentEnvironment];

                const textColorMain = color(backgroundColor).darken(0.25).hex();
                const textColorMessage = "white";
                const textColorEnvironment = color(backgroundColor).darken(0.125).hex();

                const textColorVersion = color(backgroundColor).lighten(0.2).hex();
                const textColorVersionShadow = color(backgroundColor).darken(0.2).hex();

                flexContent.push(<div key={makeKey()} style={{ fontFamily: "Play", fontSize: "4vw", fontWeight: "bold", paddingBottom: "0.25em", color: textColorMain }}>{messageBody.appBuild.app.name}</div>);
                flexContent.push(<div key={makeKey()} style={{ fontFamily: "Nunito", fontSize: "2.5vw", fontWeight: "bold", color: textColorMessage, paddingBottom: "1em", textShadow: `0px 0px 0.1vw ${color(backgroundColor).darken(0.7).hex()}` }}>{statusMessage}</div>);

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

                // Environment
                content.push(<div key={makeKey()} style={{ position: "fixed", top: "0px", left: "0px" }}>
                             <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", backgroundColor }}>
                                 <div style={{ fontFamily: "Play", fontSize: "6vw", color: textColorEnvironment }}><strong>{messageBody.deploymentEnvironment}</strong></div>
                             </div>
                             </div>
                            );

                // App name / message / spinner
                content.push(<div key={makeKey()} style={{ position: "fixed", top: "0px", left: "0px" }}>
                             <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" }}>{flexContent}</div>
                             </div>
                            );

                // App version
                content.push(<div key={makeKey()} style={{ position: "fixed", top: "0px", left: "0px" }}>
                             <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", height: "100vh", width: "100vw" }}>
                             <div style={{ fontFamily: "Play", fontSize: "1.25vw", color: textColorVersion, padding: "1vw", textShadow: `-1px -1px 1px ${textColorVersionShadow}` }}>@{messageBody.appBuild.app.author}/{messageBody.appBuild.app.name} v{messageBody.appBuild.app.version}-{messageBody.appBuild.app.codename}<br/>
                             {messageBody.appBuild.app.buildSource}<br/>
                             {messageBody.appBuild.app.buildID}
                             </div>
                             </div>
                             </div>
                            );

                // Platform version
                content.push(<div key={makeKey()} style={{ position: "fixed", top: "0px", left: "0px" }}>
                             <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end", height: "100vh", width: "100vw", textAlign: "right" }}>
                             <div style={{ fontFamily: "Play", fontSize: "1.25vw", color: textColorVersion, padding: "1vw", textShadow: `-1px -1px 1px ${textColorVersionShadow}` }}>@{messageBody.appBuild.platform.app.author}/{messageBody.appBuild.platform.app.name} v{messageBody.appBuild.platform.app.version}-{messageBody.appBuild.platform.app.codename}<br/>
                             {messageBody.appBuild.platform.app.buildSource}<br/>
                             {messageBody.appBuild.platform.app.buildID}
                             </div>
                             </div>
                             </div>
                            );


                return (<div key={makeKey()}>{content}</div>);

                // ================================================================
                // EXPERIMENTAL CODE (please keep).

               /* DISABLE FOR DEMO PURPOSES.
                if (messageBody.appStarted) {
                    content.push(<div key={makeKey()} style={{ position: "absolute", top: "0px", left: "0px", padding: "1em", fontFamily: "monospace", overflow: "auto", height: "auto", width: "100%", backgroundColor: "skyblue", zIndex: -1 }}>
                                 <h1>Hello, CellProcessor!</h1>
                                 <h2>Cell Process Manaager Query</h2>
                                 <pre style={{ width: "100%", height: "100%" }} >{JSON.stringify(this.props.renderContext.act({ actorName: "loadingApp", actionRequest: { CellProcessor: { cell: { query: {} } } } }), undefined, 4)}</pre>
                                 <h2>App Metadata Queries</h2>
                                 <pre style={{ width: "100%", height: "100%" }}>{JSON.stringify(this.props.renderContext.act({ actorName: "loadingApp", actionRequest: { holistic: { app: { metadata: { query: { type: "digraph" } } } } } }), undefined, 4)}</pre>

                                 </div>
                                );
                }
                /*

                /*

                  <div>S P I N N E R - E X A M P L E S</div>
                  <div>spinner <div class="spinner"></div> </div>
                  <div>spinner-dual <div class="spinner-dual"></div> </div>
                  <div>spinner-fast <div class="spinner-fast"></div> </div>
                  <div>spinner-tripple <div class="spinner-triple"></div> </div>

                  <div>spinner-spinner-spinner
                  <div class="spinner">
                  <div class="spinner">
                  <div class="spinner"></div>
                  </div>
                  </div>
                  </div>

                  <div>spinner-dual-spinner-dual
                  <div class="spinner-dual">
                  <div class="spinner-dual"></div>
                  </div>
                  </div>

                  <div>spinner-fast-fast-fast-fast
                  <div class="spinner-fast">
                  <div class="spinner-fast">
                  <div class="spinner-fast">
                  <div class="spinner-fast"></div>
                  </div>
                  </div>
                  </div>
                  </div>

                  <div>spinner-tripple-tripple-tripple
                  <div class="spinner-triple">
                  <div class="spinner-triple">
                  <div class="spinner-triple"></div>
                  </div>
                  </div>
                  </div>
                */

                /*

                  // This is just some silliness that we'll remove later.
                  const actResponse = this.props.renderContext.act({
                  actorName: "loadingApp",
                  actionRequest: { CellProcessor: { cell: { query: {} } } }
                  });

                  return (
                  <div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                      <div className="loaderRocket"></div>
                    </div>
                    <div style={{ position: "absolute", top: "0px", left: "0px", margin: "0px", padding: "16px" }}>
                      <h1>Blah blah</h1>
                      <p>Blah blah. Blah blah blah blah..</p>
                      <pre>{JSON.stringify(actResponse, undefined, 4)}</pre>
                    </div>
                  </div>
                  );

                */


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

