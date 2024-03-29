// ObservableValue_T/ObservableValueBase/ControllerAction-ObservableValueBase-write-value.js

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueBase = require("./cmasObservableValueBase");
    const cmLabel = require("./cell-label");
    const actionName = `${cmLabel} Write Value`;

    const action = new holarchy.ControllerAction({
        id: cmasObservableValueBase.mapLabels({ CM: cmLabel, ACT: actionName }).result.ACTID,
        name: actionName,
        description: "Writes a new value to any active cell of the family ObservableValue_T replacing the cell's current value and incrementing its revision count.",
        actionRequestSpec: {
            ____label: "ObservableValue Write Value Action Request",
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    actions: {
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
                console.log(`[${this.filterDescriptor.operationID}::${this.filterDescriptor.operationName}] called on provider cell "${actionRequest_.context.apmBindingPath}"`);
                const messageBody = actionRequest_.actionRequest.holarchy.common.actions.ObservableValue.writeValue;
                let ocdResponse = actionRequest_.context.ocdi.readNamespace({ apmBindingPath: actionRequest_.context.apmBindingPath, dataPath: `${messageBody.path}.revision` });
                if (ocdResponse.error) {
                    errors.push("Cannot read the current ObservableValue revision number from cell memory!");
                    errors.push(ocdResponse.error);
                    break;
                }
                let newRevision = ocdResponse.result + 1;
                const newCellMemory = {
                    __apmiStep: "observable-value-ready",
                    mailbox: {
                        value: messageBody.value
                    },
                    revision: newRevision
                    // NOTE THAT WE CLEAR any pending dact here explicitly.
                    // BY DESIGN a write is agnostic to a pending DACT and superscedes the DACT.
                    // If you were to cancel DACT via action and then writeValue the behavior
                    // would be equivalent; writeValue just does it automatically.
                };
                ocdResponse = actionRequest_.context.ocdi.writeNamespace({ apmBindingPath: actionRequest_.context.apmBindingPath, dataPath: messageBody.path }, newCellMemory);
                if (ocdResponse.error) {
                    errors.push("Cannot write the new ObservableValue value to cell memory!");
                    errors.push(ocdResponse.error);
                    break;
                }
                response.result = { revision: newCellMemory.revision, value: newCellMemory.mailbox?newCellMemory.mailbox.value:undefined };
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

