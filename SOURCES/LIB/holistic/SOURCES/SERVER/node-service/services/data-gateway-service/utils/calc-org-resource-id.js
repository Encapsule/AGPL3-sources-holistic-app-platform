const arcccore = require("@encapsule/arccore");

const getOrgResourceId = (orgId) => {
    return arcccore.identifier.irut.fromReference(
        orgId.concat(".", "VkcTlGq3RiOaGqOdEkMgag_OrgResourceId")
    ).result;
};

module.exports = getOrgResourceId;