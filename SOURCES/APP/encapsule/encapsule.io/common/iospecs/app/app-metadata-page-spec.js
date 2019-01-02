// app-metadata-page-spec.js

const arccore = require('arccore');

const developerInputMetadataPageSpec = require('./developer-input-metadata-page-spec');
var spec = arccore.util.clone(developerInputMetadataPageSpec);

const derivedPageStateSpec = {
    children: {
        ____label: "Children View URIs",
        ____description: "An orderred array of this page's subpage URI's.",
        ____types: "jsArray",
        ____defaultValue: [],
        childURI: {
            ____label: "Child View URI",
            ____description: "The view URI of the child page.",
            ____accept: "jsString"
        }
    },
    ts: {
        ____label: "Menu Magic",
        ____description: "Topological sort timestamp and derived weight information. Used to automate UX menu layout.",
        ____accept: "jsObject",
        ____defaultValue: {},
    },
    uri: {
        ____label: "Page View URI",
        ____description: "The page's view store URI.",
        ____accept: [ "jsNull", "jsString" ],
        ____defaultValue: null
    }
};

for (var name in derivedPageStateSpec) {
    spec[name] = derivedPageStateSpec[name];
}

module.exports = spec;

