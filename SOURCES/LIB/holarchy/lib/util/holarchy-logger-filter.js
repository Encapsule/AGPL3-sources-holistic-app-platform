
const arccore = require("@encapsule/arccore");
const opcActorStackEntrySpec = require("../filters/iospecs/opc-actor-stack-entry-spec");
const holarchyConsoleStylesLUT = require("./console-colors-lut");


const factoryResponse = arccore.filter.create({
    operationID: "h7lnSqFxSgma0qvNdZqOZg",
    operationName: "Holarchy Logger",
    operationDescription: "Abstracts logging of @encapsule/holarchy diagnostic and error logging.",

    outputFilterSpec: { ____accept: "jsUndefined" /*response.result is always undefined*/ },

    inputFilterSpec: {
        ____label: "Holarchy Logger Request",
        ____types: "jsObject",

        opc: {
            ____label: "OPC Info",
            ____types: "jsObject",
            ____defaultValue: {},

            id: {
                ____label: "OPC ID",
                ____accept: "jsString",
                ____defaultValue: "<not defined>"
            },

            iid: {
                ____label: "OPC IID",
                ____accept: "jsString",
                ____defaultValue: "<not defined>"
            },

            name: {
                ____label: "OPC Name",
                ____accept: "jsString",
                ____defaultValue: "<not defined>"
            },

            evalCount: {
                ____label: "Evaluation Count",
                ____description: "The current OPC evaluation count.",
                ____accept: "jsNumber",
                ____defaultValue: 0
            },

            frameCount: {
                ____label: "Frame Count",
                ____description: "The current OPC evaluation frame count.",
                ____accept: "jsNumber",
                ____defaultValue: 0
            },

            actorStack: {
                ____label: "OPC Actor Stack",
                ____description: "A reference to the OPC's private actor stack (may be undefined).",
                ____types: "jsArray",
                ____defaultValue: [],
                element: opcActorStackEntrySpec
            }
        },

        logLevel: {
            ____label: "Log Level",
            ____description: "A flag indicating a severity of message.",
            ____accept: "jsString",
            ____inValueSet: [ "info", "diagnostic",  "warning", "error" ],
            ____defaultValue: "info"
        },

        subsystem: {
            ____label: "Subsystem Name",
            ____description: "Name of the @encapsule/holarchy subsystem (oftentimes ES6 class name).",
            ____accept: "jsString",
            ____inValueSet: [ "opc" ],
            ____defaultValue: "opc"
        },

        method: {
            ____label: "Method Name",
            ____description: "Subsystem method name (oftentimes an ES6 class method name).",
            ____accept: "jsString",
            ____inValueSet: [ "constructor", "act", "evaluate" ]
        },

        message: {
            ____label: "Message String",
            ____description: "The message string to log.",
            ____accept: "jsString"
        }

    }, // inputFilterSpec

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log(JSON.stringify(request_));
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    } // bodyFunction


});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

const loggerFilter = factoryResponse.result;

// THROWS ON BAD REQUEST
module.exports = {
    filterDescriptor: loggerFilter.filterDescriptor,
    request: (request_) => {
        const loggerResponse = loggerFilter.request(request_);
        if (loggerResponse.error) {
            let message = [
                `Invalid logger request '${JSON.stringify(request_)}':`,
                loggerResponse.error
            ].join(" ");
            throw new Error(message);
        }
        return loggerResponse;
    }
};
