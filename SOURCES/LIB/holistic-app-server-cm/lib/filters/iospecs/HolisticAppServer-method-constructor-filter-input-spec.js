// app-server-method-constructor-input-spec.js

module.exports = {

    ____label: "HolisticAppServer::constructor Request Object",
    ____description: "A developer-defined descriptor object containing the information required to configure and initialize the derived app server service process.",
    ____types: "jsObject",

    appServiceCore: { // This is what I want for naming. Currently, we're actually dealing in HolisticAppCommon class instances/constructor request descriptor objects here.
        ____label: "Holistic Service Core Definition",
        ____description: "A reference to a HolisticAppCore class instance. Or, a descriptor object from which we can construct a new instance of class HolisticServiceCore.",
        ____accept: "jsObject"
    },

};

