// ObservableValue_T/ObservableValueBase/ControllerAction-read-value.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const cellModelLabel = require("./cell-label");

    const actionName = `${cellModelLabel}.action.readValue`;

    const action = new holarchy.ControllerAction({
        id: cmasHolarchyCMPackage.mapLabels({ ACT: actionName }).result.ACTID,
        name: actionName,
        description: "Reads and returns an ObervableValue from any active cell that is a member of the ObservableValue CellModel family.",
        actionRequestSpec: {
            ____label: "ObservableValue Read Action Request",
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    ObservableValue: {
                        ____types: "jsObject",
                        readValue: {
                            ____types: "jsObject"
                        }
                    }
                }
            }
        },
        actionResultSpec: {
            ____label: "ObservableValue Read Action Result",
            ____types: "jsObject",
            value: { ____opaque: true },
            revision: { ____accept: "jsNumber" }
        },
        bodyFunction: function(actionRequest_) {

            return { error: null, result: { value: "whatever", revision: 0 } }; // TODO

        }
    });

    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }

    module.exports = action;


})();

