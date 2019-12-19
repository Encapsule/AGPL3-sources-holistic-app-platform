"use strict";

var observableFrameLatchDeclaration = require("./opm-frame-latch-declaration");

var observableFrameLatch = require("./opm-frame-latch");

var SMLModels = {
  core: {
    observableFrameLatch: observableFrameLatch
  },
  test: {
    declaration: {
      observableFrameLatch: observableFrameLatchDeclaration
    }
  }
};
module.exports = SMLModels;