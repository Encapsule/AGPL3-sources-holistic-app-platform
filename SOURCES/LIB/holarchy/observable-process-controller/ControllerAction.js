
// const arccore = require("@encapsule/arccore");

class ControllerAction {

    construction(request_) {

        this._private = {};

        this.toJSON = this.toJSON.bind(this);

        request_;

    }

    toJSON() {
        return this._private;
    }

}

module.exports = ControllerAction;
