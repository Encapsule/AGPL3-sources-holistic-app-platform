"use strict";

// get-segment-search-request-filter-factory.js
//
// Exports a filter that produces a Rainier segment search hrequest object
// that is called from within a data gateway filter to obtain the actual
// results from the Rainier backend via proxy.
//
var querystring = require("querystring"); // Node.js built-in module


var arccore = require("@encapsule/arccore");

var apiConstants = require("./api-constants");

var HttpServerSideRequestFactory = require("hrequest/server-factory");

var factoryResponse = arccore.filter.create({
  operationID: "1475areBTiGnM-TGAzbcpQ",
  operaiontName: "Rainier Segment Search Proxy Factory",
  operationDescription: "Manufactures an HTTP GET proxy filter",
  inputFilterSpec: {
    ____types: "jsObject",
    rawSegmentSearchPath: {
      ____accept: "jsString"
    }
  },
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      result: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var escapedSegmentSearchPath = querystring.escape(request_.rawSegmentSearchPath);
      var url = [apiConstants.endpoints.urlRainierGetSegmentSearch, escapedSegmentSearchPath].join("/");
      var innerResponse = HttpServerSideRequestFactory.request({
        name: "Rainier Segment Search",
        description: "Performs an HTTP GET request on the Rainier backend to retrieve segment names in the specified namespaces.",
        method: "GET",
        url: url
      });

      if (innerResponse.error) {
        errors.push("Unable to construct hrequest filter.");
        errors.push(innerResponse.error);
        break;
      }

      console.log("hrequest object constructed for GET " + url);
      response.result = innerResponse.result;
      break;
    }

    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  },
  outputFilterSpec: {
    ____accept: "jsObject" // <-- hrequest filter object

  }
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;