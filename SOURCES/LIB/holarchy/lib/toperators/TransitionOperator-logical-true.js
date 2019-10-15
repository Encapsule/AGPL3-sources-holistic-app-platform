// transition-operator-always-filter.js

const TransitionOperator = require("../../opc/TransitionOperator");

module.exports = new TransitionOperator({
    id: "e89cwnP4Qd6MocAhzdOJgw",
    name: "Always (TRUE) Transition Operator",
    description: "Always returns true.",
    operatorRequestSpec: {
        ____types: "jsObject",
        always: {
            ____accept: "jsBoolean",
            ____inValueSet: [ true ]
        }
    },
    bodyFunction: function () {
        return { error: null, result: true };
    }
});

