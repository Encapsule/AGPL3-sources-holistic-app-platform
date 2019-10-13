
const transitionOperatorDefinitionFilter = require("./lib/transition-operator-definition-filter");

class TransitionOperator {

    constructor(constructionData_) {
        let filterResponse = transitionOperatorDefinitionFilter.request(constructionData_);
        if (filterResponse.error) {
            throw new Error(filterResponse.error);
        }
        this._private.transitionOperatorFilter = filterResponse.result;
    }

}

module.exports = TransitionOperator;
