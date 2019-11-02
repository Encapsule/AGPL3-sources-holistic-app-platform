"use strict";

// @encapsule/holistic/SOURCES/LIB/holarchy/opc/filters/iospecs/opc-method-constructor-output-spec.js
module.exports = {
  ____types: "jsObject",
  id: {
    ____accept: "jsString"
  },
  iid: {
    ____accept: "jsString"
  },
  name: {
    ____accept: "jsString"
  },
  description: {
    ____accept: "jsString"
  },
  opmMap: {
    ____accept: "jsObject"
  },
  opmiSpecPaths: {
    ____accept: "jsArray"
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