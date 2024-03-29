// ControllerAction-app-client-display-start-display-view-stream.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");

    const cmLabel = require("./cell-label");

    const actionLabel = "setAsRoot";
    const actionName = `${cmLabel}::${actionName}`;

    const action = new holarchy.ControllerAction({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel, ACT: actionLabel }).result.ACTID,
        name: actionName,
        description: "Implements an ObservableValue_T family cell Deferred Action (DACT) registered during DisplayView_T initialization that's called only in the case where a DisplayView_T family cell is registered directly w/HolisticHTML5Service_DisplayDriver.",
        actionRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    actions: {
                        ____types: "jsObject",
                        DisplayViewBase: {
                            ____types: "jsObject",
                            _private: {
                                ____types: "jsObject",
                                setAsRoot: {
                                    ____types: "jsObject"
                                }
                            }
                        }
                    }
                }
            }
        },
        actionResultSpec: {
            ____types: "jsObject",
            renderContext: {
                ____types: "jsObject",
                apmBindingPath: { ____accept: "jsString" },
                displayPath: { ____accept: "jsString" }
            },
            renderData: { ____accept: "jsObject" }
        },
        bodyFunction: function(request_) {
            return ({
                error: null,
                result: {
                    renderContext: {
                        apmBindingPath: request_.context.apmBindingPath,
                        displayPath: "👁"
                    },
                    renderData: {} // Resets to default values per-developer-defined renderData spec
                }
            });
        }
    });

    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }

    module.exports = action;

})();

