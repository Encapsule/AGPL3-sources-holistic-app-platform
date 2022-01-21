// cellspace.js

// 2022.01.13 chrisrus - This is a small little bit of code written to make it simpler
// to address various test artifacts. This was written prior to CellModelArtifactSpace
// class. Coming back to this, it's not 100% clear to me that the simplicity of this
// approach is inferior. In the general case, this is a mathematical manifold problem
// that is I think I should personally avoid working on unless I am getting paid.

const arccore = require("@encapsule/arccore");

const space = { name: "Cell Proxy / Shared Process Test Space", id: "j450oO5FRF6GOiYYcuh6cw" };

module.exports = {
    cmID: function(name_) {
        const coordinate = {
            ...space,
            axis: "form",
            instance: name_
        };
        return arccore.identifier.irut.fromReference(coordinate).result;
    },
    apmID: function(name_) {
        const coordinate = {
            ...space,
            axix: "function",
            instance: name_
        };
        return arccore.identifier.irut.fromReference(coordinate).result;

    }
};
