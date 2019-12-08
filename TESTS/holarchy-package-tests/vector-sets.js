module.exports = [

    // Low-level ObservableProcessModel ES6 class tests.
    require("./vector-set-opc-constructor"),
    require("./vector-set-opc-constructor-bindings"),
    require("./vector-set-opc-method-act"),
    require("./vector-set-opc-evaluate-p1-operators"),
    require("./vector-set-opc-evaluate-p2-exit-actions"),

    // Low-level ObservableProcessModel ES6 class tests.
    require("./vector-set-opm-constructor"),

    // Low-level ControllerAction ES6 class tests.
    require("./vector-set-act-constructor"),

    // Low-level TransitionOperator ES6 class tests.
    require("./vector-set-top-constructor"),

    // Derived OPC system tests.
    require("./vector-set-frame-latch"),


];
