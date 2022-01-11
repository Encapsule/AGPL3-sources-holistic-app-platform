// cellspace.js

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
