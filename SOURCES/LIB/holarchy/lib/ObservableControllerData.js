// ObserverableControllerData.js

const methodFilterConstructor = require("./filters/ocd-method-constructor-filter");
const methodFilterDataPathResolve = require("./filters/ocd-method-data-path-resolve-filter");
const methodFilterReadNamespace = require("./filters/ocd-method-read-namespace-filter");
const methodFilterWriteNamespace = require("./filters/ocd-method-write-namespace-filter");
const methodFilterGetNamespaceSpec = require("./filters/ocd-method-get-namespace-spec-filter");

module.exports = class ObservableControllerData {

    constructor(request_) { // request = { spec: filter descriptor object, data: variant }
        this.isValid = this.isValid.bind(this);
        this.toJSON = this.toJSON.bind(this);
        this.readNamespace = this.readNamespace.bind(this);
        this.writeNamespace = this.writeNamespace.bind(this);
        this.getNamespaceSpec = this.getNamespaceSpec.bind(this);
        const methodFilterResponse = methodFilterConstructor.request(request_);
        this._private = !methodFilterResponse.error?methodFilterResponse.result:{ constructorError: methodFilterResponse.error };
    } // end constructor

    static dataPathResolve(request_) { return methodFilterDataPathResolve.request(request_); }

    isValid() { return (this._private.constructorError?false:true); }

    toJSON() { return (this.isValid()?this._private.storeData:this._private.constructorError); }

    readNamespace(path_) { return (this.isValid()?methodFilterReadNamespace.request({ ocdClass: ObservableControllerData, ocdReference: this, path: path_ }):{ error: this.toJSON() }); }

    writeNamespace(path_, data_) { return (this.isValid()?methodFilterWriteNamespace.request({ ocdClass: ObservableControllerData, ocdReference: this, path: path_, data: data_ }):{ error: this.toJSON() }); }

    getNamespaceSpec(path_) { return (this.isValid()?methodFilterGetNamespaceSpec.request({ ocdClass: ObservableControllerData, ocdReference: this, path: path_ }):{ error: this.toJSON() }); }

} // class ObservableControllerData







