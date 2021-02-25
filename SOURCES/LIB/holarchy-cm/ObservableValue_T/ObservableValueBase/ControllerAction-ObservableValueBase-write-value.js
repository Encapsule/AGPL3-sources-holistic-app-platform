// ObservableValue_T/ObservableValueBase/ControllerAction-ObservableValueBase-write-value.js

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueBase = require("./cmasObservableValueBase");
    const cmLabel = require("./cell-label");
    const actionName = `${cmLabel} Write Value`;

    const action = new holarchy.ControllerAction({
        id: cmasObservableValueBase.mapLabels({ ACT: actionName }).result.ACTID,
        name: actionName,
        description: "Writes a new value to any active cell of the family ObservableValue_T replacing the cell's current value and incrementing its revision count.",
        actionRequestSpec: {
            ____label: "ObservableValue Write Value Action Request",
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    ObservableValue: {
                        ____types: "jsObject",
                        writeValue: { // <- non-optional spec down to this point for arccore.discriminator
                            ____types: "jsObject",
                            value: {
                                ____label: "Value Data",
                                ____description: "The new value to be written to the ObservableValue_T cell's #.value namespace.",
                                ____opaque: true // <- We allow you to pass _anything_ through here. However... #.value is type-specialized in the OCD. So, if you pass a bad value through here then the action will fail as OCD will reject the write.
                            },
                            path: {
                                ____label: "Value Path",
                                ____description: "The OCD path relative to the ObservableValue family cell's containing cell process.",
                                ____accept: "jsString",
                                ____defaultValue: "#" // This is typically #.outputs.X or #.inputs.Y because ObservableValue family CellModels are typically used as helper cells.
                            }
                        }
                    }
                }
            }
        },
        actionResultSpec: {
            ____label: "ObservableValue Write Value Action Result",
            ____types: "jsObject",
            value: { ____opaque: true },
            revision: { ____accept: "jsNumber" }
        },
        bodyFunction: function(actionRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                console.log(`[${this.operationID}::${this.operationName}] called on provider cell "${actionRequest_.context.apmBindingPath}"`);
                const messageBody = actionRequest_.actionRequest.holarchy.common.ObservableValue.writeValue;
                let ocdResponse = actionRequest_.context.ocdi.readNamespace({ apmBindingPath: actionRequest_.context.apmBindingPath, dataPath: `${messageBody.path}.revision` });
                if (ocdResponse.error) {
                    errors.push("Cannot read the current ObservableValue revision number from cell memory!");
                    errors.push(ocdResponse.error);
                    break;
                }
                let newRevision = ocdResponse.result + 1;
                const newCellMemory = {
                    __apmiStep: "observable-value-ready",
                    revision: newRevision,
                    value: messageBody.value
                };
                ocdResponse = actionRequest_.context.ocdi.writeNamespace({ apmBindingPath: actionRequest_.context.apmBindingPath, dataPath: messageBody.path }, newCellMemory);
                if (ocdResponse.error) {
                    errors.push("Cannot write the new ObservableValue value to cell memory!");
                    errors.push(ocdResponse.error);
                    break;
                }
                response.result = newCellMemory;
                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            console.log(`> Value write ${response.error?"FAILURE":"SUCCESS"}.`);
            return response;
        }
    });

    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }

    module.exports = action;

