"use strict";

// ObservableProcessModel-client-hash-route-location-processor.js
var opmClientHashRouteLocationProcessor = module.exports = {
  id: "-1Ptaq_zTUa8Gfv_3ODtDg",
  name: "Client Hash Route Location Processor",
  opmDataSpec: {
    ____label: "Client Hash Route Location Processor",
    ____types: "jsObject",
    ____defaultValue: {}
  },
  steps: {
    uninitialized: {
      description: "Default starting process step."
    },
    initialize: {
      description: "Registering hashchange DOM event callback.",
      actions: {
        enter: [{
          holarchy: {
            sml: {
              actions: {
                client: {
                  dom: {
                    event: {
                      hashchange: {
                        hook: true
                      }
                    }
                  }
                }
              }
            }
          }
        }]
      }
    }
  }
};