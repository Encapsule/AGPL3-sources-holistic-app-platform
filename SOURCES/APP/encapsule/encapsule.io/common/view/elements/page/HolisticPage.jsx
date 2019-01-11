// HolisticPage.jsx

const React = require('react');

const HolisticPageHeader = require('./HolisticPageHeader.jsx');
const HolisticBreadcrumbs = require('./HolisticBreadcrumbs.jsx');
const HolisticHorizontalMenuBar = require('./HolisticHorizontalMenuBar.jsx');
const HolisticCopyright = require('./HolisticCopyright.jsx');
const HolisticPoweredByFooter = require('./HolisticPoweredByFooter.jsx');

const contentDataRouter = require('../content-router/');

module.exports = class HolisticPage extends React.Component { 

    constructor(props_) {
        super(props_);
        // Dereference document metadata which is extracted from the view store model
        // that is prescriptively extracted from the view store model by Encapsule/holism.
        const metadata = this.props.document.metadata;

        // Dereference the view store as we need to be able to look around and find out where we are
        // in order to determine which and how many menus to display for this page.
        var viewStore = this.props.appStateContext.viewStore;

        // Determine the maximum number of horizontal menu bars that may be displayed for this page.
        var maxMenuBars = metadata.page.ts.d; // depth of the page in the site (root page is depth zero)

        // Display the <HolisticBreadcrumbs/> component iff this page is at or deeper than level two.
        var displayBreadcrumbs = metadata.page.ts.d >= 2;

        // Determine if the current page is "lone leaf" page with no siblings
        var loneLeaf = false;
        if (!metadata.page.children.length) {

            // TODO: ****** APP STATE ******
            // We are moving towards a single namespacing conventions for both
            // server and client app state. This is just a temporary patch while
            // I refactor the server-side code. Client side is refactored.

            // Find the closest parent for which there is metadata in the view store
            // and base menu calculates on that page's URI instead of the current URI
            // which is an error 404 diplay.
            var currentViewURI = metadata.page.uri;
            var currentViewURITokens = currentViewURI.split('/');
            while (!viewStore.isVertex(currentViewURI)) {
                currentViewURITokens.pop();
                currentViewURI = currentViewURITokens.join('/');
                // Worst case use the root page
                if (currentViewURI.length === 0) {
                    currentViewURI = '/';
                    break;
                }
            }

            var parentViewURI = viewStore.inEdges(currentViewURI)[0].u;
            var parentPageMetadata = viewStore.getVertexProperty(parentViewURI);
            if (!parentPageMetadata || (parentPageMetadata.children.length === 1))
                loneLeaf = true;
        }

        var defaultMenuBars = 0;
        switch (maxMenuBars) {
        case 0:
            // root page view
            defaultMenuBars = 0; // we'll pick up home + children automatically
            break;
        case 1:
            defaultMenuBars = 1;
            break;
        default:
            if (loneLeaf) {
                defaultMenuBars = 0;
            } else {
                if (metadata.page.children.length) {
                    defaultMenuBars = Math.max(0, metadata.page.view_options.default_menubars_count -1); // defaults to 0
                } else {
                    defaultMenuBars = Math.min(maxMenuBars, metadata.page.view_options.default_menubars_count); // defaults to 1
                }
            }
            break;
        }
        this.state = {
            displayBreadcrumbs: displayBreadcrumbs,
            loneLeaf: loneLeaf,
            menuBarState: 'default',
            maxMenuBarDepth: maxMenuBars,
            defaultMenuBars: defaultMenuBars,
            exposedMenuBars: defaultMenuBars,
            stepDelayMs: 10, // menu bar timer
            watermarkOpacity: 0.15 // initial opacity
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.toggleMenuBars = this.toggleMenuBars.bind(this);
    } // end constructor

    componentDidMount() {
        var self = this;
        function timerService() {
            var state = self.state;
            state.watermarkOpacity = state.watermarkOpacity - 0.0025;
            self.setState(state);
        }
        var timer = setInterval(function() {
            if (self.state.watermarkOpacity <= 0.025)
                clearInterval(timer);
            else
                timerService();
        }, 25);
    }

    toggleMenuBars(event_) {

        if (this.props.document.metadata.page.uri === '/') {
            console.log("Home menus are fixed.");
            return;
        }

        var self = this;
        var state = self.state;

        var delta = 0;
        var limit = 0;
        var completeState = null;

        switch (state.menuBarState) {
        case 'default':
            delta = 1;
            limit = state.maxMenuBarDepth;
            completeState = "exposed";
            state.menuBarState = "transitionDefaultToExposed";
            console.log("menubar starting transition from default to exposed...");
            break;
        case 'exposed':
            delta = -1;
            limit = state.defaultMenuBars;
            completeState = 'default';
            state.menuBarState = 'transitionExposedToDefaultHidden';
            console.log("menubar starting transition from exposed to default...");
            break;
        default:
            event_.preventDefault();
            return;
        }

        self.setState(state);

        var transitionComplete = false;

        function timerService() {
            var state = self.state;
            if (state.exposedMenuBars !== limit) {
                state.exposedMenuBars += delta;
                console.log("menubar " + delta + " now at " + state.exposedMenuBars);
            } else {
                // state.menuBarState = completeState;
                transitionComplete = true;
                console.log("menubars now " + completeState + ". Transition complete.");
            }
            self.setState(state);
        }

        timerService();

        if (state.menuBarState === completeState)
            return;

        var timer = setInterval(function() {
            state = self.state;
            if (!transitionComplete) {
                timerService();
            } else {
                clearInterval(timer);
                state.menuBarState = completeState;
                self.setState(state);
                console.log("cleared timer interval");
            }
        }, state.stepDelayMs);
        event_.preventDefault();

    }

    render() {

        try {

            var keyIndex = 0;
            var keyBase = "HolisticPage";
            var makeKey = function() { return (keyBase + keyIndex++); };

            // Dereference the view store.
            // TODO: ****** APP STATE ***** Fix this
            var viewStore = this.props.appStateContext.viewStore;

            // Deference the theme data.
            var theme = this.props.document.metadata.site.theme;

            // Dereference this component's self-managed state properties.
            var state = this.state;

            var content = [];
            var navigator = [];

            // SESSION WIDGET
            navigator.push(<HolisticPageHeader {...this.props} key={makeKey()} />);

            // BREADCRUMBS
            if (this.state.displayBreadcrumbs) {
                navigator.push(<HolisticBreadcrumbs {...this.props} key={makeKey()} toggleMenuBars={this.toggleMenuBars} />);
            }

            // HORIZONTAL MENU BAR(S)
            var hmenu = []
            var menuRowsToRender = state.exposedMenuBars;
            var selectedViewURI = this.props.document.metadata.page.uri;
            var currentViewURI = selectedViewURI;
            var currentViewURITokens = selectedViewURI.split('/');
            while (!viewStore.isVertex(currentViewURI)) {
                currentViewURITokens.pop();
                currentViewURI = currentViewURITokens.join('/');
                if (currentViewURI.length === 0) {
                    currentViewURI = '/';
                    break;
                }
                // console.log("Searching next to " + currentViewURI);
            } // end while
            // console.log("current view URI '" + currentViewURI + "'");

            if (this.props.document.metadata.page.children.length) {
                hmenu.unshift(<HolisticHorizontalMenuBar
                              {...this.props}
                              parentViewURI={currentViewURI}
                              selectedViewURI={selectedViewURI}
                              key={makeKey()}/>
                             );
            }

            while (menuRowsToRender) {
                var parentViewURI = viewStore.inEdges(currentViewURI)[0].u;
                hmenu.unshift(<HolisticHorizontalMenuBar
                              {...this.props}
                              parentViewURI={parentViewURI}
                              selectedViewURI={selectedViewURI}
                              key={makeKey()} />
                             );
                currentViewURI = parentViewURI;
                menuRowsToRender--;
            }

            hmenu.forEach(function(menuBar_) {
                navigator.push(menuBar_);
            });

            // TODO: Move this into the theme!
            var xx = { borderTop: '0.5em solid #F7F7F7', borderBottom: '0.5em solid #F7F7F7' , boxShadow: "0px 0.2em 1em 0px #CCC" };
            content.push(<div style={xx} key={makeKey()}>{navigator}</div>);

            // Re-initialize to the current page's view URI.
            currentViewURI = this.props.document.metadata.page.uri;

            // ----------------------------------------------------------------------
            // PAGE CONTENT
            // ----------------------------------------------------------------------

            // TODO: Move this into the theme!
            var hackStyles = {
                margin: '1em',
                padding: '1em',
                borderRadius: '0.5em',
                border: '1px solid #ABC',
                backgroundColor: '#DEF'
            }

            // Call the "content router" - an ARCcore.disciminator filter that routes its request data to 1 of N
            // ARCcore.filter objects. Each ARCcore.filter is an "ingress" filter that accepts a specific format
            // of this.props.document.data and then delegates to the React component responsible for rendering
            // that content type to HTML. ARCcore.discriminator internally uses a graph coloring algorithm to
            // deduce the minimum number of empircal checks required to "discriminate" between N different possible
            // allowed formats for this.props.document.data corresponding to the "content types" we have defined.
            // Currently, we're just using this to select the top level content rederer. Later this same concept
            // will be applied to affect fully-dynamic data-driven layout. We need this so that the HTML views
            // can be composed by simply changing the format of the data returned to the server/client HTML
            // rendering subsystem eliminating the need to manually maintain each specific rendering call tree.
            // In slightly more detail, React components render what they're able of this.props and then delegate
            // to subcomponents to continue the render. Typically, the rules for determining how to delegate
            // are hard-coded in the implementation of React components meaning that any changes to data format,
            // or to the set of possible React subcomponents must be reflected in the implementation of any
            // component that might conceivably need to delegate to it. This is a problem. With this scheme,
            // a component can be written to simply delegate to the the "content router" what it does not know
            // how to render and all the message parsing rules, and delegation logic can be maintained in one
            // place that's simple to maintain (very little code, highly automated, no test suite that needs
            // to be dragged along...

            var routerResponse = contentDataRouter.request({
                reactContext: this.props,
                documentData: this.props.document.data
            });

            if (!routerResponse.error) {
                content.push(<div id="idHolisticPageContentBlock" key={makeKey()} style={theme.contentBlock}>{routerResponse.result}</div>);
            } else {
                var contentRenderErrorStyles = {
                    border: '0.25em solid red',
                    borderRadius: '0.5em',
                    padding: '1em'
                };
                content.push(<div id="idHolisticPageContentBlock" key={makeKey()} style={theme.contentBlock} >
                             <h1>"{this.props.document.metadata.page.name}" Page <strong>React Render Fail</strong></h1>
                             <p>Well... A lot has gone right for you to get far enough to see this error message but you are not quite finished yet.</p>
                             <p>The HTML rendering subsystem has received a message to render some in-memory data as HTML that it cannot parse!</p>
                             <h3>Content Router Error</h3>
                             <code>{JSON.stringify(routerResponse)}</code>
                             <h3>this.props</h3>
                             <pre>{JSON.stringify(this.props, undefined, 2)}</pre>
                             </div>);
            }


            // COPYRIGHT
            content.push(<HolisticCopyright {...this.props} key={makeKey()} style={theme.copyrightBlock} />);

            // DEVBUG
            content.push(<HolisticPoweredByFooter {...this.props} key={makeKey()} />);

            // WATERMARK
            const watermarkStyles = {
                position: "fixed",
                top: "0px", bottom: "0px", left: "0px", right: "0px",
                margin: "auto",
                maxHeight: "100vw",
                maxWidth: "100vw",
                width: "100vw",
                height: "100vw",
                zIndex: -2
            };
            const watermarkImageStyles = {
                width: "100%",
                height: "100%",
                opacity: this.state.watermarkOpacity
            };
            content.push(<div id="idHolisticPageBackground" key={makeKey()} style={watermarkStyles}>
                         <img src={this.props.document.metadata.page.icons.svg} style={watermarkImageStyles} />
                         </div>);

            // WORK IN PROGRESS
            // CSS sucks
            const wipContainerStyles = {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                zIndex: -1,
            };
            const wipTextStyles = {
                fontFamily: "Play",
                fontSize: '64pt',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#214478',
                opacity: this.state.watermarkOpacity - 0.02
            };


            content.push(<div id="idHolisticPageWorkInProgress" key={makeKey()} style={wipContainerStyles}>
                         <div style={wipTextStyles}>Documents Under Contruction</div>
                         </div>);



            // Return the compiled page.
            return (<div id="idHolisiticPage" style={theme.page}>{content}</div>);

        } catch (exception_) {
            return (<div>Fatal exception in {this.className}: {exception_.toString()}</div>);
        }
    }

} // end class HolisticPage


