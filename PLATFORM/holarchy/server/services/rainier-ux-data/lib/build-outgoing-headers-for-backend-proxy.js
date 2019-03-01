"use strict";

// sources/server/services/service-rainier-data/lib/build-outgoing-headers-for-backend-proxy.js
var buildTag = require("../../../../../../../build/_build-tag");

var extractAuthenticationTokenFromHeader = require("../../../integrations/extract-authentication-token-from-headers");

module.exports = function (gatewayRequest_, pcode_) {
  var outgoingRequestHeaders = {};
  outgoingRequestHeaders["applicationToken"] = "rainier";
  outgoingRequestHeaders["p-code"] = pcode_;
  outgoingRequestHeaders["Content-Type"] = "application/json";
  outgoingRequestHeaders["User-Agent"] = [buildTag.packageAuthor, "/", buildTag.packageName, "_v", buildTag.packageVersion, "_", buildTag.buildCommitShortHash, "_"].join("");
  var qcTokenValue = extractAuthenticationTokenFromHeader(gatewayRequest_.gatewayServiceFilterRequest.request_descriptor);

  if (qcTokenValue) {
    outgoingRequestHeaders.Cookie = "qcToken=" + qcTokenValue; // + '; aAge=?; cAge=0ms');
  }

  return outgoingRequestHeaders;
};