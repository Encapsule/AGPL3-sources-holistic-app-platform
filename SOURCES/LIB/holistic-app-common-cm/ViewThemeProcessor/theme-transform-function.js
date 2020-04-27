// theme-transform-function

const color = require("color"); // https://www.npmjs.com/package/color

const holisticThemeSettingsSpec = require("./iospecs/holistic-view-theme-settings-spec");
const holisticThemeObjectSpecs =    require("./iospecs/holistic-view-theme-object-specs");

module.exports = function(themeSettings_) {

    let response = { error: null };
    let errors = [];
    let inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;

        let theme = {

            settings: themeSettings_,

            page: themeSettings_.page,
            panel: {
                navigation: {
                    color: {
                    },
                    ...themeSettings_.panel
                },
                application: {
                    color: {
                    },
                    ...themeSettings_.panel
                },
                notification: {
                    color: {
                    },
                    ...themeSettings_.panel
                },
                tools: {
                    color: {
                    },
                    ...themeSettings_.panel
                },
                help: {
                    color: {
                    },
                    ...themeSettings_.panel
                },
                menu: {
                    color: {
                    },
                    ...themeSettings_.panel
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

}; // bodyFunction
