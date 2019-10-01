
const appStateSubcontrollerFactory = require("./lib/app-state-subcontroller-factory");

class ObservableProcessModel {

    constructor(request_) {

        this._private = {};

        let filterResponse = appStateSubcontrollerFactory.request(request_);
        if (filterResponse.error) {
            throw new Error(filterResponse.error);
        }

        this._private.opm = filterResponse.result;

    }

    toJSON() {
        return this._private.opm.toJSON();
    }


}

module.exports = ObservableProcessModel;


