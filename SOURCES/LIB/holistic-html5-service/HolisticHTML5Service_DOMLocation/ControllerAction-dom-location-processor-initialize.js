// ControllerAction-init-dom-client-hash-router.js

const holarchy = require("@encapsule/holarchy");
const queryString = require("query-string");
const url = require("url");

(function() {

    const action = new holarchy.ControllerAction({

        id: "TlGPCf7uSf2cZMGZCcU85A",
        name: "DOM Client Location Proccessor: Initialize",
        description: "Adds a listener to the brower's 'hashchange' event and redirects subsequent event callbacks to the ControllerAction peTmTek_SB64-ofd_PSGj.",
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
                                initialize: {
                                    ____accept: "jsBoolean",
                                    ____inValueSet: [ true ]
                                }
                            }
                        }
                    }
                }
            }
        },
        actionResultSpec: { ____accept: "jsUndefined" }, // action returns no response.result
        bodyFunction: (request_) => {

            let response = { error: null };
            let errors = [];
            let inBreakScope = false;

            while (!inBreakScope) {
                inBreakScope = true;

                console.log(`> HolisticHTML5Service_DOMLocation::initialize parsing current location.href="${location.href}"...`);

                // Retrieve the current (defaulted) value of the cell's OCD memory.
                let ocdResponse = request_.context.ocdi.readNamespace(request_.context.apmBindingPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const cellMemory = ocdResponse.result;
                console.log(JSON.stringify(cellMemory));

                // Parse the current location.href.
                const hrefParse = url.parse(location.href);

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

                const routerEventDescriptor = {
                    actor: "server", // always because this is the initial parse and we have not hooked any events or taken any action(s) based on location.href at this point.
                    hrefParse: hrefParse,
                    hashrouteString: hrefParse.hash?hrefParse.hash:null,
                    hashrouteParse,
                    hashrouteQueryParse: hashrouteParse?(queryString.parse(hashrouteParse.query)):null,
                    routerEventNumber: cellMemory.private.routerEventCount
                };

                cellMemory.private.locationHistory.push(routerEventDescriptor);
                cellMemory.private.routerEventCount++;

                ocdResponse = request_.context.ocdi.writeNamespace(request_.context.apmBindingPath, cellMemory);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                /* experiment


                const hashLength = !location.hash?0:location.hash.length;
                const hasHashRoute = (hashLength || location.href.endsWith("#"));


                   if (!hasHashRoute) {
                   location.replace("#");
                   }


                window.addEventListener("hashchange", (event_) => {
                    // If this act request fails, the app client process will get notified via its error lifecycle action.
                    request_.context.act({
                        apmBindingPath: request_.context.apmBindingPath,
                        actorName: "DOMLocationProcessor:hashchange Event Handler",
                        actorTaskDescription: "Notifying the DOM Location Processor of hashchange/location update.",
                        actionRequest: { holistic: { app: { client: { domLocation: { _private: { notifyEvent: { hashchange: { event: event_ } } } } } } } }
                    }, false);
                    event_.preventDefault();
                });

                */

                /* ----------------------------------------------------------------
                   v0.0.48-kyanite
                   SAVE THIS - this is the actual spanner in the works that blocks the user from navigating away or
                   to another domain or closing the browser tab. But, it's very tricky to use it correctly; there
                   needs to be a whole app-level protocol based on some sort of model of the user's browser tab
                   session that toggles this mechanism on/off as appropriate. We will bring this back into the
                   mix shortly....

                   // https://stackoverflow.com/questions/821011/prevent-a-webpage-from-navigating-away-using-javascript
                   window.addEventListener("beforeunload", (event_) => {
                   event_.preventDefault();
                   event_.returnValue = "";
                   }, false);

                   ---------------------------------------------------------------- */

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });

    if (!action.isValid()) {
        throw new Error(action.toJSON);
    }

    module.exports = action;

})();

