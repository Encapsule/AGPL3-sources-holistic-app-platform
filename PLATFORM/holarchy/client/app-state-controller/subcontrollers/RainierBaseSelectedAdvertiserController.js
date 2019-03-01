"use strict";

// sources/client/app-state-controller/subcontrollers/RainierBaseSelectedAdvertiserController.js
module.exports = {
  name: "RainierBaseSelectedAdvertiserController",
  description: "Tracks the initialization and update status of the selected advertiser account value used by the rainier-ux-base runtime (and derived UX application).",
  stateNamespace: "~.base.RainierBaseController.selectedAdvertiser.state",
  states: [{
    name: "uninitialized",
    description: "Reserved initial state name.",
    transitions: [{
      nextState: "waiting",
      operator: {
        always: true
      }
    }]
  }, {
    name: "waiting",
    description: "Waiting for the selected advertiser data value to be initialized.",
    transitions: [{
      nextState: "ready",
      operator: {
        exists: "~.base.RainierBaseController.selectedAdvertiser.pcode"
      }
    }]
  }, {
    name: "ready",
    description: "The selected advertiser value has been set.",
    actions: {
      enter: [{
        copy: {
          a: "~.base.RainierBaseController.selectedAdvertiser.pcode",
          b: "~.base.RainierBaseController.selectedAdvertiser.pcodeLast"
        }
      }],
      exit: [{
        copy: {
          a: "~.base.RainierBaseController.selectedAdvertiser.pcode",
          b: "~.base.RainierBaseController.selectedAdvertiser.pcodeLast"
        }
      }]
    },
    transitions: [{
      nextState: "updating",
      operator: {
        and: [{
          or: [{
            inState: "RainierBaseController:ready"
          }, {
            inState: "RainierBaseController:error"
          }]
        }, {
          not: {
            equal: {
              a: "~.base.RainierBaseController.selectedAdvertiser.pcode",
              b: "~.base.RainierBaseController.selectedAdvertiser.pcodeLast"
            }
          }
        }]
      }
    }]
  }, {
    // Other subcontrollers whose data derives from the selected advertiser should monitor this
    // controller for transitions into updating state. When this occurs `pcode` is set to a
    // a new value, `pcodeLast` is the previous advertiser selection, and other subcontrollers
    // should (typically) invalidate or re-initialize their data accordingly to align with the
    // newly selected advertiser.
    name: "updating",
    description: "The selected advertiser value is being updated. Derived data is now invalid.",
    transitions: [{
      nextState: "ready",
      operator: {
        always: true
      }
    }]
  }, {
    name: "error",
    description: "Controller fatal error."
  }]
};