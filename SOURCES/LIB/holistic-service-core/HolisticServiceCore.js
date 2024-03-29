// HolisticServiceCore.js

const path = require("path");
console.log(`> "${path.resolve(__filename)}" module loading...`);

const constructorFilter = require("./lib/filters/HolisticServiceCore-method-constructor-filter");

// This is a developer-facing API packaged as an ES6 class. The vast majority of the work is done by
// the constructor filter that is responsible for validating, normalizing, and processing the developer-
// specified constructor function inputs into what we call the "holistic cell nucleus".
//
// The "nucleus" is actually an immutable runtime database of usual-suspect artifacts (i.e. data,
// filter specs, filters, actions, operators, apm's, and cell models) that is required by both
// HolisticAppServer and HolisticAppClient ES6 class constructor functions.
//

class HolisticServiceCore {

    constructor(request_) {
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            this._private = { constructorError: null };
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.getAppBuild = this.getAppBuild.bind(this);
            this.getAppMetadataTypeSpecs = this.getAppMetadataTypeSpecs.bind(this);
            this.getAppMetadataDigraph = this.getAppMetadataDigraph.bind(this);
            this.getAppMetadataOrg = this.getAppMetadataOrg.bind(this);
            this.getAppMetadataApp = this.getAppMetadataApp.bind(this);
            this.getAppMetadataPage = this.getAppMetadataPage.bind(this);
            this.getAppMetadataHashroute = this.getAppMetadataHashroute.bind(this);
            this.getClientUserLoginSessionSpec = this.getClientUserLoginSessionSpec.bind(this);
            this.getDisplayComponents = this.getDisplayComponents.bind(this);
            this.getCellModels = this.getCellModels.bind(this);
            this.getTargetDOMElementID = this.getTargetDOMElementID.bind(this);
            this.getServiceBootROMSpec = this.getServiceBootROMSpec.bind(this);
            let filterResponse = constructorFilter.request(request_);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift(`HolisticAppCommonService::constructor failed yielding a zombie instance.`);
            this._private.constructorError = errors.join(" ");
        }
    }

    isValid() { return (!this._private.constructorError); }

    toJSON() { return (this.isValid()?this._private:this._private.constructorError); }

    getAppBuild() { return this.isValid()?this._private.nonvolatile.appCommonDefinition.appData.appBuild:this.toJSON(); }
    getAppMetadataTypeSpecs() { return this.isValid()?this._private.nonvolatile.appMetadata.specs:this.toJSON(); }
    getAppMetadataDigraph() { return this.isValid()?this._private.nonvolatile.appMetadata.accessors.getAppMetadataDigraph():this.toJSON(); }

    getAppMetadataOrg() { return this.isValid()?this._private.nonvolatile.appMetadata.accessors.getAppMetadataOrg():this.toJSON(); }

    getAppMetadataApp() { return this.isValid()?this._private.nonvolatile.appMetadata.accessors.getAppMetadataApp():this.toJSON(); }

    // Returns filter response object.
    getAppMetadataPage(pageURI_) {
        if (!this.isValid()) {
            return { error: this.toJSON() };
        }
        const pageMetadataValue = this._private.nonvolatile.appMetadata.accessors.getAppMetadataPage(pageURI_);
        if (!pageMetadataValue) {
            return { error: `No page metadata found for URI "${pageURI_}".` };
        }
        return { error: null, result: pageMetadataValue };
    }

    // Returns filter response object.
    getAppMetadataHashroute(hashroutePathname_) {
        if (!this.isValid()) {
            return { error: this.toJSON() };
        }
        const hashrouteMetadataValue = this._private.nonvolatile.appMetadata.acessors.getAppMetadataHashroute(hashroutePathname_);
        if (!hashrouteMetadataValue) {
            return { error: `No hashroute metadata found for URI "${hashroutePathname_}".` };
        }
        return { error: null, result: hashrouteMetadataValue };
    }

    getClientUserLoginSessionSpec() {
        return (this.isValid()?this._private.nonvolatile.appCommonDefinition.appTypes.userLoginSession.untrusted.clientUserLoginSessionSpec:this.toJSON());
    }
    getDisplayComponents() { // returns array of @encapsule/d2r2 component wrapper filters for <ComponentRouter/>
        return (this.isValid()?this._private.nonvolatile.coreDisplayComponents:this.toJSON());
    }
    getCellModels() { // returns array of @encapsule/holarchy CellModel instances.
        return (this.isValid()?this._private.nonvolatile.coreCellModels:this.toJSON());
    }
    getTargetDOMElementID() {
        return (this.isValid()?this._private.nonvolatile.appCommonDefinition.appData.appConfig.display.targetDOMElementID:this.toJSON());
    }
    getServiceBootROMSpec() {
        return (this.isValid()?this._private.nonvolatile.serviceBootROMSpec:this.toJSON());
    }

}

module.exports = HolisticServiceCore;

