// ControllerAction-ovh-map-add-values.js

(function() {
    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const { cmLabel, cmDescription } = require("./cell-metadata");
    const actionLabel = "addValues";
    const lib = require("./lib");

    // We need the action and operator request/response.result filter specs from the ObservableValueHelper CellModel.
    const ovhCellModel = require("../ObservableValueHelper");
    const ovhCellMemorySpec = ovhCellModel.getAPM().getDataSpec();

    const action =  new holarchy.ControllerAction({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel, ACT: actionLabel }).result.ACTID,
        name: `${cmLabel}::${actionLabel}`,
        description: "Add one or more named ObservableValueHelper cell(s) to a previously activated ObservableValueHelperMap cell.",
        actionRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    actions: {
                        ____types: "jsObject",
                        ObservableValueHelperMap: {
                            ____types: "jsObject",
                            addValues: {
                                ____types: "jsObject",
                                path: {
                                    ____accept: "jsString",
                                    ____defaultValue: "#"
                                },
                                names: {
                                    ____label: "Name to ObservableValueHelper::configure Request Map",
                                    ____types: "jsObject",
                                    ____asMap: true,
                                    ____defaultValue: {},
                                    name: {
                                        // This the spec of an ObservableValueHelper cell's configuration data.
                                        // We accept the value through the action request, and then write it into
                                        // the newly activated ObseravableValueHelper cell in the map so that it
                                        // attempts to link to its specified target cell on first evaluation.
                                        ...ovhCellMemorySpec.configuration
                                    }
                                }

                            }
                        }
                    }
                }
            }
        },
        actionResultSpec: {
            ____accept: "jsObject"
            // TODO --- now returning a copy of the ObservableValueHelperMap cell memory as returned by OCD on write.
        },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {

                const messageBody = request_.actionRequest.holarchy.common.actions.ObservableValueHelperMap.addValues;

                let libResponse = lib.getStatus.request({ ...request_.context, path: messageBody.path });
                if (libResponse.error) {
                    errors.push(libResponse.error);
                    break;
                }
                let { cellMemory, ovhmBindingPath } = libResponse.result;

                let names = Object.keys(messageBody.names);

                // You cannot overwrite an existing ObservableValueHelperMap entry. It must be released via removeValues action.

                for (let i = 0 ; i < names.length ; i++) {
                    const name = names[i];
                    if (cellMemory.ovhMap[name]) {
                        errors.push(`Invalid duplicate name "${name}" configuration specified in request. There's already an ObservableValueHelper cell with that name active in this ObservableValueHelperMap cell.`);
                        break;
                    }
                } // end for
                if (errors.length) {
                    break;
                }

                // No duplicates. Apply the configurations.

                while (names.length) {
                    const name = names.shift();
                    cellMemory.ovhMap[name] = { configuration: messageBody.names[name] }; // Here we activate and configure a new ObservableValueHelper cell in our local cell memory.
                }

                // This could definitely be optimized. But, for now let's just go for logical end-to-end and optimize it later.
                let ocdResponse = request_.context.ocdi.writeNamespace(ovhmBindingPath, cellMemory);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                response.result = ocdResponse.result;

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });
    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }
    module.exports = action;
})();

