
const holisticThemeSpecs = require("./holistic-view-theme-object-specs");

const typographyBaseSettings = {
    ____types: "jsObject",
    fontFamily: { ____accept: "jsString" },
    fontStyle : { ____accept: "jsString" },
    fontWeight: { ____accept: "jsString" },
    sizes: {
        ____types: "jsObject",
        smallest: { ____accept: "jsString" },
        smaller: { ____accept: "jsString" },
        normal: { ____accept: "jsString" },
        larger: { ____accept: "jsString" },
        largest: { ____accept: "jsString" }
    }
};

const typographyHeadingSettings = {
    ...typographyBaseSettings,
    sizes: {
        ____types: "jsObject",
        h1: { ____accept: "jsString" },
        h2: { ____accept: "jsString" },
        h3: { ____accept: "jsString" },
        h4: { ____accept: "jsString" },
        h5: { ____accept: "jsString" },
        h6: { ____accept: "jsString" }
    }
};

const regionSpacingSettingsSpec = {
    ____types: "jsObject", ____defaultValue: {},
    margin: {
        ____types: "jsObject", ____defaultValue: {},
        value: { ____accept: "jsNumber", ____defaultValue: 0 },
        units: { ____accept: "jsString", ____inValueSet: [ "px", "em", "pt" ], ____defaultValue: "px" }
    },
    padding: {
        ____types: "jsObject", ____defaultValue: {},
        value: { ____accept: "jsNumber", ____defaultValue: 0 },
        units: { ____accept: "jsString", ____inValueSet: [ "px", "em", "pt" ], ____defaultValue: "px" }
    }
};

const regionShapeSettingsSpec = {
    ____types: "jsObject", ____defaultValue: {},
    radius: {
        ____types: "jsObject", ____defaultValue: {},
        value: { ____accept: "jsNumber", ____defaultValue: 0 },
        units: { ____accept: "jsString", ____inValueSet: [ "px", "em", "pt" ], ____defaultValue: "px" }
    },
    size: {
        ____types: "jsObject", ____defaultValue: {},
        value: { ____accept: "jsNumber", ____defaultValue: 0 },
        units: { ____accept: "jsString", ____inValueSet: [ "px", "em", "pt" ], ____defaultValue: "px" }
    },
    style: { ____accept: "jsString", ____inValueSet: [ "none", "solid", "dotted", "dashed" ], ____defaultValue: "none" }
}; // regionShapeSettingsSpec

const regionShadowSettingsSpec = {
    ____types: "jsObject", ____defaultValue: {},
    ____defaultValue: {},
    enabled: { ____accept: "jsBoolean", ____defaultValue: false },
    hOffset: {
        ____types: "jsObject", ____defaultValue: {},
        value: { ____accept: "jsNumber", ____defaultValue: 0 },
        units: { ____accept: "jsString", ____inValueSet: [ "px", "em", "pt" ], ____defaultValue: "px" }
    },
    vOffset: {
        ____types: "jsObject", ____defaultValue: {},
        value: { ____accept: "jsNumber", ____defaultValue: 0 },
        units: { ____accept: "jsString", ____inValueSet: [ "px", "em", "pt" ], ____defaultValue: "px" }
    },
    blur: {
        ____types: "jsObject", ____defaultValue: {},
        value: { ____accept: "jsNumber", ____defaultValue: 0 },
        units: { ____accept: "jsString", ____inValueSet: [ "px", "em", "pt" ], ____defaultValue: "px"    }
    },
    spread: {
        ____types: "jsObject", ____defaultValue: {},
        value: { ____accept: "jsNumber", ____defaultValue: 0 },
        units: { ____accept: "jsString", ____inValueSet: [ "px", "em", "pt" ], ____defaultValue: "px"    }
    },
    xset: { ____accept: "jsString", ____inValueSet: [ "outset", "inset" ], ____defaultValue: "outset" },
}; // regionShadowSettingsSoec



