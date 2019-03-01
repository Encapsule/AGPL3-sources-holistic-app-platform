"use strict";

var clientApplicationFactory = require("./sources/client/client-factory");

module.exports = {
  factories: {
    client: {
      application: clientApplicationFactory
    }
  }
};