"use strict";

const themeObjectSpecs = require("./iospecs/holistic-view-theme-object-specs");
const themeSettingsSpec = require("./iospecs/holistic-view-theme-settings-spec");


module.exports = {

    id: "zzvzLbm2RTyQN1lWFcjpVA",
    name: "Theme Processor Model",

    description: "Encapsulates the details of generating and updating current programmatic style settings consumed by client application view and display processes.",

    ocdDataSpec: {
        ____types: "jsObject",
        ____defaultValue: {},
        inputs: {
            ____types: "jsObject",
            ____defaultValue: {},
            revision: {
                ____accept: "jsNumber",
                ____defaultValue: -1
            },
            themeInputs: themeSettingsSpec
        },
        _private: {
            ____types: "jsObject",
            ____defaultValue: {},
            updating: {
                ____accept: "jsBoolean",
                ____defaultValue: false
            }
        },
        outputs: {
            ____types: "jsObject",
            ____defaultValue: {},
            revision: {
                ____accept: "jsNumber",
                ____defaultValue: -1
            },
            themeOutputs: themeObjectSpecs.holisticAppThemeSpec
        }
    }
};
