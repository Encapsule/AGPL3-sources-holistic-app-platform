
const appStateSubcontrollerFactory = require("./lib/observable-process-model-definition-filter");

class ObservableProcessModel {

    constructor(request_) {

        this._private = {};

        let filterResponse = appStateSubcontrollerFactory.request(request_);
        if (filterResponse.error) {
            throw new Error(filterResponse.error);
        }

        this._private.opmDigraph = filterResponse.result;

    }

    toJSON() {
        return this._private.opmDigraph.toJSON();
    }


}

module.exports = ObservableProcessModel;


