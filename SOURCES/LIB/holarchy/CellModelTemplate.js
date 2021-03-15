// CellModelTemplate.js

(function() {

    const constructorFilter = require("./lib/filters/cmt-method-constructor-filter");

    class CellModelTemplate {

        constructor(request_) {
            const filterResponse = constructorFilter.request(request_);
            this._private = !filterResponse.error?{ ...this._private, ...filterResponse.result }:{ constructorError: filterResponse.error };
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.synthesizeCellModel = this.synthesizeCellModel.bind(this);
        }

        isValid() {
            return (this._private.constructorError)?false:true;
        }

        toJSON() {
            return (this.isValid()?this._private:this._private.constructorError);
        }

        synthesizeCellModel(request_) {
            return (this.isValid()?this._private.cellModelGeneratorFilter.request({ ...request_, cmtClass: CellModelTemplate, cmtInstance: this }):{ error: this.toJSON() });
        }

    }

    module.exports = CellModelTemplate;


})();

