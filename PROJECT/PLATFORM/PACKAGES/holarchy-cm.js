// PROJECT/PLATFORM/PACKAGES/holarchy-cm.js

const arccore = require("@encapsule/arccore");
const holistic = require("../../../BUILD/holistic");
const react = require("react");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node", "browser" ],
    packageManifestOverrides: {
        description: "This package contains the Holistic App Platform's core re-usable CellModel library.",
        keywords: [ "Encapsule", "holistic", "holarchy", "CellModel" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/holarchy": holistic.version,
            "react": react.version,
            "react-dom": react.version
        }
    },
    packageReadme: {
        overviewDescriptor: {
            markdown: [
                "@encapsule/holarchy-cm is a runtime-library (RTL) distribution package that provides re-usable design pattern building blocks for building reactive information circuits according to the tenets of System-in-Cell (or Cloud if you prefer) architecture (SiC).",
	        ]
        },
        bodySections: [
	        {
		        markdown: [
                    "### Background Material Links",
                    "Please read through these webpages to get a broad sense of the architectural precepts that underpin **S**ystem-**I**n-**C**ell (SiC) architecture.",
                    "- [All About Circuits - Finite State Machines](https://www.allaboutcircuits.com/textbook/digital/chpt-11/finite-state-machines/) **This is our long-established program execution model - _CellProcessor evaluation is execution_.**",
                    "- [All About Circuits - Introduction to Combinatorial Logic Functions](https://www.allaboutcircuits.com/textbook/digital/chpt-9/combinational-logic-functions/) **Basic information about logic (in hardware terms). Note that a call to `act` is a _clock signal_.**",
                    "- [ScienceDirect - Boolean Expression](https://www.sciencedirect.com/topics/computer-science/boolean-expression) **A brief look at compositional patterns that we seek to capture here as CellModel for re-use _everythere_ at all levels of system X distributed across [ A, B, C... ] service instance(s).**",
                    "- [All About Circuits - Multiplexers](https://www.allaboutcircuits.com/textbook/digital/chpt-9/multiplexers/)",
                    "- [All About Circuits - Ladder Diagrams](https://www.allaboutcircuits.com/textbook/digital/chpt-6/ladder-diagrams/) **YEA, THIS**",
                    "- [All About Circuits - Digital Logic Functions](https://www.allaboutcircuits.com/textbook/digital/chpt-6/digital-logic-functions/)",
                    "- [All About Circuits - Networks and Busses](https://www.allaboutcircuits.com/textbook/digital/chpt-14/networks-and-busses/)",
                    "- [All About Circuits - Data Flow](https://www.allaboutcircuits.com/textbook/digital/chpt-14/data-flow/)",
                    "- [All About Circuits - Finite-state Machine Architecture Applied](https://www.allaboutcircuits.com/textbook/digital/chpt-16/finite-state-machine/)",
		        ]
	        }
	    ]
    }
};
