
/*
  O       o O       o O       o
  | O   o | | O   o | | O   o |
  | | O | | | | O | | | | O | |
  | o   O | | o   O | | o   O |
  o       O o       O o       O
*/

// @encapsule/holarchy Copyright (C) 2021 Christopher D. Russell for Encapsule Project

// CellProcessor.js

const constructorFilter = require("./lib/filters/cp-method-constructor-filter");
const actFilter = require("./lib/filters/cp-method-act-filter");

// TODO: use this or remove this (likely the later soon)
// const logger = require("./lib/util/holarchy-logger-filter");

module.exports = class CellProcessor {

    constructor(request_) {
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            this._private = { constructorError: null };
            this.isValid = this.isValid.bind(this);
            this.toJSON = this.toJSON.bind(this);
            this.act = this.act.bind(this);

            let filterResponse = constructorFilter.request(request_);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            this._private = filterResponse.result;
            break;
        }
        if (errors.length) {
            errors.unshift(`CellProcessor::constructor for [${(request_ && request_.id)?request_.id:"unspecified"}::${(request_ && request_.name)?request_.name:"unspecified"}] failed yielding a zombie instance.`);
            this._private.constructorError = errors.join(" ");
        }
    }

    isValid() { return (!this._private.constructorError); }

    toJSON() { return (this.isValid()?this._private:this._private.constructorError); }

    act(request_) { return (this.isValid()?actFilter.request({ ...request_, opcRef: this._private.opc }):{ error: this.toJSON() }); }

    get memory() {
        return (!this.isValid()?this.toJSON():(this.toJSON().opc.toJSON().ocdi.toJSON()));
    }

    get processes() {
        if (!this.isValid()) {
            return this.toJSON();
        }

        const cpmMemory = this._private.opc._private.ocdi._private.storeData["x7pM9bwcReupSRh0fcYTgw_CellProcessor"];

        return {
            ownedCellProcessesDigraph: cpmMemory.ownedCellProcesses.digraph.toJSON(),
            sharedCellProcessesDigraph: cpmMemory.sharedCellProcesses.digraph.toJSON()
        };

    }


} // class CellProcessor
