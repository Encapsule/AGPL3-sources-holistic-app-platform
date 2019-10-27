
const constructorFilter = require("./filters/TransitionOperator-constructor-filter");

module.exports = class TransitionOperator {
    constructor(constructionData_) {
        let filterResponse = constructorFilter.request(constructionData_);
        if (filterResponse.error) {
            throw new Error(filterResponse.error);
        }
        this._private = {
            transitionOperatorFilter: filterResponse.result
        };
        this.getFilter = this.getFilter.bind(this);
    }
    getFilter() {
        return this._private.transitionOperatorFilter;
    }
};


