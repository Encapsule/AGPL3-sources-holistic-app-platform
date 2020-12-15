// TODO: app-client-method-constructor-input-spec.js

const serviceTypes = require("@encapsule/holistic-app-common-cm").serviceTypes;

module.exports = {

    ____label: "HolisticBTabService::constructor Request Object",
    ____description: "A developer-defined descriptor object containing the information required to configure and initialize a holistic app service running inside a browser tab instance.",
    ____types: "jsObject",

    appServiceCore: {
        ____label: "Holistic App Common Definition",
        ____description: "A reference to your HolisticServiceCore class instance. Or, a descriptor object from which we can construct a new instance of HolisticServiceCore for use by your browser tab service.",
        ____accept: "jsObject" // Reference to HolisticAppCore instance
    },

    appTypes: {
        ____label: "Holistic Browser Tab Service Runtime Types",
        ____description: "Developer-defined runtime type definitions, and extensions holistic-platform-defined types for a set of core application-layer objects for which the browser tab service kernel provides type filtering and/or generic orchestration services on behalf of the derived app service.",
        ____types: "jsObject",
        ____defaultValue: {},
        // v0.0.49-spectrolite
        // We do not currently have any such platform-defined types specific only to holistic browser tab service.
        // Someday, that will not be the case. So, unlike HolisticServiceCore and HolisticNodeService you can
        // at least for now safely ignore this request namespace (i.e. take defaults and forget about it for now).
    },

    appModels: {
        ...serviceTypes.HolisticServiceCore.constructor.appModels,
        ____label: "Holistic Browser Tab Service Behavior Models",
        ____description: "A collection of application-specific plug-in artifacts derived from @encapsule/holistic RTL's to register for use inside this holistic browser tab service instance.",
        ____types: "jsObject",
        ____defaultValue: {}
    }

};
