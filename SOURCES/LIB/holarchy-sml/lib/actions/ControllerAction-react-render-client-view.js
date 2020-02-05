// ControllerAction-react-render-client-view.js

// TODO: Implement this today


const React = require("react");
const ReactDOM = require("react-dom");


// Get the DOM element selector of the DIV whose contents will be replaced/updated
// by client-side React render requests.
const targetDomElement = document.getElementById("idViewpath5Client");

// See: https://reactjs.org/docs/react-dom.html#render
appStateContext.renderPageContent = function() {
    let DataRoutableComponent = React.createElement(appStateContext.ComponentRouter, reactDataContext);
    ReactDOM.render(DataRoutableComponent, targetDomElement);
}