module.exports = {

    ____label: "Holistic App Theme Settings",
    ____description: "Settings are inputs used to derive the values in the Holistic App Theme Styles document (dynamically updated JSON).",
    ____types: "jsObject",
    ____defaultValue: {},

    color: {
        ____types: "jsObject",
        ____defaultValue: {},

        page: {
            ____types: "jsObject",
            ____defaultValue: { backgroundColor: "#FFFFFF", foregroundColor: "#000000" },
            ...holisticThemeSpecs.holisticAppThemeSpec.page.color
        },

        text: {
            ____types: "jsObject",
            ____defaultValue: {},

            content: {
                ____label: "Content Text Colors",
                ____description: "Settings to determine color style values to be applied to standard content text.",
                ____types: "jsObject",
                ____defaultValue: {},

                backgroundColor: { ____accept: "jsString", ____defaultValue: "#FFFFFF00" },
                foregroundColor: { ____accept: "jsString", ____defaultValue: "#000000FF" },

                link: {
                    ____label: "Content Link Text Colors",
                    ____description: "Settings to determine color style values to be applied to links embedded in standard content text.",
                    ____types: "jsObject",
                    ____defaultValue: {},

                    application: {
                        ____label: "Content App Link Text Colors",
                        ____description: "Settings to determine color style values to be applied to application links (i.e. click events processed by either the client app or its origin server app).",
                        ____types: "jsObject",
                        ____defaultValue: {},
                        backgroundColor: { ____accept: "jsString", ____defaultValue: "#FFFFFF00" },
                        foregroundColor: { ____accept: "jsString", ____defaultValue: "#00CC00FF" }
                    },
                    site: {
                        ____label: "Content Site Link Text Colors",
                        ____description: "Settings to determine color style values to be applied to site links (i.e. click events that cause a browser HTTP request outside of the application's origin domain (i.e. external sites).",
                        ____types: "jsObject",
                        ____defaultValue: {},
                        backgroundColor: { ____accept: "jsString", ____defaultValue: "#FFFFFF00" },
                        foregroundColor: { ____accept: "jsString", ____defaultValue: "#00CC00FF" }
                    },
                    tooltip: {
                        ____label: "Content Tooltip Link Text Colors",
                        ____description: "Settings to determine color style values to be applied to tooltip links (i.e. click events that typically show a tooltip for help/context/options/metadata etc...).",
                        ____types: "jsObject",
                        ____defaultValue: {},
                        backgroundColor: { ____accept: "jsString", ____defaultValue: "#FFFFFF00" },
                        foregroundColor: { ____accept: "jsString", ____defaultValue: "#00CC00FF" }
                    }
                }

            },

        }

    }, // ~.color

    spacing: {
        ____types: "jsObject",
        ____defaultValue: {},
        page: { ...regionSpacingSettingsSpec },
        panel: {
            ____types: "jsObject",
            ____defaultValue: {},
            navigation: {
                ...regionSpacingSettingsSpec
            },
            application: {
                ...regionSpacingSettingsSpec
            },
            notification: {
                ...regionSpacingSettingsSpec
            },
            tools: {
                ...regionSpacingSettingsSpec
            },
            help: {
                ...regionSpacingSettingsSpec
            },
            menu: {
                ...regionSpacingSettingsSpec
            }
        }, // ~.spacing.panel
        window: {
            ____types: "jsObject",
            ____defaultValue: {},
            modal: {
                ...regionSpacingSettingsSpec
            },
            popup: {
                ...regionSpacingSettingsSpec
            },
            tooltip: {
                ...regionSpacingSettingsSpec
            },
            tool: {
                ...regionSpacingSettingsSpec
            },
            content: {
                ...regionSpacingSettingsSpec
            }
        }, // ~.spacing.window
        control: {
            ____types: "jsObject",
            ____defaultValue: {},
            button: {
                ____types: "jsObject",
                ____defaultValue: {},
                standard: {
                    ____types: "jsObject",
                    ____defaultValue: {}
                },
                tool: {
                    ____types: "jsObject",
                    ____defaultValue: {}
                }
            } // ~.spacing.control.button
        } // ~.spacing.control
    }, // ~.spacing

    shape: {
        ____types: "jsObject",
        ____defaultValue: {},
        panel: {
            ____types: "jsObject",
            ____defaultValue: {},
            navigation: {
                ...regionShapeSettingsSpec,
                ____defaultValue: { radius: { size: 0.33, units: "em" }, size: { value: 1, units: "px" }, style: "solid" }
            },
            application: {
                ...regionShapeSettingsSpec,
            },
            notification: {
                ...regionShapeSettingsSpec,
            },
            tools: {
                ...regionShapeSettingsSpec,
            },
            help: {
                ...regionShapeSettingsSpec,
            },
            menu: {
                ...regionShapeSettingsSpec,
            }
        }, // ~.shape.panel
        window: {
            ____types: "jsObject",
            ____defaultValue: {},
            modal: {
                ...regionShapeSettingsSpec,
            },
            popup: {
                ...regionShapeSettingsSpec,
            },
            tooltip: {
                ...regionShapeSettingsSpec,
            },
            tool: {
                ...regionShapeSettingsSpec,
            },
            content: {
                ...regionShapeSettingsSpec,
            }
        }, // ~.shape.window
        control: {
            ____types: "jsObject",
            ____defaultValue: {}
        } // ~.shape.control
    }, // ~.shape

    shadow: {
        ____types: "jsObject",
        ____defaultValue: {},
        panel: {
            ____types: "jsObject",
            ____defaultValue: {},
            navigation: {
                ...regionShadowSettingsSpec
            },
            application: {
                ...regionShadowSettingsSpec
            },
            notification: {
                ...regionShadowSettingsSpec
            },
            tools: {
                ...regionShadowSettingsSpec
            },
            help: {
                ...regionShadowSettingsSpec
            },
            menu: {
                ...regionShadowSettingsSpec
            }
        }, // ~.shadow.panel
        window: {
            ____types: "jsObject",
            ____defaultValue: {},
            modal: {
                ...regionShadowSettingsSpec
            },
            popup: {
                ...regionShadowSettingsSpec
            },
            tooltip: {
                ...regionShadowSettingsSpec
            },
            tool: {
                ...regionShadowSettingsSpec
            },
            content: {
                ...regionShadowSettingsSpec
            }
        }, // ~.shadow.window
        control: {
            ____types: "jsObject",
            ____defaultValue: {}
        } // ~.shadow.control
    }, // ~.shadow



    typograph: {
        ____label: "Typography Style Settings",
        ____description: "Typography settings control the basic typeface and font style settings applied to a holistic app theme.",
        ____types: "jsObject",
        ____defaultValue: {
            content: { fontFamily: "Nunito", fontWeight: "normal", fontStyle: "none", sizes: { smallest: "8pt", smaller: "10pt", normal: "12pt", larger: "14pt", largest: "16pt" } },
            monospace: { fontFamily: "Courier", fontWeight: "normal", fontStyle: "none", sizes: { smallest: "8pt", smaller: "10pt", normal: "12pt", larger: "14pt", largest: "16pt" } },
            heading: { fontFamily: "Montserrat", fontWeight: "normal", fontStyle: "none", sizes: { h1: "24pt", h2: "20pt", h3: "16pt", h4: "14pt", h5: "12pt", h6: "10pt" } },
            title: { fontFamily: "Roboto", fontWeight: "normal", fontStyle: "none", sizes: { smallest: "12pt", smaller: "14pt", normal: "16pt", larger: "18pt", largest: "20pt" } },
            control: { fontFamily: "Play", fontWeight: "normal", fontStyle: "none", sizes: { smallest: "8pt", smaller: "9pt", normal: "10pt", larger: "12pt", largest: "14pt" } },
            menu: { fontFamily: "Play", fontWeight: "normal", fontStyle: "none", sizes: { smallest: "8pt", smaller: "9pt", normal: "10pt", larger: "12pt", largest: "14pt" } }
        },
        content: typographyBaseSettings,
        monospace: typographyBaseSettings,
        heading: typographyHeadingSettings,
        title: typographyBaseSettings,
        control: typographyBaseSettings,
        menu: typographyBaseSettings

    } // ~.typography

};
