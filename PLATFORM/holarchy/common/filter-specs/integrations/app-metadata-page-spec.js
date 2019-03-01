"use strict";

// app-metadata-page-spec.js
var arccore = require("@encapsule/arccore");

var developerInputMetadataPageSpec = require("./developer-input-metadata-page-spec");

var spec = arccore.util.clone(developerInputMetadataPageSpec);
var derivedPageStateSpec = {
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
    ____defaultValue: {}
  },
  uri: {
    ____label: "Page Request Page URI",
    ____description: "The actual URI requested which may differ from the metadata returned when there is no metadata defined for the requested URI.",
    ____accept: ["jsNull", "jsString"],
    ____defaultValue: null
  }
};

for (var name in derivedPageStateSpec) {
  spec[name] = derivedPageStateSpec[name];
}

module.exports = spec;