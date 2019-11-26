
// OPC core transition operators:

module.exports = {

    logical: [
        require("./TransitionOperator-logical-and"),
        require("./TransitionOperator-logical-not"),
        require("./TransitionOperator-logical-or"),
        require("./TransitionOperator-logical-true"),
    ]

};

