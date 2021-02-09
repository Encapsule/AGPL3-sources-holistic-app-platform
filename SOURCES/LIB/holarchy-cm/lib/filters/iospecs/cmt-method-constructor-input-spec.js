// cmt-method-constructor-input-spec.js

module.exports = {
    ____label: "CellModelTemplate::constructor Request",
    ____description: "Request object value passed to CellModelTemplate::constructor function.",
    ____types: "jsObject",

    cmasScope: {
        ____label: "CellModel Artifact Space",
        ____description: "Instances of this CellModelTemplate class will synthesize CellModel(s) in the CellModelArtifactScope specified by cmasScope.",
        // e.g. To create a CellModelTemplate class instance that synthesizes CellModel(s) into CellModelArtifactSpace({
        ____accept: "jsObject", // Either a CellModelAddressSpace::constructor request object. Or, a CellModelAddressSpace class instance.
    },

    synthesizeMethodRequestSpec: {
        ____label: "CellModelTemplate::synthesizeCellModel Request Spec",
        ____description: "An @encapsule/arccore.filter inputFilterSpec that defines the request format for CellModelTemplate::synthesizeCellModel method.",
        ____accept: "jsObject" // This will be an @encapsule/arccore.filter spec object.
    },

    synthesizeMethodBodyFunction: {
        ____label: "CellModelTemplate::synthesizeCellModel Method bodyFunction",
        ____description: "An @encapsule/arccore.filter bodyFunction that implements some transformation from the request descriptor pass to CellModelTemplate::synthesizeCellModel to CellModel::constructor request descriptor.",
        ____accept: "jsFunction"
    }

};

