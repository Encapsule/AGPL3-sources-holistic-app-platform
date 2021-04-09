// app-service-core.js

(function() {
    const { HolisticServiceCore } = require("@encapsule/holistic-service-core");
    const appServiceCoreSpecializations = require("./app-service-core-specializations");
    const appServiceCore = new HolisticServiceCore(appServiceCoreSpecializations);
    if (!appServiceCore.isValid()) {
        throw new Error(appServiceCore.toJSON());
    }
    module.exports = appServiceCore
})();

