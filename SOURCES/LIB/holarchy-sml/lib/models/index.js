
const observableFrameLatchDeclaration = require("./opm-frame-latch-declaration");
const observableFrameLatch = require("./opm-frame-latch");

const d2r2ReactClientDisplayAdaptorDeclaration = require("./opm-d2r2-react-client-display-adaptor-declaration");
const d2r2ReactClientDisplayAdaptor = require("./opm-d2r2-react-client-display-adaptor");

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

