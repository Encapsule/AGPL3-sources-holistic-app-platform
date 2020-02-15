// scm-method-constructor.js

const arccore = require("@encapsule/arccore");
const ObservableProcessController = require("../ObservableProcessController");
const ObservableProcessModel = require("../ObservableProcessModel");
const TransitionOperator = require("../TransitionOperator");
const ControllerAction = require("../ControllerAction");

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
                srmMap: {},
                opmMap: {},
                topMap: {},
                cacMap: {},
                digraph: null,
                warnings: []
            };

            const indexRootVertex =  { u: "INDEX_ROOT_GzgYOTOESoWb9vDyNSgA4w", p: { type: "index" } };
            const thisSRMVertex = { u: request_.id, p: { type: "srm" } };

            let filterResponse = arccore.graph.directed.create({
                name: `[${request_.id}::${request_.name} SMR`,
                description: `A directed graph model of SMR [${request_.id}::${request_.name}].`,
                vlist: [ indexRootVertex, thisSRMVertex ]
            });
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            let digraph = response.result.digraph = filterResponse.result;

            [
                { u: "INDEX_SRM_K3M5vcN7TQCdonkvj-TfUQ", p: { type: "index" } },
                { u: "INDEX_SRM_ZOMBIE_gNOouXQcS2CqpZqVsdFnzw", p: { type: "index" } },

                { u: "INDEX_OPM_WEn_h3N4Q-CV3AUpU7c4Dw", p: { type: "index" } },
                { u: "INDEX_OPM_ZOMBIE_AMZezCS8TkWLTnUbKQx0Lw", p: { type: "index" } },

                { u: "INDEX_TOP_I9A9nqRHSOqi_aMfeCyiog", p: { type: "index" } },
                { u: "INDEX_TOP_ZOMBIE_eq8KY4stRseaq_akM0SlaA", p: { type: "index" } },

                { u: "INDEX_CAC_fQRPJmi8SKODgN0vFbPWeg", p: { type: "index" } },
                { u: "INDEX_CAC_ZOMBIE_j30iUkg2Q8iK7Fa_mbJYFQ", p: { type: "index" } }
            ].forEach((indexVertexDescriptor_) => {
                digraph.addVertex(indexVertexDescriptor_);
                digraph.addEdge({ e: { u: indexRootVertex.u, v: indexVertexDescriptor_.u }, p: { type: "root-index-link" } });
            });
            console.log(digraph);

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

            // PROCESS THE SRM's OPM DECLARATION
            if (request_.opm) {

                let opm = null; // Get a ObserableProcessModel ES6 class instance.
                if (request_.opm instanceof ObservableProcessModel) {
                    opm = request_.opm;
                } else {
                    opm = new ObservableProcessModel(request_.opm);
                }

                // If !opm.isValid() then we cannot query its ID. So, we have to make one up.
                let opmVertexID = null;
                if (opm.isValid()) {
                    opmVertexID = opm.getID();
                } else {
                    opmVertexID = `OPM_ZOMBIE_${arccore.identifier.irut.fromEther().result}`;
                }


            }

            // PROCESS THE SRM's TOP DECLARATIONS

            // PROCESS THE SRM'S CAC DECLARATIONS



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
