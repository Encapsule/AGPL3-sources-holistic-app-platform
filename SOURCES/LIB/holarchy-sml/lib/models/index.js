
const observableFrameLatchDeclaration = require("./declarations/ObservableProcessModel-frame-latch-declaration");
const observableFrameLatch = require("./ObservableProcessModel-frame-latch");

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

