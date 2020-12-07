"use strict";

// @encapsule/holistic-app-common-cm/index.js
var packageMeta = require("./package.json");

module.exports = {
  __meta: {
    author: packageMeta.author,
    name: packageMeta.name,
    version: packageMeta.version,
    codename: packageMeta.codename,
    build: packageMeta.buildID,
    source: packageMeta.buildSource
  },
  // v0.0.49-spectrolite
  HolisticAppCommon: require("./HolisticAppCommon"),
  // ES6 class construction function export
  // This is getting sucked inside HolisticAppCommon but leaving the export for now
  // v0.0.49-spectrolite is this being even called or can be removed?
  appCommonKernelCellModelFactory: require("./lib/holistic-app-common-cellmodel-factory-filter"),
  // This is getting sucked inside HolisticAppCommon but leaving the export for now.
  // CellModel Library (cml)
  cml: require("./lib/HolisticAppCommonKernel")
};