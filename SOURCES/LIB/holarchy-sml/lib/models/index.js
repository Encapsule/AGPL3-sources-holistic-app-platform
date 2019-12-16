
const observableFrameLatchDeclaration = require("./opm-frame-latch-declaration");
const observableFrameLatch = require("./opm-frame-latch");

const SMLModels = {
    core: {
        observableFrameLatch: observableFrameLatch
    },
    test: {
        declaration: {
            observableFrameLatch: observableFrameLatchDeclaration
        }
    }
};

module.exports = SMLModels;

