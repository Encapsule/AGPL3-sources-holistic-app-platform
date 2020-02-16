// scm-method-constructor.js

const arccore = require("@encapsule/arccore");
const ObservableProcessController = require("../ObservableProcessController");
const ObservableProcessModel = require("../ObservableProcessModel");
const TransitionOperator = require("../TransitionOperator");
const ControllerAction = require("../ControllerAction");

const indexVertexRoot = "INDEX_ROOT_GzgYOTOESoWb9vDyNSgA4w";
const indexVertices = {
    scm: "INDEX_SCM_K3M5vcN7TQCdonkvj-TfUQ",
    scmZombie: "INDEX_SCM_ZOMBIE_gNOouXQcS2CqpZqVsdFnzw",
    opm: "INDEX_OPM_WEn_h3N4Q-CV3AUpU7c4Dw",
    opmZombie: "INDEX_OPM_ZOMBIE_AMZezCS8TkWLTnUbKQx0Lw",
    top: "INDEX_TOP_I9A9nqRHSOqi_aMfeCyiog",
    topZombie: "INDEX_TOP_ZOMBIE_eq8KY4stRseaq_akM0SlaA",
    cac: "INDEX_CAC_fQRPJmi8SKODgN0vFbPWeg",
    cacZombie: "INDEX_CAC_ZOMBIE_j30iUkg2Q8iK7Fa_mbJYFQ"
};

