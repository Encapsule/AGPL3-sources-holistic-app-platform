"use strict";

//
// backend-user-session-open-result-spec.js
//
// Information returned by a successful call to the login REST endpoint on the backend service.
module.exports = {
  ____label: "Login User Session Response",
  ____description: "Describes a response to a successful request for a new user session token.",
  ____types: "jsObject",
  user_session_token: {
    ____label: "User Session Token",
    ____description: "A unique identifier issued by the backend authorizing the user agent (here a Node.js " + "webserver process working at the behest of a browser process operated by a human) to access a " + "specific set of backend-provided operations via AJAX requests performed in the context of the " + "user session identified by this user session token. Subsequent AJAX requests made in user session " + "scope will embed a user authorization request object that includes this user session token value " + "within its request JSON structure.",
    ____accept: "jsString"
  },
  user_session_config: {
    ____label: "User Session Config",
    ____description: "Information provided to the user agent used to customize resource access and display in the context of this user session.",
    ____types: "jsObject",
    ____defaultValue: {},
    services: {
      ____label: "Services",
      ____description: "A dictionary identifying all backend services available to the user agent in the context of this user session.",
      ____types: "jsObject",
      ____asMap: true,
      ____defaultValue: {},
      service_id: {
        ____label: "Service",
        ____description: "Information about a specific backend service exposed to the user agent in the context of this user session.",
        ____types: "jsObject",
        name: {
          ____label: "Name",
          ____description: "A short and descriptive name for the backend service.",
          ____accept: "jsString"
        },
        description: {
          ____label: "Description",
          ____description: "A short description of the backend service.",
          ____accept: "jsString"
        },
        display: {
          ____label: "Display",
          ____description: "Information about visual representation of this service in the UI.",
          ____types: "jsObject",
          ____defaultValue: {},
          visible: {
            ____label: "Visible",
            ____description: "If false, this service is not visible in the UI. If true, then as appropriate.",
            ____accept: "jsBoolean",
            ____defaultValue: true
          },
          rank: {
            ____label: "Rank",
            ____description: "An integer used to sort services into display order. Ignored if the service is not visible.",
            ____types: "jsNumber",
            ____defaultValue: 0
          }
        },
        operations: {
          ____label: "Operations",
          ____description: "A dictionary identifying all operations exposed to the user agent by this backend service.",
          ____types: "jsObject",
          ____asMap: true,
          operation_id: {
            ____label: "Operation",
            ____description: "Information about a specific operation exposed to the user agent by this backend service.",
            ____types: "jsObject",
            name: {
              ____label: "Name",
              ____description: "A short and descriptive name for the backend service operation.",
              ____accept: "jsString"
            },
            description: {
              ____label: "Description",
              ____description: "A short description of the backend service operation.",
              ____accept: "jsString"
            },
            display: {
              ____label: "Display",
              ____description: "Information about visual the representation of this operation in the UI. " + "Note that these settings are ignored if the service that provides these operations is " + "not itself visible.",
              ____types: "jsObject",
              ____defaultValue: {},
              visible: {
                ____label: "Visible",
                ____description: "If false, this operation is not visible in the UI. If true, then as appropriate.",
                ____accept: "jsBoolean",
                ____defaultValue: true
              },
              rank: {
                ____label: "Rank",
                ____description: "An integer used to sort operations into display order. Ignored if the operation is not visible.",
                ____types: "jsNumber",
                ____defaultValue: 0
              }
            },
            // display
            transport_config: {
              ____label: "Transport Config",
              ____description: "Information used to configure HTTP request transport, result, and error routers.",
              ____types: "jsObject",
              url: {
                ____label: "HTTP Request URL",
                ____description: "Full URL of the remote endpoint to query including the leading HTTP protocol designation.",
                ____accept: "jsString"
              },
              method: {
                ____label: "HTTP Request Method",
                ____description: "The specific HTTP request method to make requests with.",
                ____accept: "jsString",
                ____inValueSet: ["GET", "POST"]
              },
              requestSpec: {
                ____label: "HTTP Request Body Params Object Filter Spec",
                ____description: "An Encapsule/arccore.filter-format JavaScript object descriptor specifying the schema " + "of the main request object to pass as the body of the HTTP request.",
                ____accept: "jsObject",
                ____defaultValue: {
                  ____opaque: true
                }
              },
              resultSpec: {
                ____label: "HTTP Result Object Filter Spec",
                ____description: "An Encapsule/arccore.filter-format JavaScript object descriptor specifiying the schema " + "of the result data that the remote endpoint is expected/required to return in response to the HTTP request.",
                ____accept: ["jsUndefined", "jsObject"]
              } // transport config

            } // operation

          } // operations

        } // service

      } // services

    } // user session config

  }
};