// HolisticAppCommon.js

const path = require("path");
console.log(`> "${path.resolve(__filename)}" module loading...`);

const constructorFilter = require("./lib/filters/HolisticAppCommon-method-constructor-filter");

// This is a developer-facing API packaged as an ES6 class. The vast majority of the work is done by
// the constructor filter that is responsible for validating, normalizing, and processing the developer-
// specified constructor function inputs into what we call the "holistic cell nucleus".
//
// The "nucleus" is actually an immutable runtime database of usual-suspect artifacts (i.e. data,
// filter specs, filters, actions, operators, apm's, and cell models) that is required by both
// HolisticAppServer and HolisticAppClient ES6 class constructor functions.
//

class HolisticAppCommon {

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
    getAppMetadataDigraph() { return this.isValid()?this._private.nonvolatile.appMetadata.values.digraph:this.toJSON(); }
    getAppMetadataOrg() { return this.isValid()?this.getAppMetadataDigraph().getVertexProperty("__org"):this.toJSON(); }
    getAppMetadataApp() { return this.isValid()?this.getAppMetadataDigraph().getVertexProperty("__app"):this.toJSON(); }
    getAppMetadataPage(pageURI_) {
        if (!this.isValid())
            return this.toJSON();
        const pageProp = this.getAppMetadataDigraph().getVertexProperty(pageURI_);
        return (pageProp?pageProp:`No page metadata defined for pageURI "${pageURI_}".`);
    }
    getAppMetadataHashroute(hashroutePathname_) {
        if (!this.isValid())
            return this.toJSON();
        const hashProp = this.getAppMetadataDigraph().getVertexProperty(hashroutePathname_);
        return (hashProp?hashProp:`No hashroute metadata defined for hashroutePathname "${hashroutePath_}".`);
    }

}

module.exports = HolisticAppCommon;

