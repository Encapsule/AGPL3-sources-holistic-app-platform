// DisplayView_T/DisplayStreamMessage_T/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarcyCMPackage = require("../../cmasHolarchyCMPackage");

    const templateLabel = "DisplayStreamMessage";

    const cmtDisplayStreamMessage = new holarcy.CellModelTemplate({
        cmasScope: cmasHolarchyCMPackage,
        templateLabel,
        cellModelGenerator: {
            specializationDataSpec: {
            }
        },
          generatorRequest = {
              cmtInstance, // reference to this CellModelTemplate template instance --- aka the DisplayView CellModel synthesizer.
              cellModelLabel, // passed by cmtInstance.synthesizeCellModel from caller
              specializationData // passed by cmtInstance.synthesizeCellModel from caller filtered per above spec
          }
        */
        generatorBodyFunction: function(generatorRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });

    if (!cmtDisplayStreamMessage.isValid()) {
        throw new Error(cmtDisplayStreamMessage.toJSON());
    }

    module.exports = cmtDisplayStreamMessage;

})();

