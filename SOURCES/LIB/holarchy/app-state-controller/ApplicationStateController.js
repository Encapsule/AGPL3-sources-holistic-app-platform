const appStateControllerFactoryFilter = require("./lib/app-state-controller-factory");

class ApplicationStateController {

    constructor(request_) {

        this._private = {};

        // /*

        let filterResponse = appStateControllerFactoryFilter.request(request_);
        if (filterResponse.error) {
            throw new Error(filterResponse.error);
        }

        this._private.asc = filterResponse.result;

        // */

        request_; // there - now it's referenced

        // Bind instance methods.
        this.toJSON = this.toJSON.bind(this);
    }

    toJSON() {
        return this._private;
    }

}

module.exports = ApplicationStateController;
