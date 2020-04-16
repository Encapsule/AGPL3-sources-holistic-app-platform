// theme-transform-filter.js
//
/*
  A simple arrccore.filter that implements a transformation between the
  the values presented in Holistic App Display Theme Settings document
  into final Holistic App Display Theme document values using colorspace
  conversations and various other small bits of logic to set the final
  theme values (of which there are many) consistenty so that display elements
  implemented by React components can simply use a set of this.state-based
  flags to dereference the current programmatic styles to be used for pretty
  all the common use cases/interactions/modes controls etc.
*/

const arccore = require("@encapsule/arccore");
const color = require("color"); // https://www.npmjs.com/package/color

const holisticThemeSettingsSpec = require("./iospecs/holistic-view-theme-settings-spec");
const holisticThemeObjectSpecs =    require("./iospecs/holistic-view-theme-object-specs");

const factoryResponse = arccore.filter.create({
    operationID: "8L3wd25AR9687poByyuDbw",
    operationName: "Holistic View Theme Generator",
    operationDescription: "Produces a Holistic View Theme document containing detailed programmatic style information sorted by common display element type, mode, interaction, state etc.",

    inputFilterSpec: holisticThemeSettingsSpec,
    outputFilterSpec: holisticThemeObjectSpecs.holisticAppThemeSpec,

    bodyFunction(themeSettings_) {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            let theme = {

                page: themeSettings_.page,
                panel: {
                    navigation: {
                        color: {
                        },
                        spacing: {
                        },
                        shape: {
                        },
                        shadow: ""
                    },
                    application: {
                        color: {
                        },
                        spacing: {
                        },
                        shape: {
                        },
                        shadow: ""
                    },
                    notification: {
                        color: {
                        },
                        spacing: {
                        },
                        shape: {
                        },
                        shadow: ""
                    },
                    tools: {
                        color: {
                        },
                        spacing: {
                        },
                        shape: {
                        },
                        shadow: ""
                    },
                    help: {
                        color: {
                        },
                        spacing: {
                        },
                        shape: {
                        },
                        shadow: ""
                    },
                    menu: {
                        color: {
                        },
                        spacing: {
                        },
                        shape: {
                        },
                        shadow: ""
                    }
                }, // ~.panel

                window: {
                    modal: {
                        color: {
                        },
                        spacing: {
                        },
                        shape: {
                        },
                        shadow: ""

                    },
                    popup: {
                        color: {
                        },
                        spacing: {
                        },
                        shape: {
                        },
                        shadow: ""

                    },
                    tooltip: {
                        color: {
                        },
                        spacing: {
                        },
                        shape: {
                        },
                        shadow: ""

                    },
                    tool: {
                        color: {
                        },
                        spacing: {
                        },
                        shape: {
                        },
                        shadow: ""
                    },
                    content: {
                        color: {
                        },
                        spacing: {
                        },
                        shape: {
                        },
                        shadow: ""
                    }
                }, // ~.window
                control: {
                    button: {
                        standard: {
                        },
                        tool: {
                        }
                    },
                    checkbox: {
                        enabled: {
                        },
                        disabled: {
                        }
                    },
                    radio: {
                        enabled: {
                        },
                        disabled: {
                        }
                    },
                    slider: {
                        enabled: {
                        },
                        disabled: {
                        }

                    },
                    formInput: {
                        enabled: {
                        },
                        disabled: {
                        }
                    },
                    dropDown: {
                        enabled: {
                        },
                        disabled: {
                        }
                    },
                    menuItem: {
                        enabled: {
                        },
                        disabled: {
                        }
                    }
                }, // ~.control
                typography: {
                    content: {
                        smallest: {
                        },
                        smaller: {
                        },
                        normal: {
                        },
                        larger: {
                        },
                        largest: {
                        }
                    },
                    monospace: {
                        smallest: {
                        },
                        smaller: {
                        },
                        normal: {
                        },
                        larger: {
                        },
                        largest: {
                        }
                    },
                    header: {
                        h1: {
                        },
                        h2: {
                        },
                        h3: {
                        },
                        h4: {
                        },
                        h5: {
                        },
                        h6: {
                        }
                    },
                    title: {
                        smallest: {
                        },
                        smaller: {
                        },
                        normal: {
                        },
                        larger: {
                        },
                        largest: {
                        }
                    },
                    control: {
                        smallest: {
                        },
                        smaller: {
                        },
                        normal: {
                        },
                        larger: {
                        },
                        largest: {
                        }
                    }
                }
            } // theme

            response.result = theme;

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;

    } // bodyFunction

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
