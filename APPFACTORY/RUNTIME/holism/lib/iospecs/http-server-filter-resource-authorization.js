// http-server-filter-resource-authorization.js

module.exports = {
    ____label: "Resource Authorization Settings",
    ____description: "Optional settings to limit access to authenticated users.",
    ____types: "jsObject",
    ____defaultValue: {},
    require: {
        ____label: "Require Authorization Flag",
        ____description: "Boolean value indicating if resource access is restricted to authorized users.",
        ____accept: "jsBoolean",
        ____defaultValue: false
    }
};
