
const constructorRequestFilter = require("./ObservableProcessController-constructor-filter");
const ApplicationDataStore = require("../app-data-store/ApplicationDataStore");

class ObservableProcessController {

    constructor(request_) {

        // Allocate private, per-class-instance state.
        this._private = {};

        // Normalize the incoming request descriptor object.
        let filterResponse = constructorRequestFilter.request(request_);
        if (filterResponse.error) {
            throw new Error(filterResponse.error);
        }

        // Keep a copy of the normalized request passed to the constructor.
        this._private.construction = filterResponse.result;

        this._private.controllerData = new ApplicationDataStore({
            spec: request_.controllerDataSpec,
            data: request_.controllerData
        });

        // Bind instance methods.
        this.toJSON = this.toJSON.bind(this);
        this.act = this.act.bind(this);
    }

    toJSON() {
        return this._private;
    }

    act(request_) {
        request_;
    }

}

module.exports = ObservableProcessController;
