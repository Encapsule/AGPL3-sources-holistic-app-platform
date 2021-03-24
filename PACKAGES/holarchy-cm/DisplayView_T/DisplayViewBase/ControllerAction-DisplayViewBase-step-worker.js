"use strict";

// DisplayView_T/DisplayViewBase/ControllerAction-DisplayViewBase-step-worker.js
(function () {
  var holarchy = require("@encapsule/holarchy");

  var cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");

  var cmLabel = require("./cell-label");

  var actionLabel = "stepWorker";
  var actionName = "".concat(cmLabel, " Private Step Worker");

  var lib = require("./lib");

  var action = new holarchy.ControllerAction({
    id: cmasHolarchyCMPackage.mapLabels({
      CM: cmLabel,
      ACT: actionLabel
    }).result.ACTID,
    name: actionName,
    description: "Implementation worker action for the DisplayViewBase CellModel.",
    actionRequestSpec: {
      ____types: "jsObject",
      holarchy: {
        ____types: "jsObject",
        common: {
          ____types: "jsObject",
          actions: {
            ____types: "jsObject",
            DisplayViewBase: {
              ____types: "jsObject",
              _private: {
                ____types: "jsObject",
                stepWorker: {
                  ____types: "jsObject",
                  action: {
                    ____types: "jsString",
                    ____inValueSet: ["noop", "initialize", "link-unlinked-view-displays"]
                  }
                }
              }
            }
          }
        }
      }
    },
    actionResultSpec: {
      ____accept: "jsString",
      ____defaultValue: "okay"
    },
    bodyFunction: function bodyFunction(request_) {
      var response = {
        error: null
      };
      var errors = [];
      var inBreakScope = false;

      while (!inBreakScope) {
        inBreakScope = true;
        var libResponse = lib.getStatus.request(request_.context);

        if (libResponse.error) {
          errors.push(libResponse.error);
          break;
        }

        var cellMemory = libResponse.result.cellMemory;
        var messageBody = request_.actionRequest.holarchy.common.actions.DisplayViewBase._private.stepWorker;
        var actResponse = void 0,
            ocdResponse = void 0;

        switch (messageBody.action) {
          case "noop":
            break;

          case "initialize":
            actResponse = request_.context.act({
              actorName: actionName,
              actorTaskDescription: "Attempting to write the initial output of this display view cell to our specialized ObservableValue cell...",
              actionRequest: {
                holarchy: {
                  common: {
                    actions: {
                      ObservableValue: {
                        writeValue: {
                          value: {
                            renderContext: {
                              apmBindingPath: request_.context.apmBindingPath,
                              displayPath: "👁"
                            },
                            // set
                            renderData: {} // reset to default values

                          },
                          path: "#.outputs.displayView"
                        }
                      }
                    }
                  }
                }
              },
              apmBindingPath: request_.context.apmBindingPath
            });

            if (actResponse.error) {
              errors.push(actResponse.error);
              break;
            }

            break;

          case "link-unlinked-view-displays":
            // Okay, so... We have ourselves (as in this cell) had our d2r2 ObservableValue_T read by someone
            // resulting in some or another "ViewDisplay" process (actually a mounted React.Element in the React-
            // managed VDOM) that has decided for whatever reason to inject an unlinked ViewDisplayProcess-derived
            // React.Element into the VDOM render tree. Here we resolve (link) these unlinked DisplayView processes
            // by walking the displayPath tree, creating new ObservableValueHelper entries in our ObservableValueHelperMap,
            // and in cases where the queued link requests are below our own immediate children (in the OVH map) we will
            // adjust and merely re-queue the request on the children (so that the process resolves via recursion through
            // the cells working in coordination w/their ViewDisplay processes and w/each other to re-stablilize the cell
            // plane w/all DisplayView_T family members in their quiescent process step.
            cellMemory.core.dynamicViewDisplayQueue.sort(function (a_, b_) {
              return a_.reactElement.displayPath > b_.reactElement.displayPath ? 1 : -1;
            });
            var lastChildProcessed = null;

            while (cellMemory.core.dynamicViewDisplayQueue.length) {
              var deferredViewDisplayLinkRequest = cellMemory.core.dynamicViewDisplayQueue.shift();
              cellMemory.core.pendingViewDisplayQueue.push(deferredViewDisplayLinkRequest);
              var ourDisplayPathTokens = cellMemory.core.viewDisplayProcess.displayPath.split(".");
              var linkRequestDisplayPathTokens = deferredViewDisplayLinkRequest.reactElement.displayPath.split(".");

              if (linkRequestDisplayPathTokens.length === ourDisplayPathTokens.length + 1) {
                // The unlinked ViewDisplay process will be registered in this DisplayView cell's #.inputs.subDisplayViews ObservableValueHelperMap.
                lastChildProcessed = deferredViewDisplayLinkRequest;
                var names = {};
                names[deferredViewDisplayLinkRequest.reactElement.displayInstance] = {
                  observableValue: {
                    processCoordinates: {
                      apmID: deferredViewDisplayLinkRequest.reactElement.displayViewAPMID,
                      instanceName: deferredViewDisplayLinkRequest.reactElement.displayPath
                    },
                    path: "#.outputs.displayView"
                  }
                }; // This will create a new ObservableValueHelper in our ObservableValueHelperMap (itself a helper cell)
                // and link it to the ObservableValue_T family cell specified by processCoordinates.

                actResponse = request_.context.act({
                  actorName: actionName,
                  actorTaskDescription: "Attempting to add a new ObservableValueHelper entry to our ObservableValueHelperMap helper cell...",
                  actionRequest: {
                    holarchy: {
                      common: {
                        actions: {
                          ObservableValueHelperMap: {
                            addValues: {
                              path: "#.inputs.subDisplayViews",
                              names: names
                              /*synthesized above*/

                            }
                          }
                        }
                      }
                    }
                  },
                  apmBindingPath: request_.context.apmBindingPath
                });

                if (actResponse.error) {
                  errors.push(actResponse.error);
                  break;
                } // Okay, we're done for now.


                console.log(actResponse.result);
              } else {
                // We think this is a deferred ViewDisplay process link request that needs to be resolved by one of our subDisplayViews; not by this cell.
                // So we pass the deferred link request on to the appropriate child which because of our sort, is captured in lastChildProcessed currently.
                if (!deferredViewDisplayLinkRequest.reactElement.displayPath.startsWith(cellMemory.core.viewDisplayProcess.displayPath)) {
                  errors.push("INTERNAL ERROR: We expected the sub ViewDisplay link request to be a descendant of one of this DisplayView cell's direct sub DisplayView. This should not happen!");
                  break;
                }
              }
            }

            ocdResponse = request_.context.ocdi.writeNamespace({
              apmBindingPath: request_.context.apmBindingPath,
              dataPath: "#.core"
            }, cellMemory.core);

            if (ocdResponse.error) {
              errors.push(ocdResponse.result);
              break;
            }

            break;

          default:
            errors.push("ERROR: Unhandled action value \"".concat(messageBody.action, "\"."));
            break;
        } // end switch


        break;
      }

      if (errors.length) {
        response.error = errors.join(" ");
      }

      return response;
    }
  });

  if (!action.isValid()) {
    throw new Error(action.toJSON());
  }

  module.exports = action;
})();