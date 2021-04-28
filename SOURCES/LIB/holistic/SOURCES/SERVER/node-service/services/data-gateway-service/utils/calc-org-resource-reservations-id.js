const arcccore = require("@encapsule/arccore");

const getOrgResourceReservationsId = (orgId) => {
    return arcccore.identifier.irut.fromReference(
        orgId.concat(".", "v6_UYAIDSFOzawfP0EYdQQ_OrgResourceReservationsId")
    ).result;
};

module.exports = getOrgResourceReservationsId;