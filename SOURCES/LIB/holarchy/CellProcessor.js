
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

    // RUNTIME API FOR CellProcessor class instance.

    isValid() { return (!this._private.constructorError); }

    toJSON() { return (this.isValid()?this._private:this._private.constructorError); }

    act(request_) { return (this.isValid()?actFilter.request({ ...request_, opcRef: this._private.opc }):{ error: this.toJSON() }); }


    // DEVELOPER API FOR ad-hoc inspection of CellProcessor class instance.
    // WARNING: DO NOT WRITE CODE THAT CALLS DEVELOPER API!
    // This is especially true for any tests. I reserve the right to change these
    // for whatever purpose at any time the change is required to unblock.
    // IF YOU NEED THIS INFO INSIDE CELLPROCESSOR: No you don't. Or, at least
    // not like this and not this way. Talk to me before you attempt self
    // introspection; there are serious system stability concerns as well as a
    // number of unresolved issues regarding CellProcessor instance serialization/
    // deserialization that must be handled w/utmost care in order to safely
    // build a single generic solution for CellProcessor instance self-introspection
    // that is useful for developers. And, that we can register and
    // activate conditionally only in development builds (and otherwise not due to
    // performance and runtime cellplane stability concerns; customers never see it).

    get devInfo() { // Dump CellProcessor instance information to console.log
        if (!this.isValid()) {
            return this.toJSON();
        }
        console.log(`CellProcessor<[${this._private.cm.getID()}::${this._private.cm.getVDID()}::${this._private.cm.getName()}]> CellProcessor instance metadata:`);
        return {
            id: this._private.opc._private.id,
            iid: this._private.opc._private.iid,
            name: this._private.opc._private.name,
            description: this._private.opc._private.description,
            evalCount: this._private.opc._private.evalCount,
            options: this._private.opc._private.options,
            actorStack: this._private.opc._private.opcActorStack
        };
    }

    get devArtifacts() { // Dump CellProcessManager's CellModel artifact config report to console.log
        if (!this.isValid()) {
            return this.toJSON();
        }
        console.log(`CellProcessor<[${this._private.cm.getID()}::${this._private.cm.getVDID()}::${this._private.cm.getName()}]> instance CellModel artifact digraph:`);
        return this._private.cm.getCMConfig();
    }

    get devData() { // Dump CellProcessor instance cellplane data to console.log
        if (!this.isValid()) {
            return this.toJSON();
        }
        console.log(`CellProcessor<[${this._private.cm.getID()}::${this._private.cm.getVDID()}::${this._private.cm.getName()}]> instance cellplane memory data:`);
        return this._private.opc._private.ocdi._private.storeData;
    }

    get devSpec() { // Dump CellProcessor instance cellplane data filter specification to console.log
        if (!this.isValid()) {
            return this.toJSON();
        }
        console.log(`CellProcessor<[${this._private.cm.getID()}::${this._private.cm.getVDID()}::${this._private.cm.getName()}]> instance cellplane memory specification:`);
        return this._private.opc._private.ocdi._private.storeDataSpec;
    }

    get devCells() { // Dump CellProcessor instance mapping between registered AbstractProcessModel (APM) instances and cellplane binding paths to console.log
        if (!this.isValid()) {
            return this.toJSON();
        }
        console.log(`CellProcessor<[${this._private.cm.getID()}::${this._private.cm.getVDID()}::${this._private.cm.getName()}]> instance cellplane cell map:`);
        return this._private.opc._private.opmiSpecPaths.reduce(function(cellMap_, opciCellBinding_) { cellMap_[opciCellBinding_.specPath] = opciCellBinding_.opmiRef; return cellMap_; }, {});
    }

    get devLastEval() {
        if (!this.isValid()) {
            return this.toJSON();
        }
        console.log(`CellProcessor<[${this._private.cm.getID()}::${this._private.cm.getVDID()}::${this._private.cm.getName()}]> instance last cellplane evaluation telemetry data:`);
        return this._private.opc._private.lastEvalResponse;
    }

    get devProcesses() { // Dump CellProcessor instance CellProcessManager (apmBindingPath === "~") owned (activated via CellProcessor.process.activate) and shared (activated via CellProcessor.proxy.connect) cell process digraphs (advanced).
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
