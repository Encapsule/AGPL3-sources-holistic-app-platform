
const constructorFilter = require("./filters/ControllerAction-constructor-filter");

module.exports = class ControllerAction {
    constructor(constructionData_) {
        let filterResponse = constructorFilter.request(constructionData_);
        if (filterResponse.error) {
            throw new Error(filterResponse.error);
        }
        this._private = {
            controllerActionFilter: filterResponse.result
        };
        this.getFilter = this.getFilter.bind(this);
    }
    getFilter() {
        return this._private.controllerActionFilter;
    }
};

