// CellModelTemplate.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const constructorFilter = require("./lib/filters/cmt-method-constructor-filter");

    class CellModelTemplate extends holarchy.CellModelArtifactSpace {

        constructor(request_) {
            const filterResponse = constructorFilter.request(request_);
            super(filterResponse.result);
            this._private = !filterResponse.error?filterResponse.result:{ constructorError: filterResponse.error };
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
        }

        isValid() {
            return (this._private.constructorError)?false:true;
        }

        toJSON() {
            return (this.isValid()?this._private:this._private.constructorError);
        }

    }

    module.exports = CellModelTemplate;


})();

