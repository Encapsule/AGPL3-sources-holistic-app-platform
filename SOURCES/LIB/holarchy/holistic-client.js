// abacus-ux-base/client.js
//
// rainier-ux-base package exports specific to HTML5 application service.

const clientApplicationFactory = require("./sources/client/client-factory");

module.exports = {
    factories: {
        client: {
            application: clientApplicationFactory
        }
    }
};
