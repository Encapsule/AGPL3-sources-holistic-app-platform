"use strict";

module.exports = [{
  id: "VcFs1BSZTLCb8nlIwW3Pmg",
  name: "CellModel Constructor #1",
  description: "Default construct holarchy/CellModel ES6 class. Should fail.",
  vectorRequest: {
    holistic: {
      holarchy: {
        CellModel: {
          constructorRequest: undefined // explicitly

        }
      }
    }
  }
}, {
  id: "vzmMGynKTy2uu6W8R-1rvQ",
  name: "CellModel Constructor #2",
  description: "Try to construct a minimally configured CellModel with a single TransitionOperator plug-in.",
  vectorRequest: {
    holistic: {
      holarchy: {
        CellModel: {
          constructorRequest: {
            id: "vzmMGynKTy2uu6W8R-1rvQ",
            name: "CellModel Constructor #2",
            description: "Try to construct a minimally configured CellModel with a mimimally-defined OPM association.",
            apm: {
              id: "cJSBP90NTcu1bJMhCOjbQg",
              name: "Placeholder APM",
              description: "A minimally-configured placeholder."
            }
          }
        }
      }
    }
  }
}, {
  id: "AE_pEJ7LTdSvohEBZl_Bfw",
  name: "CellModel Constructor #3",
  description: "Try to construct a minimally configured CellModel with a single TransitionOperator plug-in.",
  vectorRequest: {
    holistic: {
      holarchy: {
        CellModel: {
          constructorRequest: {
            id: "AE_pEJ7LTdSvohEBZl_Bfw",
            name: "CellModel Constructor #3",
            description: "Try to construct a minimally configured CellModel with a single TransitionOperator plug-in.",
            operators: [{
              id: "o3Q4YKI_SLOus82xE7Gaag",
              name: "Placeholder TOP",
              description: "A minimally configured placeholder.",
              operatorRequestSpec: {
                ____accept: "jsObject"
              },
              bodyFunction: function bodyFunction(request_) {
                return {
                  error: null,
                  result: false
                };
              }
            }]
          }
        }
      }
    }
  }
}, {
  id: "E7xo1-qaSuSrsN5-8jgmRg",
  name: "CellModel Constructor #4",
  description: "Try to construct a minimally configured CellModel with a single ControllerAction plug-in.",
  vectorRequest: {
    holistic: {
      holarchy: {
        CellModel: {
          constructorRequest: {
            id: "E7xo1-qaSuSrsN5-8jgmRg",
            name: "CellModel Constructor #4",
            description: "Try to construct a minimally configured CellModel with a single ControllerAction plug-in.",
            actions: [{
              id: "SXYrt7-1SOe91wpQLWFutQ",
              name: "Fake Test Action",
              description: "A fake test action.",
              actionRequestSpec: {
                ____types: "jsObject",
                whatever: {
                  ____accept: "jsNull"
                }
              },
              bodyFunction: function bodyFunction(request_) {
                return {
                  error: null
                };
              }
            }]
          }
        }
      }
    }
  }
}, {
  id: "rShJ0riLSiOxLt0OpFJLJA",
  name: "SoftewareCellModel Constructor #5",
  description: "Try to compose a CellModel of two subcell models.",
  vectorRequest: {
    holistic: {
      holarchy: {
        CellModel: {
          constructorRequest: {
            id: "rShJ0riLSiOxLt0OpFJLJA",
            name: "SoftewareCellModel Constructor #5",
            description: "Try to construct a full (but-ultimately fake) CellModel including subcell definitions.",
            subcells: [{
              id: "HbLgO6RMRRacUTjXqv2Rrw",
              name: "Test Subcell #1",
              description: "Test subcell #1 defines an APM.",
              apm: {
                id: "gA3KJMtcS6K8o5cV4plg3w",
                name: "Test Subcell #1 APM",
                description: "Just a test"
              }
            }, {
              id: "0Yacg-V9QDqmbVlOFMSVVw",
              name: "Test Subcell #2",
              description: "Test subcell #2 defines a TOP.",
              operators: [{
                id: "gcVJ6OIFQfyM6tn194wrsg",
                name: "Test Subcell #2 TOP",
                description: "Just a test",
                operatorRequestSpec: {
                  ____accept: "jsBoolean"
                },
                bodyFunction: function bodyFunction(request_) {
                  return {
                    error: null
                  };
                }
              }]
            }, {
              id: "fZ7sK3URSaK3QR7_IycJrw",
              name: "Test Subcell #3",
              description: "Test subcell #3 defines an ACT",
              actions: [{
                id: "NQmQIuSMTbWYlQtmQr9n0A",
                name: "Test Subcell #3 ACT",
                description: "Just a test",
                actionRequestSpec: {
                  ____accept: "jsBoolean"
                },
                bodyFunction: function bodyFunction(request_) {
                  return {
                    error: null
                  };
                }
              }]
            }]
          }
        }
      }
    }
  }
}];