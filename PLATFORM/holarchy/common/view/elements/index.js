"use strict";

// sources/common/view/elements/index.js
//
// Export the UX base libraries _common_ (i.e. agnostic to client/server render) data view bindings.
var dataRoutableComponents = [require("./page/HolisticPageView.jsx"), require("./page/HolismHttpServerErrorPageView.jsx"), require("./component/RUXBase_PageContent_HttpServerError.jsx"), require("./component/HolisticMarkdownContent.jsx"), require("./component/HolisticEmptyPlaceholder.jsx") //    require("./component/RUXBase_PageHeader.jsx"),
//    require("./component/RUXBase_PageContent.jsx"),
//    require("./component/RUXBase_PageContent_AdminStatus.jsx"),
//    require("./component/RUXBase_PageContent_AppError.jsx"),
//    require("./component/RUXBase_PageContent_RuntimeFilterError.jsx"),
//    require("./component/RUXBase_PageContent_QueryBuilderFrame.jsx"), // this is going to get killed soon
//    require("./component/RUXBase_PageContent_QueryResultsFrame.jsx"), // this is going to get killed soon.
//    require("./component/RUXBase_PageContent_Sitemap.jsx"),
//    require("./component/RUXBase_PageContent_Spinner.jsx"),
//    require("./component/RUXBase_PageContent_AppDataStoreStatus.jsx"),
//    require("./component/RUXBase_PageContent_SubviewSummary.jsx"),
//    require("./component/RUXBase_PageFooter.jsx"),
//    require("./component/RUXBase_PagePanel_Errors.jsx"),
//    require("./component/RUXBase_PagePanel_ReactDebug.jsx"),
//    require("./component/RUXBase_PageWidget_ASC.jsx")
]; // Convert the array into a dictionary.

module.exports = dataRoutableComponents.reduce(function (dictionary_, element_) {
  var drcNameKey = element_.filterDescriptor.operationID + "::" + element_.filterDescriptor.operationName;
  dictionary_[drcNameKey] = element_;
  return dictionary_;
}, {});