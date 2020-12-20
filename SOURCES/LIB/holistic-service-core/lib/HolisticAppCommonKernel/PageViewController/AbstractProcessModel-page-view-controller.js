// SOURCES/COMMON/vp5/models/view/ViewpathPageViewController/AbtractProcessModel-viewpath-view-process.js

const holarchy = require("@encapsule/holarchy");

const apm = new holarchy.AbstractProcessModel({
    id: "AZaqZtWRSdmHOA6EbTr9HQ",
    name: "Viewpath Page View Controller Process",
    description: "Provides Viewpath5-specific API for swapping the currently active view process in response to a variety of different conditions.",

    ocdDataSpec: {
        ____types: "jsObject",
        ____defaultValue: {},

        activeHashroutePathname: {
            ____label: "Active Hashroute Pathname",
            ____description: "The hashroute pathname that was used as the ViewpathPageView cell process instanceName to activate activePageViewCellProcess.",
            ____accept: [ "jsNull", "jsString" ],
            ____defaultValue: null
        },

        activePageViewCellProcess: {
            ____label: "Active Page View Cell Process",
            ____description: "The APM binding path of the currently-active page view cell process (if there is one).",
            ____accept: [ "jsNull", "jsObject" ],
            ____defaultValue: null
            // TODO: This is a CellProcessor.process.activate response result
        },

    },

    steps: {

        uninitialized: {
            description: "Default process starting step.",
            transitions: [ { transitionIf: { always: true }, nextStep: "viewpath-pageview-controller-active" } ]
        },

        "viewpath-pageview-controller-active": {
            description: "Waiting for the app client process to set the page view."
        }

    }
});

if (!apm.isValid()) {
    throw new Error(apm.toJSON());
}

module.exports = apm;

