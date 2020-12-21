// HolisticNodeService.js

const path = require("path");
const process = require("process");

console.log(`> "${path.resolve(__filename)}" module loading...`);

const constructorFilter = require("./lib/filters/HolisticNodeService-method-constructor-filter");

class HolisticNodeService {

    constructor(request_) {
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            this._private = { constructorError: null };
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.listen = this.listen.bind(this);
            let filterResponse = constructorFilter.request(request_);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift(`HolisticAppServer::constructor failed yielding a zombie instance.`);
            this._private.constructorError = errors.join(" ");
        }
    }

    isValid() { return (!this._private.constructorError); }

    toJSON() { return (this.isValid()?this._private:this._private.constructorError); }

    listen(port_) {
        if (!this.isValid()) {
            console.log("App server service is not prepared to listen! Sorry. Here is why:");
            console.error(this.toJSON());
            process.exitCode = 1; // Exit process w/error indicator set
        }
        this._private.httpServerInstance.holismInstance.httpRequestProcessor.listen(port_);
    }

}

module.exports = HolisticNodeService;

