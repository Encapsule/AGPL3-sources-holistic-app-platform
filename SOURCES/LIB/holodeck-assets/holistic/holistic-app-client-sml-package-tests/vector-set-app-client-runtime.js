// vector-set-app-client-runtime.js

const clientSML = require("@encapsule/holistic-app-client-sml");

module.exports = [

    {
        id: "sThxzN9-QuKCgErSNYhcQQ",
        name: "Client App Runtime OPM #1",
        description: "Attempt to instantiate the current Client App Runtime OPM via our test harness.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessModel: {
                        constructorRequest: clientSML.client.test.declaration.appClientRuntime
                    }
                }
            }
        }
    }

];
