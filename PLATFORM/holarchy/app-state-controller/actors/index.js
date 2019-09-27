"use strict";

// sources/client/app-state-controller/actors/index.js
var appStateActorFactory = require("../../../common/data/app-data-store-actor-factory"); ////
// These are raw unparsed declaration objects. We organize like this so that
// we can reduce the amount of error-prone typing required. And, to provide
// more consistent error messaging.
//


var appStateActorDeclarations = [require("./actor-target-segment-add"), require("./actor-baseline-segment-add"), require("./actor-target-segment-remove"), require("./actor-baseline-segment-remove"), require("./actor-characteristics-toggle"), require("./actor-query-date-range-change"), require("./actor-advertiser-init"), require("./actor-advertiser-change"), require("./actor-country-change"), require("./actor-available-date-range"), require("./actor-submit-query"), require("./actor-clear-query-params"), require("./actor-hash-route-change"), require("./actor-write-query-params-to-location-hash"), require("./actor-update-query-builder-from-cache"), require("./actor-segment-search-response-processor"), require("./actor-segment-search-set-selected-segment-search"), // v--- Parity release and beyond...
require("./actor-net-queue-gateway-request"), require("./actor-net-get-rainier-audience-countries"), require("./actor-net-get-rainier-audience-verticals"), require("./actor-net-get-rainier-data-availability"), require("./actor-net-get-rainier-demographic-categories"), require("./actor-net-get-rainier-audience-grid-categories"), require("./actor-net-get-rainier-demographic-countries"), require("./actor-net-get-rainier-geographic-categories"), require("./actor-net-get-rainier-query-date-range"), require("./actor-net-post-adhoc-query"), require("./actor-transform-audience-grid-net-response-characteristics"), //
require("./actor-ads-copy-a-b"), require("./actor-ads-delete")]; // Keep track of the actor filter ID's we've registered. Fail on duplicate.

var definedActorIRUTs = {}; // Call each of the state actor factory export functions and return
// the filter factory response to the caller for error analysis/reporting.

module.exports = function (actorRuntimeContext_) {
  return appStateActorDeclarations.map(function (appStateActorDeclaration_) {
    appStateActorDeclaration_.runtimeContext = actorRuntimeContext_;
    var factoryResponse = {
      error: null,
      result: null
    };

    if (definedActorIRUTs[appStateActorDeclaration_.id]) {
      factoryResponse.error = ["Unable to construct app state actor [", appStateActorDeclaration_.id, "::", appStateActorDeclaration_.name, "] because there's another filter using that ID!!!"].join(" ");
      return factoryResponse;
    }

    definedActorIRUTs[appStateActorDeclaration_.id] = true;
    factoryResponse = appStateActorFactory.request({
      runtimeContext: actorRuntimeContext_,
      actorDeclaration: appStateActorDeclaration_
    });

    if (factoryResponse.error) {
      factoryResponse.error = ["Unable to construct app state actor [" + appStateActorDeclaration_.id + "::" + appStateActorDeclaration_.name + "] due to error:", factoryResponse.error].join(" ");
    }

    return factoryResponse;
  });
};