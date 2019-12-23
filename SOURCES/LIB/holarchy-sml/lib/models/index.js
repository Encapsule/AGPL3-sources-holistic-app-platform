
const observableFrameLatchDeclaration = require("./opm-frame-latch-declaration");
const observableFrameLatch = require("./opm-frame-latch");

const d2r2ReactClientOutputProcessorDeclaration = require("./opm-d2r2-react-client-output-processor-declaration");
const d2r2ReactClientOutputProcessor = require("./opm-d2r2-react-client-output-processor");

const SMLModels = {
    core: {
        observableFrameLatch: observableFrameLatch,
        d2r2ReactClientOutputProcessor: d2r2ReactClientOutputProcessor
    },
    test: {
        declaration: {
            observableFrameLatch: observableFrameLatchDeclaration,
            d2r2ReactClientOutputProcessor: d2r2ReactClientOutputProcessorDeclaration
        }
    }
};

module.exports = SMLModels;

