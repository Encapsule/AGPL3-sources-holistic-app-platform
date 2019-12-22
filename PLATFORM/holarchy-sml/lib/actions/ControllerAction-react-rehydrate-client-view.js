"use strict";

// ControllerAction-react-rehydrate-client-view.js
var holarchy = require("@encapsule/holarchy");

var React = require("react");

var ReactDOM = require("react-dom");

module.exports = new holarchy.ControllerAction({
  id: "d2vRmtn2QA6Ox8W4PwDWNA",
  name: "React Client View Rehydrate",
  description: "Rehydrate server-rendered React view and connect UI event handlers.",
  actionRequestSpec: {
    ____types: "jsObject",
    holarchy: {
      ____types: "jsObject",
      sml: {
        ____types: "jsObject",
        actions: {
          ____types: "jsObject",
          react: {
            ____types: "jsObject",
            rehydrate: {
              ____types: "jsObject",
              pathComponentRouter: {
                ____label: "<ComponentRouter/> Path",
                ____description: "OCD path of the object namespace containing the <ComponentRouter/> instance to use to rehydrate the client view.",
                ____accept: "jsString",
                ____defaultValue: "#.ComponentRouter"
              },
              pathDOMElement: {
                ____label: "DOM Element Path",
                ____description: "OCD path of the object namespace containing the DOM element to use to rehydrate the client view.",
                ____accept: "jsString",
                ____defaultValue: "#.DOMElement"
              },
              pathDataContextPath: {
                ____label: "Data Context Path^2",
                ____description: "OCD path of the string namespace containing the OCD path of the object namespace to be passed through React via this.props.",
                ____accept: "jsString",
                ____defaultValue: "#.pathDataContext"
              },
              pathRenderDataPath: {
                ____label: "<ComponentRouter/> Render Data Path^2",
                ____description: "OCD path of the string namespace containing the OCD path of the object namespace to be passed to <ComponentRouter/> as renderData.",
                ____accept: "jsString",
                ____defaultValue: "#.pathRenderData"
              }
            }
          }
        }
      }
    }
  },
  actionResultSpec: {
    ____accept: "jsUndefined"
  },
  // no response.result
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      result: undefined
      /*no result*/

    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var message = request_.actionRequest.holarchy.sml.actions.react.rehydrate;
      var rpResponse = holarchy.ObservableControllerData.dataPathResolve({
        opmBindingPath: request_.context.opmBindingPath,
        dataPath: message.pathComponentRouter
      });

      if (rpResponse.error) {
        errors.push(rpResponse.error);
        break;
      }

      var pathComponentRouter = rpResponse.result;
      var ocdResponse = request_.context.ocdi.readNamespace(pathComponentRouter);

      if (ocdResponse.error) {
        errors.push(ocdResponse.error);
        break;
      }

      var ComponentRouter = ocdResponse.result;
      rpResponse = holarchy.ObservableControllerData.dataPathResolve({
        opmBindingPath: request_.context.opmBindingPath,
        dataPath: message.pathDOMElement
      });

      if (rpResponse.error) {
        errors.push(rpResponse.error);
        break;
      }

      var pathDOMElement = rpResponse.result;
      ocdResponse = request_.context.ocdi.readNamespace(pathDOMElement);

      if (ocdResponse.error) {
        errors.push(ocdResponse.error);
        break;
      }

      var DOMElement = ocdResponse.result;
      rpResponse = holarchy.ObservableControllerData.dataPathResolve({
        opmBindingPath: request_.context.opmBindingPath,
        dataPath: message.pathDataContextPath
      });

      if (rpResponse.error) {
        errors.push(rpResponse.error);
        break;
      }

      var pathDataContext = rpResponse.result;
      ocdResponse = request_.context.ocdi.readNamespace(pathDataContext);

      if (ocdResponse.error) {
        errors.push(ocdResponse.error);
        break;
      }

      var dataContext = ocdResponse.result; // TODO: This seems to presume renderData is embedded already?

      var d2r2Component = React.createElement(ComponentRouter, dataContext); // See: https://reactjs.org/docs/react-dom.html#hydrate

      ReactDOM.hydrate(d2r2Component, DOMElement, function () {
        // TODO: What should an external actor, in this case React, do if a transport error
        // occurs when calling opci.act? I think it's reasonable to provide some sort of centralized
        // error reporting of any and all act call failures. What's tricky is that we would like
        // action plug-ins to be able to provide custom error handling (i.e. possibly not report
        // or report in some custom way). And, we would like to be able to not worry about failures
        // in cases such as this example (in theory this _should_ never fail but) knowing that
        // they will be reported via a standardized mechanism and as such will not slip by unnoticed.
        var actResponse = request_.context.act({
          actorName: "React Rehydrate Completion Handler",
          actionDescription: "Signal completion of client application view rehydration via React.",
          actionRequest: {
            holarchy: {
              sml: {
                actions: {
                  ocd: {
                    setBooleanFlag: {
                      path: "#.rehydrated"
                    }
                  }
                }
              }
            }
          },
          opmBindingPath: request_.context.opmBindingPath
        }); // So for now I am going to throw an Error object.
        // - I want to know if this happens.
        // - I don't think it will happen.
        // - Buy some time to think this through

        if (actResponse.error) {
          console.error(actResponse.error);
          throw new Error(actResponse.error);
        }

        return;
      });
      break;
    }

    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  }
});
/*

// See: https://reactjs.org/docs/react-dom.html#hydrate
// This code path executes on client application first run only. Subsequently, ReactDOM.render
// must be used to update view via appStateContext.renderPageContent function.
console.log("> Re-hydrating the server-rendered React page view...");

let DataRoutableComponent = React.createElement(appStateContext.ComponentRouter, reactDataContext);
ReactDOM.hydrate(DataRoutableComponent, targetDomElement, function() {
    console.log("> Client view re-hydration complete.");
    console.log("> Client application boot complete.");
    console.log("> Client application is now interactive.");
    console.log("================================================================");
});

*/