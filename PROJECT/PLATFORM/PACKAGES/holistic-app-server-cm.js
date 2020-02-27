// PROJECT/PLATFORM/PACKAGES/holarchy-cm-server.js

const arccore = require("@encapsule/arccore");
const holistic = require("../../../BUILD/holistic");
const react = require("react");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "browser" ],
    packageManifestOverrides: {
        description: "Exports the HolisticAppServer CellModel for use in derived @encapsule/holistic applications/services.",
        keywords: [ "Encapsule", "holistic", "holarchy", "holarchy-sml", "software model", "software library", "SML", "reuse", "re-use", "ObservableProcessController", "ObservableProcessModel", "ObservableControllerData", "TransitionOperator", "ControllerAction" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/holarchy": holistic.version,
            "@encapsule/holarchy-sml": holistic.version,
            "react": react.version,
            "react-dom": react.version
        }
    },
    packageReadme: {
        overviewDescriptor: {
            markdown: [
		        "**TODO**"
	        ]
        },
        bodySections: [
	        {
		        markdown: [
		            "**TODO**"
		        ]
	        }
	    ]
    }
};
