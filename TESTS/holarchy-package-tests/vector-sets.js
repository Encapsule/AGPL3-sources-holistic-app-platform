module.exports = [
    // Low-level OPC tests.
    require("./vector-set-opc-constructor"),
    require("./vector-set-opc-constructor-bindings"),
    require("./vector-set-opc-method-act"),
    require("./vector-set-opc-evaluate-p1-operators"),

    // Individual OPC declaration components ES6 class tests.
    require("./vector-set-act-constructor"),
    require("./vector-set-top-constructor"),
    require("./vector-set-opm-constructor"),

    // Derived OPC system tests.
    require("./vector-set-frame-latch"),


];
