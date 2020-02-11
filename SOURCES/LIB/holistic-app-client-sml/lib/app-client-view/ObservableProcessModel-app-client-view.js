// ObservableProcessModel-app-client-view.js

const holarchy = require("@encapsule/holarchy");

const appClientViewDeclaration = require("./ObservableProcessModel-app-client-view-declaration");
module.exports = new holarchy.ObservableProcessModel(appClientViewDeclaration);
