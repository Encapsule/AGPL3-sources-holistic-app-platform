

const constructorFilter = require("./ObservableProcessController-constructor-filter");


class ApplicationStateController {

    constructor(request_) {

        // Allocate private, per-class-instance state.
        this._private = {};

        // Normalize the incoming request descriptor object.
        let filterResponse = constructorFilter.request(request_);
        if (filterResponse.error) {
            throw new Error(filterResponse.error);
        }

        const request = filterResponse.result;

        this._private.request = request;





        // Bind instance methods.
        this.toJSON = this.toJSON.bind(this);
        this.callActionFilter = this.callActionFilter.bind(this);
    }


    toJSON() {
        return this._private;
    }


    callActionFilter(actionRequestDescriptor_) {

        actionRequestDescriptor_;

    }

}

module.exports = ApplicationStateController;
