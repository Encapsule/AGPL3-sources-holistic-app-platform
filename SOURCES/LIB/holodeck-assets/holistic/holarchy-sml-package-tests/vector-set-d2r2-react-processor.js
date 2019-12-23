// vector-set-d2r2-react-processor.js

const holarchy = require("@encapsule/holarchy");
const sml = require("@encapsule/holarchy-sml");

module.exports = [

    {
        id: "zUoUas3CTj2HLDfpNf4NTw",
        name: "d2r2/React Client Output Processor OPM #1",
        description: "A set of the d2r2/React Client Output Processor OPM.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessModel: {
                        constructorRequest: sml.models.test.declaration.d2r2ReactClientOutputProcessor
                    }
                }
            }
        }
    }



];
