
const holarchy = require("@encapsule/holarchy");
const holarchyCML = require("@encapsule/holarchy-cm").cml;

const cellModel =  new holarchy.CellModel({
    id: "YEvlrqB8QAqTX2u9jTItDA",
    name: "Timeout Timer Cell Model",
    description: "Models an timeout timer service using an timeout timer process model. And, two ControllerActions.",
    apm: require("./apm-timeout-timer"),
    actions: [
        require("./act-timeout-timer-start"),
        require("./act-timeout-timer-complete")
    ],
    subcells: [ holarchyCML ]

}); // timeout timer CellModel

if (!cellModel.isValid()) {
    throw new Error(cellModel.toJSON());
}

module.exports = cellModel;


