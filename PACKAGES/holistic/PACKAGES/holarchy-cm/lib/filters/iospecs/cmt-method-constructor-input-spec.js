"use strict";

// cmt-method-constructor-input-spec.js
module.exports = {
  ____label: "CellModelTemplate::constructor Request",
  ____description: "Request object value passed to CellModelTemplate::constructor function.",
  ____types: "jsObject",
  cmasBaseScope: {
    ____label: "CellModelTemplate Instance Base Artifact Space",
    ____description: "The CellModelArtifactSpace that an instance of this CellModelTemplate should subspace when synthesizing CellModel instances.",
    // Typically, the cmas reference will be @encapsule/holistic RTL package, or derived app service scope CellModelArtifactSpace instance.
    ____accept: "jsObject" // Either a CellModelAddressSpace::constructor request object. Or, a CellModelAddressSpace class instance.

  },
  templateLabel: {
    ____label: "CellModelTemplate Instance Label",
    ____description: "A unique and stable label (no spaces, legal JavaScript variable name token) that refers to the family of CellModel that may be synthesized by calling the constructed CellModelTemplate instance's synthesizeCellModel method.",
    ____accept: "jsString" // Note that the CellModelTemplate instance's base CellModelArtifactSpace class constructor will be called with cmasScope.makeSubspaceInstance({ spaceLabel: templateLabel })

  },
  generateCellModelFilterInputSpec: {
    ____label: "CellModelTemplate::synthesizeCellModel Generator Input Spec",
    ____description: "An @encapsule/arccore.filter inputFilterSpec that defines the request format for CellModelTemplate::synthesizeCellModel method.",
    ____accept: "jsObject" // This will be an @encapsule/arccore.filter spec object.

  },
  generateCellModelFilterBodyFunction: {
    ____label: "CellModelTemplate::synthesizeCellModel Generator bodyFunction",
    ____description: "An @encapsule/arccore.filter bodyFunction that implements some transformation from the request descriptor pass to CellModelTemplate::synthesizeCellModel to CellModel::constructor request descriptor.",
    ____accept: "jsFunction"
  }
};