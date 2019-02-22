// sources/common/filter-specs/rainier-data-store/index.js
//

// Because we re-use this list quite a lot.
const networkControllerStates = [ 'uninitialized', 'waiting', 'idle', 'working', 'evaluate', 'ready', 'reset', 'error' ];


module.exports = {

    ____label: "App Data Store Init Data",
    ____description: "Values passed to a Application Data Store constructor filter instance to construct a store intance.",
    ____types: "jsObject",
    ____defaultValue: {},

    __AppStateControllerPrivate: {
        ____label: "App State Controller Subsystem Private",
        ____description: "This namespace should only ever be written by App State Controller (ASC) and App State Actor (ASA) infrastructure.",
        ____types: "jsObject",
        ____defaultValue: {},
        step: {
            ____label: "Step Count Value",
            ____description: "The total number of steps the app state controller has taken since it was constructed. First step is #0, initial value is -1.",
            ____accept: "jsNumber",
            ____defaultValue: -1
        },
        stepError: {
            ____label: "Step Error Information",
            ____description: "Information that is set by the application state controller step algorithm if it encounters a runtime error during a step.",
            ____accept: [ "jsObject", "jsNull" ],
            ____defaultValue: null
        }, // stepError
        control: {
            ____label: "Step Control Value",
            ____description: "An opaque key used to grossly determine if the app data store has been overwritten by a test operation.",
            ____accept: "jsString",
            ____defaultValue: "uninitialized"
        },

    },

    base: {

        ____label: "Base Layer Application Data",
        ____description: "Application runtime state data maintained on behalf of rainier-ux-base runtime routines.",
        ____types: "jsObject",
        ____defaultValue: {},


        HashLocation: {
            ____label: "The current hash location",
            ____description: "The hash location will be written here each time it is changed.  Subcontrollers can subscribe " +
                             " to hash location changes by using the id field in transition operators.",
            ____types: "jsObject",
            ____defaultValue: {},
            source: {
                ____accept: ["jsString","jsUndefined"],
            },
            hash: {
                ____label: "Hashed portion of the url",
                ____accept: ["jsString","jsUndefined"],
            },
            id: {
                ____label: "Sequence id of the hash change event, monotonically increasing",
                ____accept: "jsNumber",
                ____defaultValue: 0
            }
        },

        RainierBaseController: {
            ____label: "Rainier Base Controller Namespace",
            ____types: "jsObject",
            ____defaultValue: {},

            state: {
                ____accept: "jsString",
                ____inValueSet: [ 'uninitialized',
                                  'wait-advertiser',
                                  'initializing',
                                  'ready',
                                  'reset',
                                  'error'
                                ],
                ____defaultValue: "uninitialized"
            },

            applicationErrors: {
                ____label: "Application Errors",
                ____description: "An array of client application runtime errors.",
                ____types: "jsArray",
                ____defaultValue: [],
                runtimeError: {
                    ____label: "Application Runtime Error",
                    ____description: "An application error reported by a client application subsystem.",
                    ____types: "jsObject",
                    message: {
                        ____label: "Error Message",
                        ____description: "A human-readable error message string.",
                        ____accept: "jsString"
                    },
                    context: {
                        ____label: "Error Context",
                        ____description: "An optional developer-defined and error-specific context object containing additional information about the error.",
                        ____opaque: true
                    }
                }
            },

            // FOR v1 Rainier UX (parity) we primarily gated on the selection of the advertiser as it's the lowest dependendency
            // in the small hierarchy of calls that need to be made in order to provide the user w/enough information to complete
            // an adhoc query.

            selectedAdvertiser: {
                ____label: "Selected Advertiser",
                ____types: "jsObject",
                ____defaultValue: {},
                state: {
                    ____accept: "jsString",
                    ____inValueSet: [ 'uninitialized', 'waiting', 'ready', 'updating', 'error' ],
                    ____defaultValue: 'uninitialized'
                },
                pcode: {
                    ____label: "Selected Advertiser Pcode",
                    ____description: "The currently selected advertiser pcode. This is the value that should be set on initialization. And, again if the user selects another pcode.",
                    ____accept: [ "jsUndefined", "jsString" ]
                },
                pcodeLast: {
                   ____label: "Last Selected Advertiser Pcode",
                    ____description: "The last selected pcode that has been reflected out to the rest of the system. This value is used to determine if pcode has been updated by the user.",
                    ____accept: [ "jsUndefined", "jsString" ]
                }
            },

            network: {
                ____label: "Network Subsystem Controller Namespace",
                ____types: "jsObject",
                ____defaultValue: {},

                state: {
                    ____accept: "jsString",
                    ____inValueSet: [ 'uninitialized', 'idle', 'working' ],
                    ____defaultValue: 'uninitialized'
                },

                // ======================================================================
                // NEW EXPERIMENT

                requestQueue: {
                    ____label: "Completed Gateway Request Response Cache",
                    ____description: "A dictionary of data gateway request/response pairs for previously completed data gateway requests.",
                    ____types: "jsObject",
                    ____asMap: true,
                    ____defaultValue: {},
                    requestID: {
                        ____label: "Data Gateway Response Descriptor",
                        ____types: "jsObject",
                        requestBody: {
                            ____label: "Gateway Message Body",
                            ____description: "Data request body object queued by external subsystem.",
                            ____accept: "jsObject"
                        },
                        responsePath: {
                            ____label: "Data Gateway Response Write Path",
                            ____accept: "jsString"
                        }
                    } // requestID

                }, // responseCache

                // NEW EXPERIMENT
                // ======================================================================

                // Legacy rainier-ux-base networking

                GET_RainierDataAvailability: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    state: {
                        ____label: "Controller State",
                        ____description: "A flag indicating the current state of controller.",
                        ____accept: "jsString",
                        ____inValueSet: networkControllerStates,
                        ____defaultValue: 'uninitialized'
                    },
                    request: {
                        ____label: "Request Data",
                        ____description: "Data written to this namespace is passed to the state actor that initiates the HTTP request and writes the response back to `response` on completion.",
                        ____accept: [ "jsUndefined", "jsObject" ]
                        // TODO: Parameterize.
                    },
                    response: {
                        ____label: "Response Data",
                        ____description: "This namespace is written by the HTTP request state actor upon receipt of a response.",
                        ____types: [ "jsUndefined", "jsObject" ],
                        error: { ____accept: [ "jsNull", "jsString" ] },
                        result: { ____opaque: true  }
                        // TODO: Parameterize.
                    }
                },

                GET_RainierQueryDateRange: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    state: {
                        ____label: "Controller State",
                        ____description: "A flag indicating the current state of controller.",
                        ____accept: "jsString",
                        ____inValueSet: networkControllerStates,
                        ____defaultValue: 'uninitialized'
                    },
                    request: {
                        ____label: "Request Data",
                        ____description: "Data written to this namespace is passed to the state actor that initiates the HTTP request and writes the response back to `response` on completion.",
                        ____accept: [ "jsUndefined", "jsObject" ]
                        // TODO: Parameterize.
                    },
                    response: {
                        ____label: "Response Data",
                        ____description: "This namespace is written by the HTTP request state actor upon receipt of a response.",
                        ____types: [ "jsUndefined", "jsObject" ],
                        error: { ____accept: [ "jsNull", "jsString" ] },
                        result: { ____opaque: true  }
                        // TODO: Parameterize.
                    }
                },

                GET_RainierAudienceCountries: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    state: {
                        ____label: "Controller State",
                        ____description: "A flag indicating the current state of controller.",
                        ____accept: "jsString",
                        ____inValueSet: networkControllerStates,
                        ____defaultValue: 'uninitialized'
                    },
                    request: {
                        ____label: "Request Data",
                        ____description: "Data written to this namespace is passed to the state actor that initiates the HTTP request and writes the response back to `response` on completion.",
                        ____accept: [ "jsUndefined", "jsObject" ]
                        // TODO: Parameterize.
                    },
                    response: {
                        ____label: "Response Data",
                        ____description: "This namespace is written by the HTTP request state actor upon receipt of a response.",
                        ____types: [ "jsUndefined", "jsObject" ],
                        error: { ____accept: [ "jsNull", "jsString" ] },
                        result: { ____opaque: true  }
                        // TODO: Parameterize.
                    }
                },

                GET_RainierAudienceVerticals: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    state: {
                        ____label: "Controller State",
                        ____description: "A flag indicating the current state of controller.",
                        ____accept: "jsString",
                        ____inValueSet: networkControllerStates,
                        ____defaultValue: 'uninitialized'
                    },
                    request: {
                        ____label: "Request Data",
                        ____description: "Data written to this namespace is passed to the state actor that initiates the HTTP request and writes the response back to `response` on completion.",
                        ____accept: [ "jsUndefined", "jsObject" ]
                        // TODO: Parameterize.
                    },
                    response: {
                        ____label: "Response Data",
                        ____description: "This namespace is written by the HTTP request state actor upon receipt of a response.",
                        ____types: [ "jsUndefined", "jsObject" ],
                        error: { ____accept: [ "jsNull", "jsString" ] },
                        result: { ____opaque: true  }
                        // TODO: Parameterize.
                    }
                },

                GET_RainierDemographicCountries: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    state: {
                        ____label: "Controller State",
                        ____description: "A flag indicating the current state of controller.",
                        ____accept: "jsString",
                        ____inValueSet: networkControllerStates,
                        ____defaultValue: 'uninitialized'
                    },
                    request: {
                        ____label: "Request Data",
                        ____description: "Data written to this namespace is passed to the state actor that initiates the HTTP request and writes the response back to `response` on completion.",
                        ____accept: [ "jsUndefined", "jsObject" ]
                        // TODO: Parameterize.
                    },
                    response: {
                        ____label: "Response Data",
                        ____description: "This namespace is written by the HTTP request state actor upon receipt of a response.",
                        ____types: [ "jsUndefined", "jsObject" ],
                        error: { ____accept: [ "jsNull", "jsString" ] },
                        result: { ____opaque: true  }
                        // TODO: Parameterize.
                    }
                },
                GET_RainierDemographicCategories: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    state: {
                        ____label: "Controller State",
                        ____description: "A flag indicating the current state of controller.",
                        ____accept: "jsString",
                        ____inValueSet: networkControllerStates,
                        ____defaultValue: 'uninitialized'
                    },
                    request: {
                        ____label: "Request Data",
                        ____description: "Data written to this namespace is passed to the state actor that initiates the HTTP request and writes the response back to `response` on completion.",
                        ____accept: [ "jsUndefined", "jsObject" ]
                        // TODO: Parameterize.
                    },
                    response: {
                        ____label: "Response Data",
                        ____description: "This namespace is written by the HTTP request state actor upon receipt of a response.",
                        ____types: [ "jsUndefined", "jsObject" ],
                        error: { ____accept: [ "jsNull", "jsString" ] },
                        result: { ____opaque: true  }
                        // TODO: Parameterize.
                    }
                },

                GET_RainierGeographicCategories: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    state: {
                        ____label: "Controller State",
                        ____description: "A flag indicating the current state of controller.",
                        ____accept: "jsString",
                        ____inValueSet: networkControllerStates,
                        ____defaultValue: 'uninitialized'
                    },
                    request: {
                        ____label: "Request Data",
                        ____description: "Data written to this namespace is passed to the state actor that initiates the HTTP request and writes the response back to `response` on completion.",
                        ____accept: [ "jsUndefined", "jsObject" ]
                        // TODO: Parameterize.
                    },
                    response: {
                        ____label: "Response Data",
                        ____description: "This namespace is written by the HTTP request state actor upon receipt of a response.",
                        ____types: [ "jsUndefined", "jsObject" ],
                        error: { ____accept: [ "jsNull", "jsString" ] },
                        result: { ____opaque: true  }
                        // TODO: Parameterize.
                    }
                },

                GET_RainierAudienceGridCategories: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    state: {
                        ____label: "Controller State",
                        ____description: "A flag indicating the current state of controller.",
                        ____accept: "jsString",
                        ____inValueSet: networkControllerStates,
                        ____defaultValue: 'uninitialized'
                    },
                    request: {
                        ____label: "Request Data",
                        ____description: "Data written to this namespace is passed to the state actor that initiates the HTTP request and writes the response back to `response` on completion.",
                        ____accept: [ "jsUndefined", "jsObject" ]
                        // TODO: Parameterize.
                    },
                    response: {
                        ____label: "Response Data",
                        ____description: "This namespace is written by the HTTP request state actor upon receipt of a response.",
                        ____types: [ "jsUndefined", "jsObject" ],
                        error: { ____accept: [ "jsNull", "jsString" ] },
                        result: { ____opaque: true  }
                        // TODO: Parameterize.
                    }
                },

                POST_RainierAdhocQuery: {
                    ____label: "HTTP POST Rainier Adhoc Query Controller",
                    ____description: "Runtime state of the POST_RainierAdhocQueryController subcontroller model.",
                    ____types: "jsObject",
                    ____defaultValue: {},
                    state: {
                        ____label: "Controller State",
                        ____description: "A flag indicating the current state of controller.",
                        ____accept: "jsString",
                        ____inValueSet: networkControllerStates,
                        ____defaultValue: 'uninitialized'
                    },
                    request: {
                        ____label: "Request Data",
                        ____description: "Data written to this namespace is passed to the state actor that initiates the HTTP request and writes the response back to `response` on completion.",
                        ____types: [ "jsUndefined", "jsObject" ],
                        pcode: {
                            ____label: "Selected Advertiser",
                            ____description: "The current advertiser pcode to be included in the `p-code` header",
                            ____accept: "jsString"
                        },
                        requestBody: {
                            ____label: "Request Body",
                            ____description: "The body of the POST request prepared by the HTML5 client app that is passed to the backend during the proxied HTTP POST request.",
                            ____accept: "jsObject" // TODO: This should be schematized in the filter specification.
                        }
                    },
                    response: {
                        ____label: "Response Data",
                        ____description: "This namespace is written by the HTTP request state actor upon receipt of a response.",
                        ____types: [ "jsUndefined", "jsObject" ],
                        error: { ____accept: [ "jsNull", "jsString" ] },
                        result: { ____opaque: true  }
                        // TODO: Parameterize.
                    }
                }
            },

        },
        // ======================================================================


        runtime: {
            ____types: "jsObject",
            ____defaultValue: {},

            context: {
                ____label: "Runtime Context",
                ____description: "A flag checked by readers and writers of the application data store to determine what the current application runtime context is.",
                ____accept: "jsString",
                ____inValueSet: [ 'server', 'client' ],
                ____defaultValue: 'server'
            }, // appData.base.runtime.context

            client: {
                ____label: "Client Runtime Context",
                ____description: "Data used to track the state of the client application's core runtime routines that are implemented in rainier-ux-base.",
                ____types: "jsObject",
                ____defaultValue: {},

                state: {
                    ____label: "Client Runtime State",
                    ____description: "A flag used to indicate the overall state of the client application runtime.",
                    ____accept: "jsString",
                    ____inValueSet: [ 'offline', 'initializing', 'running', 'waiting', 'error' ],
                    ____defaultValue: 'offline'
                }, // appData.base.runtime.client.state

                errors: {
                    ____label: "Client Runtime Errors",
                    ____description: "A structure into which both base and derived application layer application data store writers write error descriptors.",
                    ____types: "jsArray",
                    ____defaultValue: [],
                    error: {
                        ____label: "App Platform Error",
                        ____accept: "jsObject" // TODO: currently this is an opaque object until we figure out what kind of information we want to write here. Need timestamps...",
                    } // appData.base.runtime.client.error
                }, // appData.base.runtime.client.errors

                subsystems: {
                    ____label: "Client Runtime Subsystems",
                    ____description: "A structure used by rainier-ux-base's core client application runtime to track state information relevant to the client's view presentation logic.",
                    ____types: "jsObject",
                    ____defaultValue: {},
                    /*
                      Placeholder for https://bugs.corp.qc/browse/RAINIER-1108
                      indexedDB: {
                      ____label: "IndexedDB Transport Status Descriptor",
                      ____accept: "jsObject",
                      ____defaultValue: {}
                      },
                    */
                    network: {
                        ____label: "Network Transport",
                        ____description: "Information written by the network transport subsystem that allows the view subsystem to display fine-grained progress/status info to the user.",
                        ____types: "jsObject",
                        ____defaultValue: {},

                        scoreboard: {
                            ____label: "Client App HTTP Request Scoreboard",
                            ____types: "jsObject",
                            ____asMap: true,
                            ____defaultValue: {},
                            clientHttpRequest: {
                                ____label: "Client App HTTP Request Descriptor",
                                ____accept: "jsObject"
                            } // appData.base.runtime.client.subsystems.network.scoreboard.clientHttpRequest
                        } // appData.base.runtime.client.subsystems.network.scorebaord
                    }, // appData.base.runtime.client.subsystems.network

                    authentication: {
                        ____label: "Rainier UX Authentication Controller",
                        ____description: "Information written by the authentication controller.",
                        ____types: "jsObject",
                        ____defaultValue: {},
                        state: {
                            ____label: "Authentication Controller State",
                            ____description: "A flag indicating the current state of the AuthenticationController.",
                            ____accept: "jsString",
                            ____inValueSet: [ 'uninitialized', 'initializing', 'verifying', 'authenticated', 'not_authenticated', 'error' ],
                            ____defaultValue: 'uninitialized'
                        },
                        netResponse: {
                            ____label: "Network Response Object",
                            ____description: "Marked as optional here. Existence is used as the clock. If it exists, then the ASC will make decissions based on the the filter reponse.",
                            ____types: [ "jsUndefined", "jsObject" ],
                            error: {
                                ____accept: [ "jsNull", "jsString" ],
                                ____defaultValue: null
                            },
                            result: {
                                ____accept: [ "jsNull", "jsObject" ],
                                ____defaultValue: null
                            }
                        }
                    },

                    authorization: {
                        ____label: "Rainier UX Authorization Controller",
                        ____description: "Information written by the authorization controller.",
                        ____types: "jsObject",
                        ____defaultValue: {},
                        state: {
                            ____label: "Authorization Controller State",
                            ____description: "A flag indicating the current state of the AuthorizationController.",
                            ____accept: "jsString",
                            ____inValueSet: [ 'uninitialized', 'initializing', 'authenticated', 'not_authenticated', 'error' ],
                            ____defaultValue: 'uninitialized'
                        }
                    },

                    rainier: {
                        ____label: "Rainier Controller",
                        ____description: "Information by written by the network transport, and other application-layer logic provided by rainier-ux-base.",
                        ____types: "jsObject",
                        ____defaultValue: {},

                        state: {
                            ____label: "Rainier Controller State",
                            ____description: "A flag indicating the current state of the Rainier Controller.",
                            ____accept: "jsString",
                            ____inValueSet: [ 'uninitialized', 'initializing', 'initialized', 'ready', 'persisted', 'error', 'locked_authentication', 'locked_authorization' ],
                            ____defaultValue: 'uninitialized'
                        }, // appData.base.runtime.client.subsystems.rainier.state

                        enable: {
                            ____label: "Runtime Enable",
                            ____description: "A flag set by the derived application to indicate to the app state controller that it should initialize itself.",
                            ____accept: "jsBoolean",
                            ____defaultValue: false
                        },

                        clientSession: {
                            ____label: "Rainier Controller Client Session",
                            ____description: "Base layer application runtime state for an authorized user session.",
                            ____types: "jsObject",
                            ____defaultValue: {},

                            state: {
                                ____label: "Rainier Controller Session State",
                                ____description: "A flag indicating the current state of the Rainier Controller session state object.",
                                ____accept: "jsString",
                                ____inValueSet: [ 'uninitialized', 'initializing', 'initialized', 'ready', 'persisted', 'error' ],
                                ____defaultValue: 'uninitialized'
                            }, // appData.base.runtime.client.subsystems.rainier.clientSession.state

                            data: {
                                ____label: "Rainier Controller Session Data",
                                ____description: "Current Rainier backend service query constraints (e.g. data freshness, available categories etc.). Written by network transport.",
                                ____types: "jsObject",
                                ____defaultValue: {},

                                // TODO: RAINIER-1405
                                availability: {
                                    ____label: "Rainier Platform Data Availability Info",
                                    ____description: "Rainier platform data availability information and adhoc query constraints.",
                                    ____types: "jsObject",
                                    ____defaultValue: {},

                                    state: {
                                        ____label: "Rainier Platform Data Availability Info State",
                                        ____description: "A flag indicating the current state of the Rainier session state data availability info object.",
                                        ____accept: "jsString",
                                        ____inValueSet: [ 'uninitialized', 'initializing', 'ready', 'error' ],
                                        ____defaultValue: 'uninitialized'
                                    }, // appData.base.runtime.client.subsystems.rainier.clientSession.data.dataAvailable.state

                                    // Assuming these are all just Epoch timestamps?

                                    freshnessDate: {
                                        ____label: "Freshnesh Date",
                                        ____description: "An aggregate date to for the data freshness across all categories",
                                        ____accept: "jsNumber",
                                        ____defaultValue: 1509519600000, //2017-11-01
                                    },
                                    categories: {
                                        ____label: "Category (demographic, geo, vertical, etc.) along with epochs",
                                        ____types: "jsArray",
                                        ____defaultValue: [{category: "demographics", time: 1509519600000},
                                                           {category: "geo", time: 1509519600000},
                                                           {category: "vertical", time: 1509519600000},
                                                           {category: "events", time: 1509519600000},
                                                           ],
                                        element: {
                                            ____types: "jsObject",
                                            category: {
                                                ____label: "category",
                                                ____accept: "jsString",
                                            },
                                            time: {
                                                ____label: "time",
                                                ____description: "epoch in milliseconds",
                                                ____accept: "jsNumber"
                                            }
                                        }
                                    }

                                }, // appData.base.runtime.client.subsystems.rainier.clientSession.data.dataAvailable

                                advertisers: {
                                    ____label: "Authorized Advertiser Identifiers (p-codes)",
                                    ____description: "A collection of advertiser identifier p-code's the user owning this client session is authorized to access.",
                                    ____types: "jsObject",
                                    ____defaultValue: {},

                                    state: {
                                        ____label: "Authorized Advertiser Identifiers State",
                                        ____description: "A flag indicating the current state of the authorized advertiser identifiers object.",
                                        ____accept: "jsString",
                                        ____inValueSet: [ 'uninitialized', 'initializing', 'ready', 'error' ],
                                        ____defaultValue: 'uninitialized'
                                    }, // appData.base.runtime.client.subsystems.rainier.clientSession.data.advertisers.state

                                    authorized: {
                                        ____label: "Authorized Advertiser Identifiers (p-codes)",
                                        ____description: "A collection of advertiser identifier p-code's the user owning this client session is authorized to access.",
                                        ____types: "jsArray",
                                        ____defaultValue: [],

                                        advertiser: {
                                            ____label: "Advertiser Identity (p-code) Descriptor",
                                            ____types: "jsObject",
                                            ____defaultValue: {},
                                            name: {
                                                ____label: "Advertiser Name",
                                                ____accept: "jsString",
                                                ____defaultValue: "<Error: Advertiser name not set>"
                                            },
                                            pcode: {
                                                ____label: "Advertiser p-code",
                                                ____accept: "jsString",
                                                ____defaultValue: "<Error: Advertiser p-code not set>"
                                            }
                                        } // appData.base.runtime.client.subsystems.rainier.clientSession.data.advertisers.authorized.advertiser

                                    } // appData.base.runtime.client.subsystems.rainier.clientSession.data.authorized

                                }, // appData.base.runtime.client.subsystems.rainier.clientSession.data.advertisers

                                queryDateRange: {
                                    ____label: "Allowed Rainier Query Date Range",
                                    ____types: "jsObject",
                                    ____defaultValue: {},

                                    state: {
                                        ____label: "Allowed Query Data Range State",
                                        ____description: "A flag indicating the current state of the allowed query date range object.",
                                        ____accept: "jsString",
                                        ____inValueSet: [ 'uninitialized', 'initializing', 'ready', 'error' ],
                                        ____defaultValue: 'uninitialized'
                                    }, // appData.base.runtime.client.subsystems.rainier.clientSession.data.advertisers.state

                                    start: {
                                        ____label: "Earliest Query Start Time Epoch Timestamp",
                                        ____types: ["jsNumber","jsUndefined"]
                                    }, // appData.base.runtime.client.subsystems.rainier.clientSession.data.queryDateRange.start

                                    end: {
                                        ____label: "Latest Query End Time Epoch Timestamp",
                                        ____types: ["jsNumber","jsUndefined"]
                                    } // appData.base.runtime.client.subsystems.rainier.clientSession.data.queryDateRange.end

                                } // appData.base.runtime.client.subsystems.rainier.clientSessions.data.queryDateRange

                            }, // appData.base.runtime.client.subsystems.rainier.clientSession.data

                            metadata: {
                                ____label: "Rainier Controller Session Metadata",
                                ____description: "Information about this specific Rainer Controller session instance.",
                                ____types: "jsObject",
                                ____defaultValue: {},

                                created: {
                                    ____label: "Session Create Time",
                                    ____description: "An Epoch timestamp assigned when the session is created.",
                                    ____accept: [ "jsNumber", "jsNull" ],
                                    ____defaultValue: null
                                }, // appData.base.runtime.client.subsystems.rainier.clientSession.metadata.created

                                username: {
                                    ____label: "Session User Name",
                                    ____description: "The username of the authenticated and authorized user for whom this Rainier controller session was created.",
                                    ____accept: [ "jsString", "jsNull" ],
                                    ____defaultValue: null
                                } // appData.base.runtime.client.subsystems.rainier.clientSession.metadata.username

                            } // appData.base.runtime.client.subsystems.rainier.clientSession.metadata

                        } // appData.base.runtime.client.subsystems.rainier.clientSession

                    } // appData.base.runtime.client.subsystems.rainier

                } // appData.base.runtime.client.subsystems

            } // appData.base.runtime.client

        } // appData.base.runtime

    },

    derived: {
        // THIS PLACEHOLDER REPLACED AT RUNTIME WITH FILTER SPEC PROVIDED BY DERIVED APPLICATION
        ____label: "Derived Layer App Data Descriptor",
        ____description: "This is a just a placeholder for the `derived` namespace the format of which is specified by the derived application.",
        ____opaque: true
    }
};
