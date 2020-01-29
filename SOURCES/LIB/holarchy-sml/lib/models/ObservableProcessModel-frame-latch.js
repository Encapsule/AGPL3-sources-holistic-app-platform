// opm-frame-latch.js

const holarchy = require("@encapsule/holarchy");
const opmFrameLatchDeclaration = require("./ObservableProcessModel-frame-latch-declaration");
module.exports = new holarchy.ObservableProcessModel(opmFrameLatchDeclaration);
