"use strict";

// sources/client/app-data-controller/transition-operators/index.js
// If this turns into an area of frequent activity (probably not) then
// we should not throw an exception but instead return the discriminator
// factory response (and make upstream changes) to report the error
// visibly (not burried in the dev console or completely ommitted
// in a production release).
var arccore = require("@encapsule/arccore");

var transitionExpressionOperators = [require("./toperator-ads-dictionary-cardinality-equal"), require("./toperator-ads-equal-a-b"), require("./toperator-ads-exists"), require("./toperator-ads-filterError"), require("./toperator-ads-isTrue"), require("./toperator-ads-notEmptyArray"), require("./toperator-asc-inState"), require("./toperator-logical-and"), require("./toperator-logical-not"), require("./toperator-logical-or"), require("./toperator-logical-true")];
var factoryResponse = arccore.discriminator.create({
  filters: transitionExpressionOperators,
  options: {
    action: "routeRequest"
  }
});
if (factoryResponse.error) throw new Error(factoryResponse.error); // Exports an ARCcore.discriminator filter instance configured
// to route incoming request through to 1:N transition operator
// filters.

module.exports = factoryResponse.result;