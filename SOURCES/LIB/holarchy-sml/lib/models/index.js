
const observableFrameLatchDeclaration = require("./declarations/ObservableProcessModel-frame-latch-declaration");
const observableFrameLatch = require("./ObservableProcessModel-frame-latch");

const d2r2ReactClientDisplayAdaptorDeclaration = require("./declarations/ObservableProcessModel-d2r2-react-client-display-adaptor-declaration");
const d2r2ReactClientDisplayAdaptor = require("./ObservableProcessModel-d2r2-react-client-display-adaptor");

const SMLModels = {
    core: {
        observableFrameLatch: observableFrameLatch,
        d2r2ReactClientDisplayAdaptor: d2r2ReactClientDisplayAdaptor
    },
    test: {
        declaration: {
            observableFrameLatch: observableFrameLatchDeclaration,
            d2r2ReactClientDisplayAdaptor: d2r2ReactClientDisplayAdaptorDeclaration
        }
    }
};

module.exports = SMLModels;

