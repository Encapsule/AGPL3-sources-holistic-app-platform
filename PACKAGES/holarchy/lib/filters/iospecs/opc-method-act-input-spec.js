"use strict";

var opcActorStackEntrySpec = require("./opc-actor-stack-entry-spec");

module.exports = {
  ____label: "OPC.act Method Request",
  ____description: "Defines the request format accepted by ObservableProcessController.act method.",
  ____types: "jsObject",
  opcRef: {
    ____label: "OPC Reference",
    ____description: "A reference to the ObservableProcessController class instance to act on.",
    ____accept: "jsObject"
  },
  // The caller of OPC.act method is an "actor" attempting to perform some or another task...
  actorName: opcActorStackEntrySpec.actorName,
  actorTaskDescription: opcActorStackEntrySpec.actorTaskDescription,
  actionRequest: {
    ____label: "Action Request",
    ____description: "An actor-specified request descriptor object that is dynamically routed to an appropriate ControllerAction plug-in filter by the ObservableProcessController instance.",
    ____accept: "jsObject" // All actionRequests are action-specific descriptor objects declared by the ControllerAction author.

  },
  // 2022.01.18 -- open question I cannot answer off the top of my head:
  // Typically, if specified apmBindingPath is literally an OCD path defined by CellProcessManager (CPM)
  // for explicit/implicit cell process activations. Question is: Does it have to be? I think so...
  // We probably need to update the naming conventions here; it's bloody difficult to follow...
  apmBindingPath: {
    ____label: "APM Binding Path",
    ____description: "Optional fully-qualified dot-delimited path to an APM instance binding namespace in the OCD. Or, a process coordinate descriptor object. Defaults to ~ if not specified.",
    ____types: ["jsString", "jsObject"],
    ____defaultValue: "~",
    // If apmBindingPath is not specified, then the action is bound to the anonymous root namespace of OCD and must resolve its own paths.
    apmID: {
      ____accept: "jsString"
    },
    instanceName: {
      ____accept: "jsString",
      ____defaultValue: "singleton"
    }
  }
};