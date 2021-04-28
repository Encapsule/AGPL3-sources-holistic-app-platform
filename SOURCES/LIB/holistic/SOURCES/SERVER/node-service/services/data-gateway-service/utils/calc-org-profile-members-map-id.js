const arcccore = require("@encapsule/arccore");

const getOrgProfileMembersMapId = (orgId) => {
    return arcccore.identifier.irut.fromReference(
        orgId.concat(".", "1venRla2StKcLUWOD3YgFw_OrgProfileMembersMap")
    ).result;
};

module.exports = getOrgProfileMembersMapId;