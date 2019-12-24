"use strict";

var observableFrameLatchDeclaration = require("./opm-frame-latch-declaration");

var observableFrameLatch = require("./opm-frame-latch");

var d2r2ReactClientOutputProcessorDeclaration = require("./opm-d2r2-react-client-output-processor-declaration");

var d2r2ReactClientOutputProcessor = require("./opm-d2r2-react-client-output-processor");

var SMLModels = {
  core: {
    observableFrameLatch: observableFrameLatch,
    d2r2ReactClientOutputProcessor: d2r2ReactClientOutputProcessor
  },
  test: {
    declaration: {
      observableFrameLatch: observableFrameLatchDeclaration,
      d2r2ReactClientOutputProcessor: d2r2ReactClientOutputProcessorDeclaration
    }
  }
};
module.exports = SMLModels;