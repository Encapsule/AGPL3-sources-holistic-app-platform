"use strict";

// metadata-user-get-session.js
module.exports = function (request_) {
  console.log("..... " + this.operationID + "::" + this.operationName); // const appStateContext = request_.appStateContext;

  var userIdentity = request_.user_identity; // By definition, userIdentity is merely a developer-defined transformation of request data to a terse data object w/assumed semantics of user identity.
  // Because it is always filtered, we know the format of the object. However, we do not know if the assertion of identity is actually valid at this point.
  // It's the job of this function to encapsulate whatever operations are required to authenticate/authorize/affect fine-grained policy decissions based
  // on details of the current HTTP request.

  console.log("*** PROCESSING USER IDENTITY = '" + JSON.stringify(userIdentity) + "'.");
  var sessionConstructData = {}; // default constructs the entire session object as the anonymous user per defaults in the filter spec
  // We are not verifying the token in this context currently. Here, we provide not useful information beyond an acknowledgment that the current request has qcToken.

  if (userIdentity.ruxUser !== null) {
    // Partially specify the session data (because we're not a security barrier yet so provide nothing of value here).
    sessionConstructData = {
      data: {
        user: {
          username: "QC Authenticated User"
        },
        settings: {// Nothing right now. We need to set something up to persist users settings and take care of that here
          // after we have (a) verified the assertion of user identity (b) performed authorization (c) performed policy decisions
          // (d) decide we need to fetch a copy of the user's profile to pass on to the downstream service filter.
        }
      },
      identity: userIdentity
    };
  } // end if


  console.log("*** CONSTRUCTING USER SESSION WITH DATA = '" + JSON.stringify(sessionConstructData) + "'."); // completes the request.

  request_.result_handler(sessionConstructData); // On success, return undefined (per holism).

  return {
    error: null,
    result: undefined
  };
};