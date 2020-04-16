
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


module.exports = {

    ____label: "Holistic App Theme Settings",
    ____description: "Settings are inputs used to derive the values in the Holistic App Theme Styles document (dynamically updated JSON).",
    ____types: "jsObject",
    ____defaultValue: {},

    color: {
        ____types: "jsObject",
        ____defaultValue: {},

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
    },

    // Page styles are conventionally applied to BODY HTML tag. We seek to minimize any/all stylings at this level
    // relying instead on browser defaults as much as possible. In cases where these defaults do not generally align
    // w/how we wish to render our page views, we override the default browser styles for BODY. There are a limited
    // number of these cases w/global impact on the entire page. These values are specified directly via theme settings
    // and reflected w/out transformation in the theme document's page style values.

    page: {
        ...holisticThemeSpecs.holisticAppThemeSpec.page,
        ____defaultValue: {
            color: { backgroundColor: "#FFFFFF", foregroundColor: "#000000" },
            spacing: { margin: "0px", padding: "0px" }
        }
    }, // ~.page

    panel: {
        ____label: "Common Panel Styles",
        ____types: "jsObject",
        ____defaultValue: {
            spacing: { margin: "0px", padding: "1em" },
            shape: { border: "1px solid rgba(0,0,0,0.2)", borderRadius: "0.33em" },
            shadow: "1px 1px 0px 0px rgba(0,0,0,0.2)"
        },
        spacing: { ...holisticThemeSpecs.regionStylesSpec.spacing },
        shape: { ...holisticThemeSpecs.regionStylesSpec.shape },
        shadow: { ...holisticThemeSpecs.regionStylesSpec.shadow }

    }, // ~.panel

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
