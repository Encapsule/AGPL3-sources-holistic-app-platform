// ControllerAction-dom-location-processor-parse.js

const holarchy = require("@encapsule/holarchy");
const queryString = require("query-string");
const url = require("url");

const routerEventDescriptorSpec = require("./lib/iospecs/router-event-descriptor-spec");

(function() {

    const action = new holarchy.ControllerAction({
        id: "aK2x16jDRbmGyemCOeBDJQ",
        name: "HolisticHTML5Service_DOMLocation Parse",
        description: "Performs a parse of the window.location.href string into base URI and hashroute components.",
        actionRequestSpec: {
            ____types: "jsObject",
            holistic: {
                ____types: "jsObject",
                app: {
                    ____types: "jsObject",
                    client: {
                        ____types: "jsObject",
                        domLocation: {
                            ____types: "jsObject",
                            _private: {
                                ____types: "jsObject",
                                parseLocation: {
                                    ____types: "jsObject",
                                    href: { ____accept: "jsString" },
                                    routerEventNumber: { ____accept: "jsNumber" }, // to assign to result routerEventNumber
                                    // TODO: I don't think we need this or should support it any longer. It's very confusing.
                                    actor: {
                                        ____accept: "jsString",
                                        ____inValueSet: [
                                            "server", // indicates the the router event descriptor contains parse of unmodified server window.location.href
                                            "user", // indicates the router event event descriptor contains parse of window.location.href obtained from user-induced-event
                                            "app" // no idea

                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        actionResultSpec: { ...routerEventDescriptorSpec },

        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const messageBody = request_.actionRequest.holistic.app.client.domLocation._private.parseLocation;

                // Parse the current location.href.
                const hrefParse = url.parse(messageBody.href);

                // Assume we do not have a hashroute fragment in location.href string...
                let hashrouteParse = null;

                // ... but, if we actually do then parse it per holistic app platform-defined rules:
                if (hrefParse.hash) {
                    /*
                      Hashroute fragment string component of a URL (i.e. the string that begins w/#) is
                      explicitly defined in HTTP 1.1 spec as an opaque UTF-8 string. This means that we
                      can do with this string whatever we want. But, that's a lot of possibilities.
                      And, in the interest of making life a little simpler to understand, we implement
                      a set of parsing conventions for the hashroute fragment here that reuses and
                      re-applies most of HTTP 1.1 spec parsing conventions for base URL to the hashroute
                      fragment string.
                    */
                    const hashrouteParseRaw = url.parse(hrefParse.hash.slice(1)); // Drop the # character to make url.parse believe it's parsing a standard server URI pathname.
                    hashrouteParse = {
                        pathname: `#${hashrouteParseRaw.pathname?hashrouteParseRaw.pathname:""}`,
                        path: `#${hashrouteParseRaw.path?hashrouteParseRaw.path:""}`,
                        search: hashrouteParseRaw.search,
                        query: hashrouteParseRaw.query
                    };

                } // if (hrefParse.hash) -> parse the hashroute fragment

                response.result = { // router event descriptor object
                    actor: messageBody.actor,
                    hrefParse: hrefParse,
                    hashrouteString: hrefParse.hash?hrefParse.hash:null,
                    hashrouteParse,
                    hashrouteQueryParse: hashrouteParse?(queryString.parse(hashrouteParse.query)):null,
                    routerEventNumber: messageBody.routerEventNumber
                };

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });

    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }

    module.exports = action;

})();

