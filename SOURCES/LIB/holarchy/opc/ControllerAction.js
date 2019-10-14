
// const arccore = require("@encapsule/arccore");

class ControllerAction {

    construction(request_) {

        request_;

        this._private = {};

        this.getFilter = this.getFilter.bind(this);
    }

    getFilter() {
        return this._private.filter;
    }

}

module.exports = ControllerAction;
