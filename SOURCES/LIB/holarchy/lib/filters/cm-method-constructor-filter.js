// scm-method-constructor.js

const arccore = require("@encapsule/arccore");
const ObservableProcessController = require("../ObservableProcessController");
const AbstractProcessModel = require("../AbstractProcessModel");
const TransitionOperator = require("../TransitionOperator");
const ControllerAction = require("../ControllerAction");

const indexVertexRoot = "INDEX_ROOT_GzgYOTOESoWb9vDyNSgA4w";
const indexVertices = {
    scm: "INDEX_SCM_K3M5vcN7TQCdonkvj-TfUQ",
    apm: "INDEX_APM_WEn_h3N4Q-CV3AUpU7c4Dw",
    top: "INDEX_TOP_I9A9nqRHSOqi_aMfeCyiog",
    act: "INDEX_ACT_fQRPJmi8SKODgN0vFbPWeg",
};

const factoryResponse = arccore.filter.create({

    operationID: "xbcn-VBLTaC_0GmCuTQ8NA",
    operationName: "CellModel::constructor Filter",
    operationDescription: "Filters request descriptor passed to CellModel::constructor function.",

    inputFilterSpec: {

        ____label: "Cell Model Descriptor",
        ____description: "A request object passed to CellModel ES6 class constructor function.",
        ____types: "jsObject",

        CellModel: { ____accept: "jsFunction" }, // We build CM class instances
        CellModelInstance: { ____opaque: true }, // Reference to the calling CM instance's this.

        id: {
            ____label: "Model ID",
            ____description: "A unique version-independent IRUT identifier used to identify this CellModel.",
            ____accept: "jsString" // must be an IRUT
        },

        name: {
            ____label: "Model Name",
            ____description: "A short name used to refer to this CellModel.",
            ____accept: "jsString"
        },

        description: {
            ____label: "Model Description",
            ____description: "A short description of this CellModel.",
            ____accept: "jsString"
        },

        apm: {
            ____label: "Cell Model Behaviors",
            ____description: "An optional APM descriptor that if provided will be used to ascribe memory and/or higher-order observable process behaviors to this CellModel.",
            ____accept: [ "jsNull", "jsObject" ], // further processed in bodyFunction
            ____defaultValue: null // If null, then a valid CM defines at least one TOP or ACT.
        },

        operators: {
            ____label: "Cell Model Operators",
            ____description: "An optional array of Transition Operator descriptor objects one for each TransitionOperator defined by this CellModel.",
            ____types: "jsArray",
            ____defaultValue: [],
            TransitionOperator: {
                ____label: "Transition Operator",
                ____description: "Either an TOP descriptor or its corresponding TransitionOperator ES6 class instance.",
                ____accept: "jsObject" // further processed in bodyFunction
            }
        },

        actions: {
            ____label: "Cell Model Actions",
            ____description: "An optional array of controller action descriptor object(s) or equivalent ControllerAction ES6 class instance(s) defined by this CellModel.",
            ____types: "jsArray",
            ____defaultValue: [],
            ControllerAction: {
                ____label: "Controller Action",
                ____description: "Either an ACT descriptor or its corresponding ControllerAction ES6 class instance.",
                ____accept: "jsObject" // further processed in bodyFunction
            }
        },

        subcells: {
            ____label: "Subcell Model Registrations",
            ____description: "An optional array of Cell Model descriptor object(s) and/or CellModel ES6 class instance(s).",
            ____types: "jsArray",
            ____defaultValue: [],
            subcell: {
                ____label: "Subcell Model Registration",
                ____description: "A Cell Model descriptor or equivalent CellModel ES6 class instance.",
                ____accept: "jsObject" // further processed in bodyFunction
            }
        }

    }, // inputFilterSpec


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
            response.result = {
                "LMFSviNhR8WQoLvtv_YnbQ": true, // non-intrusive output type identifier
                id: request_.id,
                name: request_.name,
                description: request_.description,
                scmMap: {},
                apmMap: {},
                topMap: {},
                actMap: {},
                digraph: null
            };

            // ================================================================
            // Create DirectedGraph to index all the assets and give us an easy way to look things up.
            let filterResponse = arccore.graph.directed.create({
                name: `[${request_.id}::${request_.name} SCM Holarchy Digraph`,
                description: `A directed graph model of CM relationships [${request_.id}::${request_.name}].`,
                vlist: [
                    { u: indexVertexRoot, p: { type: "index" } },
                    { u: request_.id, p: { type: "scm" } } // This SCM. We need to add this is index on exit from this function
                ]
            });
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            let digraph = response.result.digraph = filterResponse.result;
            Object.keys(indexVertices).forEach((key_) => {
                digraph.addVertex({ u: indexVertices[key_], p: { type: "index" } });
                digraph.addEdge({ e: { u: indexVertexRoot, v: indexVertices[key_] }, p: { type: "root-index-link" } });
            });

            // ================================================================
            // PROCESS CellModel SUBCELL DEPENDENCIES
            request_.subcells.forEach((subcell_) => {
                let cell = null;
                if (subcell_._private && subcell._private["LMFSviNhR8WQoLvtv_YnbQ"]) {
                    // We know this is a CellModel ES6 class instance.
                    cell = subcell_;
                } else {
                    // We presume this is a Software Cell Descriptor (i.e. constructor request object).
                    cell = new request_.CellModel(subcell_);
                }
                // cell is now a CellModel ES6 class instance.
                const cellID = cell.getID();
                // Have we previously processed this CellModel definition?
                if (!response.result.scmMap[cellID]) {
                    // We have not.
                    response.result.scmMap[cellID] = { scm: request_.id, cell: cell };
                    digraph.addVertex({ u: cellID, p: { type: "scm" }});
                }
                digraph.addEdge({ e: { u: vertexIndices.scm, v: cellID }, p: { type: "scm-index-link" } });
                response.result.scmMap = Object.assign(response.result.scmMap, cell._private.scmMap);
                response.result.apmMap = Object.assign(response.result.apmMap, cell._private.apmMap);
                response.result.topMap = Object.assign(response.result.topMap, cell._private.topMap);
                response.result.actMap = Object.assign(response.result.actMap, cell._private.actMap);
                digraph.fromObject(cell._private.digraph.toJSON());
            }); // forEach subcell

            // ================================================================
            // PROCESS AbstractProcessModel ASSOCIATION
            if (request_.apm) {
                let apmVertexID = null;
                const apm = (request_.apm instanceof AbstractProcessModel)?request_.apm:new AbstractProcessModel(request_.apm);
                if (!apm.isValid) {
                    errors.push("The AbstractProcessModel you are attempting to associate with this new CellModel instance is invalid!");
                    errors.push(apm.toJSON()); // constructor error string
                } else {
                    const apmVertexID = apm.getID();
                    if (!response.result.apmMap[apmVertexID]) { response.result.apmMap[apmVertexID] = { scm: request_.id, apm: apm }; }
                    digraph.addVertex({ u: apmVertexID, p: { type: "apm" } });
                    digraph.addEdge({ e: { u: indexVertices.apm, v: apmVertexID }, p: { type: "apm-index-link" } });
                    digraph.addEdge({ e: { u: request_.id, v: apmVertexID }, p: { type: "scm-link" } });
                }
            }

            // ================================================================
            // PROCESS TransitionOperator ASSOCIATIONS
            for (let i = 0 ; i < request_.operators.length ; i++) {
                const entry = request_.operators[i];
                const top = (entry instanceof TransitionOperator)?entry:new TransitionOperator(entry);
                if (!top.isValid()) {
                    errors.push(`TransitionOperator registration at request path ~.operators[${i}] is an invalid instance due to constructor error:`);
                    errors.push(top.toJSON()); // constructor error string
                } else {
                    const topVertexID = top.getID();
                    if (!response.result.topMap[topVertexID]) { response.result.topMap[topVertexID] = { scm: request_.id, top: top }; }
                    digraph.addVertex({ u: topVertexID, p: { type: "top" } });
                    digraph.addEdge({ e: { u: indexVertices.top, v: topVertexID }, p: { type: "top-index-link" } });
                    digraph.addEdge({ e: { u: request_.id, v: topVertexID }, p: { type: "scm-link" } });
                }
            }

            // ================================================================
            // PROCESS ControllerAction ASSOCIATIONS
            for (let i = 0 ; i < request_.actions.length ; i++) {
                const entry = request_.actions[i];
                const action = (entry instanceof ControllerAction)?entry:new ControllerAction(entry);
                if (!action.isValid()) {
                    errors.push(`ControllerAction registration at request path ~.actions[${i}] is an invalid instance due to constructor error:`);
                    errors.push(top.toJSON()); // constructor error string
                } else {
                    const actVertexID = action.getID();
                    if (!response.result.actMap[actVertexID]) { response.result.actMap[actVertexID] = { scm: request_.id, act: action }; }
                    digraph.addVertex({ u: actVertexID, p: { type: "act" } });
                    digraph.addEdge({ e: { u: indexVertices.act, v: actVertexID }, p: { type: "act-index-link" } });
                    digraph.addEdge({ e: { u: request_.id, v: actVertexID }, p: { type: "scm-link" } });
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
                    arccore.util.dictionaryLength(response.result.scmMap) +
                    arccore.util.dictionaryLength(response.result.apmMap) +
                    arccore.util.dictionaryLength(response.result.topMap) +
                    arccore.util.dictionaryLength(response.result.actMap);

                if (!registrations) {
                    // LOL...
                    errors.push(`Heretical attempt to associate IRUT ID '${request_.id}' with the root of all CellModel's, [0000000000000000000000::Nothingness].`);
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