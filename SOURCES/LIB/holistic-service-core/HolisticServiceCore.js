// HolisticServiceCore.js

/*(

  PLEASE DO ONLY:

  [ SOURCES/SERVER ] <=== import/require <==== [ SOURCES/COMMON ]          TRUSTED

  ----- app service line of trust ------HTTPS----------PUBLIC INTERNET -----------

  [ SOURCES/CLIENT ] <=== import/require <==== [ SOURCES/COMMON ]        UNTRUSTED

  PLEASE DO NOT:

  [ SOURCES/CLIENT ] <==== import/require <==== [ SOURCES/SERVER ]    BAD PRACTICE: You should not need to ever import/require client code on the server. Shared behavior and/or data needs to live in SOURCES/COMMON.
  [ SOURCES/SERVER ] <==== import/require <==== [ SOURCES/CLIENT ]    POOR PRACTICE: Although there's really no trust issue here it's kind of lazy when you can keep everthing symetric w/pre-build steps in the few cases that you are likely to ever actually need.

  [ SOURCES/COMMON ] <==== import/require <==== [ SOURCES/SERVER ]    BAD PRACTICE: import/require going in the wrong direction - you're just asking for trouble here. take the time to keep your pre-build up-to-date and synthesize sources across trust zones at build-time.
  [ SOURCES/COMMON ] <==== import/require <==== [ SOURCES/CLIENT ]    BAD PRACTICE: import/require going in the wrong direction - code in COMMON is agnostic to Node.js vs Browser tab, and your client code is likely not. If it is, move it to common.

)*/



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
    getAppMetadataPage(pageURI_) { return this.isValid()?this._private.nonvolatile.appMetadata.accessors.getAppMetadataPage(pageURI_):this.toJSON(); }
    getAppMetadataHashroute(hashroutePathname_) { return this.isValid()?this._private.nonvolatile.appMetadata.acessors.getAppMetadataHashroute(hashroutePathname_):this.toJSON(); }
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

