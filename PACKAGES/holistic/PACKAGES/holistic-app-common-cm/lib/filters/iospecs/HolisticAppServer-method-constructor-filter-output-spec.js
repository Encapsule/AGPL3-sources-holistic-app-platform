// app-server-service-method-constructor-output-spec.js

// We cherry pick a few namespaces from the input spec and splice them into the output spec
// for cases where the constructor filter retains a copy of the input request in this._private.
const inputFilterSpec = require("./HolisticAppServer-method-constructor-filter-input-spec");

module.exports = {

    ____label: "Holistic App Server Service Context Descriptor",
    ____description: "A developer-defined descriptor object containing the information required to synthesize and start the derived app server service process inside CellProcessor.",
    ____types: "jsObject",

    appServiceCore: { ... inputFilterSpec.appServiceCore },

    

};
