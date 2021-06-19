// app-service-core.js
// Exports a HolisticServiceCore class instance using the constructor request object
// that is exported from the ./app-service-core-specializations.js module.

(function() {
    const { HolisticServiceCore } = require("@encapsule/holistic-service-core");
    const appServiceCoreSpecializations = require("./app-service-core-specializations");
    const appServiceCore = new HolisticServiceCore(appServiceCoreSpecializations);
    if (!appServiceCore.isValid()) {
        throw new Error(appServiceCore.toJSON());
    }
    module.exports = appServiceCore
})();

