// scm-method-constructor.js

const arccore = require("@encapsule/arccore");
const ObservableProcessController = require("../ObservableProcessController");
const AbstractProcessModel = require("../AbstractProcessModel");
const TransitionOperator = require("../TransitionOperator");
const ControllerAction = require("../ControllerAction");


const indexVertices = {
    cm:  "INDEX_CM",
    apm: "INDEX_APM",
    top: "INDEX_TOP",
    act: "INDEX_ACT"
};


const inputFilterSpec = require("./iospecs/cm-method-constructor-input-spec");
const outputFilterSpec = require("./iospecs/cm-method-constructor-output-spec");

const factoryResponse = arccore.filter.create({

    operationID: "xbcn-VBLTaC_0GmCuTQ8NA",
    operationName: "CellModel::constructor Filter",
    operationDescription: "Filters request descriptor passed to CellModel::constructor function.",

    inputFilterSpec,
    outputFilterSpec,

    bodyFunction: (request_) => {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {

            inBreakScope = true;

            let idResponse = arccore.identifier.irut.isIRUT(request_.id);
            if (idResponse.error) {
                errors.push("Bad SMR ID specified:");
                errors.push(idResponse.error);
                break;
            }
            if (!idResponse.result) {
                errors.push("Bad SMR ID specified:");
                errors.push(idResponse.guidance);
            }

            // Optimistically initialize the response.result object.

            console.log(`CellModel::constructor [${request_.id}::${request_.name}]`);

            response.result = {
                "LMFSviNhR8WQoLvtv_YnbQ": true, // non-intrusive output type identifier
                id: request_.id,
                name: request_.name,
                description: request_.description,
                cmMap: {},
                apmMap: {},
                topMap: {},
                actMap: {},
                digraph: null
            };

            // ================================================================
            // Create DirectedGraph to index all the assets and give us an easy way to look things up.
            let filterResponse = arccore.graph.directed.create({
                name: `[${request_.id}::${request_.name} CM Holarchy Digraph`,
                description: `A directed graph model of CM relationships [${request_.id}::${request_.name}].`,
                vlist: Object.keys(indexVertices).map( (key_) => { return { u: indexVertices[key_], p: { type: "INDEX" } }; })
            });
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            let digraph = response.result.digraph = filterResponse.result;

            digraph.addVertex({ u: request_.id, p: { type: "CM" }}); // Add this CellModel to the digraph.
            digraph.addEdge({ e: { u: indexVertices.cm, v: request_.id }, p: { type: `${indexVertices.cm}::CM` }}); // Link the CellModel to the CellModel index.

            // ================================================================
            // PROCESS SUB-CellModel DEPENDENCIES
            for (let i = 0 ; i < request_.subcells.length ; i++) {
                const subcell_ = request_.subcells[i];
                const cellID = (subcell_ instanceof request_.CellModel)?subcell_.getID():subcell_.id; // potentially this is a constructor error
                let cell = null; // CellModel ES6 class instance
                if (!response.result.cmMap[cellID]) {
                    // Theoretically we've not seen this CellModel registration before. So, we shouldn't be able to find any vertex with this IRUT ID in our digraph.
                    if (digraph.isVertex(cellID)) {
                        errors.push(`Subcell definition ~.subcells[${i}] specifies an invalid duplicate IRUT identifier id='${cellID}'.`);
                        errors.push(`IRUT '${cellID}'previously registered a ${digraph.getVertexProperty(cellID).type} resource.`);
                        continue;
                    }
                    cell = (subcell_ instanceof request_.CellModel)?subcell_:new request_.CellModel(subcell_);
                    if (!cell.isValid()) {
                        errors.push(`CellModel definition ~.subcells[${i}] with id='${cellID}' is invalid due to constructor error:`);
                        errors.push(cell.toJSON());
                        continue;
                    }
                    // This establishes this CellModel's baseline truth for this submodel.
                    response.result.cmMap[cellID] = { cm: cellID, cell: cell }; // Add the subcell CellModel instance to this CellModel's cmMap.
                    digraph.addVertex({ u: cellID, p: { type: "CM" }}); // Add a vertex in this CellModel's digraph to represent the subcell.
                    digraph.addEdge({ e: { u: indexVertices.cm, v: cellID }, p: { type: `${indexVertices.cm}::CM` }}); // Link the subcell's vertex to the CellModel index.
                    digraph.addEdge({ e: { u: request_.id, v: cellID }, p: { type: "CM::CM" }}); // u (this cell) depends on v (subcell)

                    // Ingest subcell APM
                    response.result.apmMap = Object.assign(response.result.apmMap, cell._private.apmMap);

                    // Ingest subcell TOP
                    response.result.topMap = Object.assign(response.result.topMap, cell._private.topMap);

                    // Ingest subcell ACT
                    response.result.actMap = Object.assign(response.result.actMap, cell._private.actMap);

                    // Ingest subcell subcells
                    response.result.cmMap = Object.assign(response.result.cmMap, cell._private.cmMap);

                    // Extend our digraph
                    digraph.fromObject(cell._private.digraph.toJSON());

                } else {
                    // TODO: Deep inspect the two ES6 class instances for identity.
                    cell = response.result.cmMap[cellID];
                }

            } // forEach subcell

            // ================================================================
            // PROCESS AbstractProcessModel ASSOCIATION
            if (request_.apm) {
                const apmID = (request_.apm instanceof AbstractProcessModel)?request_.apm.getID():request_.apm.id;
                let apm = null;
                if (!response.result.apmMap[apmID]) {
                    if (digraph.isVertex(apmID)) {
                        errors.push(`AbstractProcessModel definition ~.apm specifies an invalid duplicate IRUT identifier id='${apmID}'.`);
                    } else {
                        apm = (request_.apm instanceof AbstractProcessModel)?request_.apm:new AbstractProcessModel(request_.apm);
                        if (!apm.isValid()) {
                            errors.push(`AbstractProcessModel definition ~.apm with id='${apmID}' is invalid due to constructor error:`);
                            errors.push(apm.toJSON());
                        } else {
                            response.result.apmMap[apmID] = { cm: request_.id, apm: apm };
                            digraph.addVertex({ u: apmID, p: { type: "APM" } });
                            digraph.addEdge({ e: { u: indexVertices.apm, v: apmID }, p: { type: `${indexVertices.apm}::APM`} });
                            digraph.addEdge({ e: { u: request_.id, v: apmID }, p: { type: "CM::APM" } });
                        }
                    }
                } else {
                    apm = response.result.apmMap[apmID];
                    digraph.addEdge({ e: { u: request_.id, v: apmID }, p: { type: "CM::APM" } });
                }
            }

            // ================================================================
            // PROCESS TransitionOperator ASSOCIATIONS
            for (let i = 0 ; i < request_.operators.length ; i++) {
                const entry = request_.operators[i];
                const entryID = (entry instanceof TransitionOperator)?entry.getID():entry.id; // potentially this is a constructor error
                let top = null; // TransitionOperator ES6 class instance
                if (!response.result.topMap[entryID]) {
                    if (digraph.isVertex(entryID)) {
                        errors.push(`TransitionOperator definition ~.operators[${i}] specifies an invalid duplicate IRUT identifier id='${entryID}'.`);
                        continue;
                    }
                    top = (entry instanceof TransitionOperator)?entry:new TransitionOperator(entry);
                    if (!top.isValid()) {
                        errors.push(`TransitionOperator definition ~.operators[${i}] is invalid due to constructor error:`);
                        errors.push(top.toJSON());
                        continue;
                    }
                    response.result.topMap[entryID] = { cm: request_.id, top: top };
                    digraph.addVertex({ u: entryID, p: { type: "TOP" } });
                    digraph.addEdge({ e: { u: indexVertices.top, v: entryID }, p: { type: `${indexVertices.top}::TOP` } });
                    digraph.addEdge({ e: { u: request_.id, v: entryID }, p: { type: "CM::TOP" } });

                } else {
                    top = response.result.topMap[entryID];
                    digraph.addEdge({ e: { u: request_.id, v: entryID }, p: { type: "CM::TOP" } });
                }
            }

            // ================================================================
            // PROCESS ControllerAction ASSOCIATIONS
            for (let i = 0 ; i < request_.actions.length ; i++) {
                const entry = request_.actions[i];
                const entryID = (entry instanceof ControllerAction)?entry.getID():entry.id; // potentially this is a constructor error
                let act = null; // ControllerAction ES6 class instance
                if (!response.result.actMap[entryID]) {
                    if (digraph.isVertex(entryID)) {
                        errors.push(`ControllerAction definition ~.actions[${i}] specifies an invalid duplicate IRUT identifier id='${entryID}'.`);
                        continue;
                    }
                    act = (entry instanceof ControllerAction)?entry:new ControllerAction(entry);
                    if (!act.isValid()) {
                        errors.push(`ControllerAction definition ~.actions[${i}] is invalid due to constructor error:`);
                        errors.push(act.toJSON());
                        continue;
                    }
                    response.result.actMap[entryID] = { cm: request_.id, act: act };
                    digraph.addVertex({ u: entryID, p: { type: "ACT" } });
                    digraph.addEdge({ e: { u: indexVertices.act, v: entryID }, p: { type: `${indexVertices.act}::ACT` } });
                    digraph.addEdge({ e: { u: request_.id, v: entryID }, p: { type: "CM::ACT" } });

                } else {
                    act = response.result.actMap[entryID];
                    digraph.addEdge({ e: { u: request_.id, v: entryID }, p: { type: "CM::ACT" } });
                }
            }

            // ================================================================
            // EPILOGUE

            // TODO: Downgrade registration errors to warnings that can be optionally
            // used to block construction of CellModel instances (e.g. under in a production
            // test build). Current behavior is to block construction on accumulation of
            // any registration error(s) that may occur during processing of the Cell Model
            // definition descriptor, request_.
            //

            if (!errors.length) {
                let registrations =
                    arccore.util.dictionaryLength(response.result.cmMap) +
                    arccore.util.dictionaryLength(response.result.apmMap) +
                    arccore.util.dictionaryLength(response.result.topMap) +
                    arccore.util.dictionaryLength(response.result.actMap);

                if (!registrations) {
                    errors.push(`You cannot create a CellModel with id='${request_.id} that does nothing (i.e. has no artifact registrations whatsoever).`);
                }
            }

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
