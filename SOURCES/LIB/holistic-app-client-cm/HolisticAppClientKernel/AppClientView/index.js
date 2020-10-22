
const holarchy = require("@encapsule/holarchy");
const holarchyCM = require("@encapsule/holarchy-cm");

module.exports = new holarchy.CellModel({
    id: "vrmv3WMRQXql7Bx3DDEIDw",
    name: "Holistic Client App View Manager",
    description: "Provides management of client view cells in a holistic client app.",
    apm: require("./AbstractProcessModel-app-client-view"),
    subcells: [ holarchyCM.cml ]
});