const factoryResponse = arccore.filter.create({

    operationID: "xbcn-VBLTaC_0GmCuTQ8NA",
    operationName: "SoftwareCellModel::constructor Filter",
    operationDescription: "Filters request descriptor passed to SoftwareRuntimeModel::constructor function.",

    inputFilterSpec: {

        ____label: "Software Cell Model Descriptor",
        ____description: "A request object passed to SoftwareCellModel ES6 class constructor function.",
        ____types: "jsObject",

        SoftwareCellModel: { ____accept: "jsFunction" }, // We build SRM class instances
        SoftwareCellModelInstance: { ____opaque: true }, // Reference to the calling SCM instance's this.

        id: {
            ____label: "Model ID",
            ____description: "A unique version-independent IRUT identifier used to identify this SoftwareModel.",
            ____accept: "jsString" // must be an IRUT
        },

        name: {
            ____label: "Model Name",
            ____description: "A short name used to refer to this SoftwareModel.",
            ____accept: "jsString"
        },

        description: {
            ____label: "Model Description",
            ____description: "A short description of this SoftwareModel.",
            ____accept: "jsString"
        },

        opm: {
            ____label: "Observable Process Model Declaration",
            ____description: "An OPM descriptor (optional) that declares memory and behavior of this software model if specified.",
            ____accept: [ "jsNull", "jsObject" ], // further processed in bodyFunction
            ____defaultValue: null // If opm is left unspecified, then the software model aggregates at least one TransitionOperator or ControllerAction descriptor.
        },

        operators: {
            ____label: "Model Operators",
            ____description: "An optional array of Transition Operator descriptor objects one for each TransitionOperator defined by this software model.",
            ____types: "jsArray",
            ____defaultValue: [],
            TransitionOperator: {
                ____label: "Transition Operator",
                ____description: "Either an TOP descriptor or its corresponding TransitionOperator ES6 class instance.",
                ____accept: "jsObject" // further processed in bodyFunction
            }
        },

        actions: {
            ____label: "Model Actions",
            ____description: "An optional array of controller action descriptor object(s) or equivalent ControllerAction ES6 class instance(s) defined by this software model.",
            ____types: "jsArray",
            ____defaultValue: [],
            ControllerAction: {
                ____label: "Controller Action",
                ____description: "Either an ACT descriptor or its corresponding ControllerAction ES6 class instance.",
                ____accept: "jsObject" // further processed in bodyFunction
            }
        },

        submodels: {
            ____label: "Submodel Registrations",
            ____description: "An optional array of Software Model descriptor object(s) and/or SoftwareModel ES6 class instance(s).",
            ____types: "jsArray",
            ____defaultValue: [],
            submodel: {
                ____label: "Submodel Registration",
                ____description: "A SRM descriptor or equivalent SoftwareRuntimeModel ES6 class instance.",
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
                opmMap: {},
                topMap: {},
                cacMap: {},
                digraph: null,
                warnings: []
            };

            let filterResponse = arccore.graph.directed.create({
                name: `[${request_.id}::${request_.name} SCM Holarchy Digraph`,
                description: `A directed graph model of SCM relationships [${request_.id}::${request_.name}].`,
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

            // PROCESS THE SCM's OPM DECLARATION
            if (request_.opm) {
                const opm = (request_.opm instanceof ObservableProcessModel)?request_.opm:new ObservableProcessModel(request_.opm);
                let opmVertexID = opm.isValid()?opm.getID():`OPM_ZOMBIE_${arccore.identifier.irut.fromEther().result}`;
                if (!response.result.opmMap[opmVertexID]) {
                    response.result.opmMap[opmVertexID] = opm;
                }
                digraph.addVertex({ u: opmVertexID, p: { type: "opm" } });
                digraph.addEdge({ e: { u: opm.isValid()?indexVertices.opm:indexVertices.opmZombie, v: opmVertexID }, p: { type: "opm-index-link" } });
                digraph.addEdge({ e: { u: request_.id, v: opmVertexID }, p: { type: "scm-link" } });
            }

            // PROCESS THE SRM's TOP DECLARATIONS
            for (let i = 0 ; i < request_.operators.length ; i++) {
                const entry = request_.operators[i];
                const top = (entry instanceof TransitionOperator)?entry:new TransitionOperator(entry);
                const topVertexID = top.isValid()?top.getID():`TOP_ZOMBIE_${arccore.identifier.irut.fromEther().result}`;
                if (!response.result.topMap[topVertexID]) {
                    response.result.topMap[topVertexID] = top;
                }
                digraph.addVertex({ u: topVertexID, p: { type: "top" } });
                digraph.addEdge({ e: { u: top.isValid()?indexVertices.top:indexVertices.topZombie, v: topVertexID }, p: { type: "top-index-link" } });
                digraph.addEdge({ e: { u: request_id, v: topVertexID }, p: { type: "scm-link" } });
            }

            // PROCESS THE SRM'S CAC DECLARATIONS
            for (let i = 0 ; i < request_.actions.length ; i++) {
                const entry = request_.actions[i];
                const action = (entry instanceof ControllerAction)?entry:new ControllerAction(entry);
                const actionVertexID = action.isValid()?action.getID():`CAC_ZOMBIE_${arccore.identifier.irut.fromEther().result}`;
                if (!response.result.cacMap[actionVertexID]) {
                    response.result.cacMap[actionVertexID] = action;
                }
                digraph.addVertex({ u: actionVertexID, p: { type: "cac" } });
                digraph.addEdge({ e: { u: cac.isValid()?indexVertices.cac:indexVertices.cacZombie, v: cacVertexID }, p: { type: "cac-index-link" } });
                digraph.addEdge({ e: { u: request_.id, v: cacVertexID }, p: { type: "scm-link" } });
            }

            // PROCESS SUBMODELS (RuntimeCellModel (RCM) for use in a RuntimeCellProcessor (RCP) instance)
            /*
            request._submodels.forEach((submodel_) => {

                let srm = null;

                if (submodel_._private && submodel._private["LMFSviNhR8WQoLvtv_YnbQ"]) {
                    // We know this is a SoftwareRuntimeModel ES6 class instance.
                    srm = submodel_;
                } else {
                    srm = new request_.SoftwareRuntimeModel(submodel_);
                }

                // The srm variable is now set to a reference to a SoftwareRuntimeModel ES6 class instance.

                if (!response.result.srmMap[srm._private.id]) {

                    // We have not already processed this SRM.

                    response.result.srmMap[srm._private.id] = srm;

                    digraph.addVertex({ u: srm._private.id, p: { type: "srm" }});
                    digraph.addEdge({
                        e: {
                            u: srm.isValid()?"INDEX_SRM_K3M5vcN7TQCdonkvj-TfUQ":"INDEX_SRM_ZOMBIE_gNOouXQcS2CqpZqVsdFnzw",
                            v: srm._private.id
                        },
                        p: { type: srm.isValid()?"srm-index-link":"srm-zombie-index-link" }
                    });

                    if (srm.isValid()) {

                        Object.keys(srm._private.srmMap).forEach((srmID_) => {
                            if (!response.result.srmMap[srm._private.id]) {
                                response.result.srmMap[srm._private.id] = srm;
                            }
                        });

                        Object.keys(srm._private.opmMap).forEach((opmID_) => {
                            if (!response.result.opmMap[opmID_]) {
                                response.result.opmMap[opmID_] = srm._private.opmMap[opmID_];
                            }
                        });

                        Object.keys(srm._private.topMap).forEach((topID_) => {
                            if (!response.result.topMap[topID_]) {
                                response.result.topMap[topID_] = srm._private.topMap[topID_];
                            }
                        });

                        Object.keys(srm._private.cacMap).forEach((cacID_) => {
                            if (!response.result.cacMap[cacID_]) {
                                response.result.cacMap[cacID_] = srm._private.cacMap[cacID_];
                            }
                        });

                        digraph.fromObject(srm._private.digraph.toJSON());

                    } // srm.isValid()

                } // srm not already registered

            }); // forEach submodels
            DISABLED FOR NOW */


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
