"use strict";

// sources/common/filter-specs/rainier-data-store/index.js
//
// Because we re-use this list quite a lot.
// const networkControllerStates = [ "uninitialized", "waiting", "idle", "working", "evaluate", "ready", "reset", "error" ];
module.exports = {
  ____types: "jsObject",
  ____defaultValue: {},
  holisticApplicationData_2k6VQsiuSb2ghMX6Wt1eKQ: {
    ____label: "Holistic Application State Model",
    ____description: "Shared application data and shared state model for an application derived from @encapsule/holistic runtime libraries.",
    ____types: "jsObject",
    ____defaultValue: {},
    controller: {
      ____label: "Application Controller Data",
      ____description: "Private state data maintained by the holistic application controller subsystem.",
      ____types: "jsObject",
      ____defaultValue: {},
      step: {
        ____label: "Step Count Value",
        ____description: "The total number of steps the app state controller has taken since it was constructed. First step is #0, initial value is -1.",
        ____accept: "jsNumber",
        ____defaultValue: -1
      },
      stepError: {
        ____label: "Step Error Information",
        ____description: "Information that is set by the application state controller step algorithm if it encounters a runtime error during a step.",
        ____accept: ["jsObject", "jsNull"],
        // TODO: schematize stepError descriptor object
        ____defaultValue: null
      },
      check: {
        ____label: "Step Check Value",
        ____description: "An opaque key used to check the integrity of the data stored in this document.",
        ____accept: "jsString",
        ____defaultValue: "uninitialized"
      }
    },
    // controller
    runtime: {
      ____label: "Holistic Platform Runtime Library Data",
      ____description: "Private state data maintained by holistic application platform runtime libraries.",
      ____types: "jsObject",
      ____defaultValue: {}
    } // application: {} // <---- added by the applicaton data store constructor factory
    // holisticApplicationData_2k6VQsiuSb2ghMX6Wt1eKQ:

  }
}; // module.exports