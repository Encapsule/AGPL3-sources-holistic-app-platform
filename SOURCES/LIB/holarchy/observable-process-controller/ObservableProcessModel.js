
const constructorRequestFilter = require("./lib/ObservableProcessModel-constructor-filter");

class ObservableProcessModel {

    constructor(request_) {
        this._private = {};
        let filterResponse = constructorRequestFilter.request(request_);
        if (filterResponse.error) {
            throw new Error(filterResponse.error);
        }
        this._private.opmDigraph = filterResponse.result;
        this.toJSON = this.toJSON.bind(this);
    }

    toJSON() {
        return this._private.opmDigraph.toJSON();
    }

}

module.exports = ObservableProcessModel;


