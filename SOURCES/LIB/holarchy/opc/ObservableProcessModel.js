
const constructorRequestFilter = require("./filters/ObservableProcessModel-constructor-filter");

class ObservableProcessModel {

    constructor(request_) {
        let filterResponse = constructorRequestFilter.request(request_);
        if (filterResponse.error) {
            throw new Error(filterResponse.error);
        }

        this._private = {};
        this._private = filterResponse.result;

        this.toJSON = this.toJSON.bind(this);
        this.getID = this.getID.bind(this);
        this.getName = this.getName.bind(this);
        this.getDescription = this.getDescription.bind(this);
        this.getStepDescriptor = this.getStepDescriptor.bind(this);
        this.getDataSpec = this.getDataSpec.bind(this);
    }

    toJSON() {
        return this._private;
    }

    getID() {
        return this._private.declaration.id;
    }

    getName() {
        return this._private.declaration.name;
    }

    getDescription() {
        return this._private.declaration.description;
    }

    getStepDescriptor(stepLabel_) {
        return this._private.declaration.steps[stepLabel_];
    }

    getDataSpec() {
        return this._private.declaration.opmDataSpec;
    }

}

module.exports = ObservableProcessModel;


