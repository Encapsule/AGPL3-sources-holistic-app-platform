// AbstractProcessModel-frame-latch.js

// DON'T USE THIS FOR ANYTHING YET! DO NOT DERIVE FROM THIS...

const holarchy = require("@encapsule/holarchy");
const apmFrameLatchDeclaration = require("./declarations/AbstractProcessModel-frame-latch-declaration");
module.exports = new holarchy.AbstractProcessModel(apmFrameLatchDeclaration);
