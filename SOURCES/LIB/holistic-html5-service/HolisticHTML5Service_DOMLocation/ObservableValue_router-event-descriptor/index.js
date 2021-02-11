

(function() {

    const arccore = require("@encapsule/arccore");
    const holarchyCM = require("@encapsule/holarchy-cm");
    const routerEventDescriptorSpec = require("../lib/iospecs/router-event-descriptor-spec");

    let synthResponse = holarchyCM.cmtObservableValue.synthesizeCellModel({
        cellModelLabel: "RouterEventDescriptor",
        synthesizeRequest: {
            valueTypeDescription: "A router event descriptor produced by HolisticHTML5Service_DOMLocation cell process.",
            valueTypeSpec: routerEventDescriptorSpec
        }
    });

    if (synthResponse.error) {
        throw new Error(synthResponse.error);
    }

    const ObservableValue_RouterEventDescriptor = synthResponse.result;

    module.exports = {
        cellmodels: [
            ObservableValue_RouterEventDescriptor,
        ]
    };

})();

