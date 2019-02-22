// sources/server/services/service-rainier-ux-data/data-gateway-filters/index.js

module.exports = [
    require("./get-rainier-audience-countries"),
    require("./get-rainier-audience-verticals"),
    require("./get-rainier-data-availability"),
    require("./get-rainier-demographic-categories"),
    require("./get-rainier-audience-grid-categories"),
    require("./get-rainier-demographic-countries"),
    require("./get-rainier-geographic-categories"),
    require("./get-rainier-query-date-range.js"),
    require("./get-rainier-segment-list-from-path"),
    require("./post-rainier-adhoc-query")
];
