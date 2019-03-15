"use strict";

// sources/common/view/elements/index.js
//
// Export the UX base libraries _common_ (i.e. agnostic to client/server render) data view bindings.
var dataRoutableComponents = [require("./page/HolisticPageView.jsx"), require("./page/HolismHttpServerErrorPageView.jsx"), require("./component/RUXBase_PageContent_HttpServerError.jsx")]; // Convert the array into a dictionary.

module.exports = dataRoutableComponents.reduce(function (dictionary_, element_) {
  var drcNameKey = element_.filterDescriptor.operationID + "::" + element_.filterDescriptor.operationName;
  dictionary_[drcNameKey] = element_;
  return dictionary_;
}, {});