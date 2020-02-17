
const abstractFrameLatchDeclaration = require("./declarations/AbstractProcessModel-frame-latch-declaration");
const abstractFrameLatch = require("./AbstractProcessModel-frame-latch");

const SMLModels = {
    core: {
        observableFrameLatch: abstractFrameLatch
    },
    test: {
        declaration: {
            observableFrameLatch: abstractFrameLatchDeclaration
        }
    }
};

module.exports = SMLModels;

