
const clientApplicationFactory = require("./sources/client/client-factory");

module.exports = {
    factories: {
        client: {
            application: clientApplicationFactory
        }
    }
};
