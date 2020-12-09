"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// app-server-service-method-constructor-output-spec.js
// We cherry pick a few namespaces from the input spec and splice them into the output spec
// for cases where the constructor filter retains a copy of the input request in this._private.
var inputFilterSpec = require("./HolisticAppServer-method-constructor-filter-input-spec");

module.exports = {
  ____label: "Holistic App Server Service Context Descriptor",
  ____description: "A developer-defined descriptor object containing the information required to synthesize and start the derived app server service process inside CellProcessor.",
  ____types: "jsObject",
  appServiceCore: _objectSpread({}, inputFilterSpec.appServiceCore)
};