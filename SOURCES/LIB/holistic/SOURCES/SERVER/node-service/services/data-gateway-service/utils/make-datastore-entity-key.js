const datastore = require("../../../../storage/google-datastore");
const entityKinds = require("../../../../storage/data/constants").datastore.entities.kinds;

const makeKey = ({ kind, entityID, orgID }) => {
    try {
        if(!entityID && kind !== entityKinds.orgProfile) throw new Error("Missing required entityID argument.");
        let result;
        switch (kind) {
        case entityKinds.orgProfile:
            result = datastore.key([entityKinds.orgProfile, orgID]);
            break;
        case entityKinds.orgProfileMembersMap:
            result = datastore.key([entityKinds.orgProfile, orgID, entityKinds.orgProfileMembersMap, entityID]);
            break;
        case entityKinds.project:
            if(!orgID) throw new Error("Missing required orgID argument.");
            result = datastore.key([entityKinds.orgProfile, orgID, entityKinds.project, entityID]);
            break;
        case entityKinds.orgResource:
            if(!orgID) throw new Error("Missing required orgID argument.");
            result = datastore.key([entityKinds.orgProfile, orgID, entityKinds.orgResource, entityID]);
            break;
        case entityKinds.orgResourceReservations:
            if(!orgID) throw new Error("Missing required orgID argument.");
            result = datastore.key([entityKinds.orgProfile, orgID, entityKinds.orgResourceReservations, entityID]);
        }

        if(!result) throw new Error(`Unable to make Datstore key. Unknown entity kind specified: ${kind}`);

        return { result };
    } catch(err) {
        console.log(err);
        return {
            error: {
                errorCodeID: "O1lQLvbVTDKUnMnjYoebMQ", // "Unexpected error trying to construct Datastore key."
                errorCodeSource: "eDtp6E7CTbWzz4IeSB2zQw",
                errorContext: {
                    message: err.message
                }
            }
        };
    }
};

module.exports = makeKey;