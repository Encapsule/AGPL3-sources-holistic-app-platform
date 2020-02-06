"use strict";

// @encapsule/holistic-app-client-sml/lib/index.js
module.exports = {
  actions: {},
  models: {
    d2r2ReactClientDisplayAdaptor: require("./d2r2-react-client-display-adaptor/d2r2-react-client-display-adaptor"),
    DOMLocationProcessor: require("./dom-location-processor/dom-location-processor")
  },
  operators: {},
  test: {
    declaration: {
      d2r2ReactClientDisplayAdaptor: require("./d2r2-react-client-display-adaptor/d2r2-react-client-display-adaptor-declaration"),
      DOMLocationProcessor: require("./dom-location-processor/dom-location-processor-declaration")
    }
  }
};