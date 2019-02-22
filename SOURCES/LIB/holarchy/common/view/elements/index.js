// sources/common/view/elements/index.js
//
// Export the UX base libraries _common_ (i.e. agnostic to client/server render) data view bindings.

module.exports = [
    require('./page/RUXBase_HttpServerError.jsx'),
    require('./page/RUXBase_Page.jsx'),
    require('./component/RUXBase_PageHeader.jsx'),
    require('./component/RUXBase_PageContent.jsx'),
    require('./component/RUXBase_PageContent_AdminStatus.jsx'),
    require('./component/RUXBase_PageContent_AppError.jsx'),
    require('./component/RUXBase_PageContent_HttpServerError.jsx'),
    require('./component/RUXBase_PageContent_RuntimeFilterError.jsx'),
    require('./component/RUXBase_PageContent_Markdown.jsx'),
    require('./component/RUXBase_PageContent_QueryBuilderFrame.jsx'), // this is going to get killed soon
    require('./component/RUXBase_PageContent_QueryResultsFrame.jsx'), // this is going to get killed soon.
    require('./component/RUXBase_PageContent_Sitemap.jsx'),
    require('./component/RUXBase_PageContent_Spinner.jsx'),
    require('./component/RUXBase_PageContent_AppDataStoreStatus.jsx'),
    require('./component/RUXBase_PageContent_SubviewSummary.jsx'),
    require('./component/RUXBase_PageFooter.jsx'),
    require('./component/RUXBase_PagePanel_Errors.jsx'),
    require('./component/RUXBase_PagePanel_ReactDebug.jsx'),
    require('./component/RUXBase_PageWidget_ASC.jsx')
];
