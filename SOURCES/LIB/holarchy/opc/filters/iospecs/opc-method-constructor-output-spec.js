// @encapsule/holistic/SOURCES/LIB/holarchy/opc/filters/iospecs/opc-method-constructor-output-spec.js


module.exports = {
    ____types: "jsObject",

    id: {
        ____label: "OCP System Version-Independent ID",
        ____description: "Unique developer-assigned Version-Independent Identifier (VIID) that does not changed. Used to grossly discriminate different OPC systems that may be used in one runtime. And, in logs.",
        ____accept: "jsString"
    },

    iid: {
        ____label: "OCP System Instance ID",
        ____description: "Random v4 UUID-derived IRUT used to identify this specific OPC instance.",
        ____accept: "jsString"
    },

    name: {
        ____label: "OCP System Name",
        ____description: "Developer-defined short name assigned to this OPC system model.",
        ____accept: "jsString"
    },

    description: {
        ____label: "OCP System Description",
        ____description: "Developer-defined short descripion of the function and/or role of this OPC configuration.",
        ____accept: "jsString"
    },

    opmMap: { ____accept: "jsObject" },

    opmiSpecPaths: { ____accept: "jsArray" },

    ocdSpec: { ____accept: "jsObject" },

    ocdi: { ____accept: "jsObject" },

    transitionDispatcher: { ____accept: "jsObject" },

    actionDispatcher: { ____accept: "jsObject" },

    evalCount: { ____accept: "jsNumber", ____defaultValue: 0 },

    lastEvalResponse: { ____accept: [ "jsObject", "jsNull" ], ____defaultValue: null },

    opcActorStack: { ____accept: "jsArray", ____defaultValue: [] }

};
