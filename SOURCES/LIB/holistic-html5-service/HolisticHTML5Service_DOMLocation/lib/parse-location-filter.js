// holistic-html5-service/HolisticHTML5Service_DOMLocation/lib/parse-location-filter.js

const arccore = require("@encapsule/arccore");
const queryString = require("query-string");
const url = require("url");
const routerEventDescriptorSpec = require("./iospecs/router-event-descriptor-spec");

(function() {

    const factoryResponse = arccore.filter.create({

        operationID: "aK2x16jDRbmGyemCOeBDJQ",
        operationName: "HolisticHTML5Service_DOMLocation Parse",
        operationDescription: "Performs a parse of the window.location.href string into base URI and hashroute components.",

        inputFilterSpec: {
            ____types: "jsObject",
            // TODO: I don't think we need this or should support it any longer. It's very confusing.
            actor: {
                ____accept: "jsString",
                ____inValueSet: [
                    "server", // indicates the the router event descriptor contains parse of unmodified server window.location.href
                    "user", // indicates the router event event descriptor contains parse of window.location.href obtained from user-induced-event
                    "app" // no idea
                ]
            },
            href: { ____accept: "jsString" },
            routerEventNumber: { ____accept: "jsNumber" }, // to assign to result routerEventNumber
        },

        outputFilterSpec: { ...routerEventDescriptorSpec },

        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                // Parse the current location.href.
                const hrefParse = url.parse(request_.href);

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
                    actor: request_.actor,
                    hrefParse: hrefParse,
                    hashrouteString: hrefParse.hash?hrefParse.hash:null,
                    hashrouteParse,
                    hashrouteQueryParse: hashrouteParse?(queryString.parse(hashrouteParse.query)):null,
                    routerEventNumber: request_.routerEventNumber
                };

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result; // This is an arccore.filter instance.

})();

