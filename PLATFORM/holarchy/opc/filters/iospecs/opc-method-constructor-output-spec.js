"use strict";

// @encapsule/holistic/SOURCES/LIB/holarchy/opc/filters/iospecs/opc-method-constructor-output-spec.js
module.exports = {
  ____types: "jsObject",
  id: {
    ____label: "OCP System Version-Independent ID",
    ____description: "Unique developer-assigned Version-Independent Identifier (VIID) that does not changed. Used to grossly discriminate different OPC systems that may be used in one runtime. And, in logs.",
    ____accept: "jsString"
  },
  iid: {
    ____label: "OCP System Instance ID",
    ____description: "Random v4 UUID-derived IRUT used to identify this specific OPC instance.",
    ____accept: "jsString"
  },
  name: {
    ____label: "OCP System Name",
    ____description: "Developer-defined short name assigned to this OPC system model.",
    ____accept: "jsString"
  },
  description: {
    ____label: "OCP System Description",
    ____description: "Developer-defined short descripion of the function and/or role of this OPC configuration.",
    ____accept: "jsString"
  },
  opmMap: {
    ____label: "OPM Map",
    ____description: "A flattend map of the OPM instances passed into the OPC constructor method.",
    ____types: "jsObject",
    ____asMap: true,
    opmId: {
      // ObservableProcessModel ES6 class instance reference
      ____label: "OPM Class Instance Reference",
      ____description: "Reference to an OPM class instance passed to the OPC constructor method.",
      ____accept: "jsObject" // We do not validate ES6 classes w/filter. They're designed to be valid by construction. Or, in zombie state.

    }
  },
  opmiSpecPaths: {
    ____label: "OPMI Spec Paths",
    ____description: "Array of abstract OPM to OCD data namespace binding descriptors created by the OPC constructor. There will be one element per dev-defined OCD spec namespace w/registered OPM binding appdsl annotation.",
    ____types: "jsArray",
    opmiBindingDescriptor: {
      ____label: "OPMI Binding Descriptor",
      ____description: "Descriptor object that relates a developer-defined OCD namespace path with its registered OPM instance.",
      ____types: "jsObject",
      specPath: {
        ____label: "OCD Spec Path",
        ____description: "Filter-style dot-delimited path to the OCD spec namespace with ____appdsl: { opm: IRUT } } annotation.",
        ____accept: "jsString"
      },
      opmiRef: {
        // ObservableProcessModel ES6 class instance reference
        ____label: "OPM Class Instance Reference",
        ____description: "Reference to an OPM class instance passed to the OPC constructor method.",
        ____accept: "jsObject" // We do not validate ES6 classes w/filter. They're designed to be valid by construction. Or, in zombie state.

      }
    }
  },
  ocdSpec: {
    ____accept: "jsObject"
  },
  ocdi: {
    ____accept: "jsObject"
  },
  transitionDispatcher: {
    ____accept: "jsObject"
  },
  actionDispatcher: {
    ____accept: "jsObject"
  },
  evalCount: {
    ____accept: "jsNumber",
    ____defaultValue: 0
  },
  lastEvalResponse: {
    ____accept: ["jsObject", "jsNull"],
    ____defaultValue: null
  },
  opcActorStack: {
    ____accept: "jsArray",
    ____defaultValue: []
  }
};