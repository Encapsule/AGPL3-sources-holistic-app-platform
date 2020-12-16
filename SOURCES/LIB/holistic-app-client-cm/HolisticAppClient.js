// HolisticAppClient.js

const constructorFilter = require("./lib/filters/HolisticAppClient-method-constructor-filter");

class HolisticAppClient {

    constructor(request_) {
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            this._private = { constructorError: null };
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.boot = this.boot.bind(this);
            let filterResponse = constructorFilter.request(request_);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift(`HolisticAppClientService::constructor failed yielding a zombie instance.`);
            this._private.constructorError = errors.join(" ");
        }
    }

    isValid() { return (!this._private.constructorError); }

    toJSON() { return (this.isValid()?this._private:this._private.constructorError); }

    boot() {
        if (!this.isValid()) {
            return this.toJSON();
        }
        return this._private.serviceRuntime.act({
            actorName: "Browser Tab Host",
            actorTaskDescription: "Browser is attempting to boot the tab service.",
            actionRequest: { holistic: { app: { client: { boot: {} } } } }
        });
    }

}

module.exports = HolisticAppClient;

