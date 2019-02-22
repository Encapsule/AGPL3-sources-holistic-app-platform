// developer-input-metadata-user-identity-spec.js

module.exports = {
    ____label: "User Identity Descriptor",
    ____description: "Object containing information asserting the identity of a user.",
    ____types: "jsObject",
    ____defaultValue: {},


    /*
      On 2nd-thought, let's not propogate this value around using the Encapsule/holism
      "identity" data value which is primarily for consumption by the server and client
      HTML rendering subsytems. All actual authentication and authorizations need to
      to be made case-by-case by the Node app server (typically in coordination with
      external authority service(s)).

    qcToken: {
        // This is unverified because we do not currently verify it.
        // We are the bearer of this token only. For the purposes
        // of determining server-side HTML view rendering and response
        // to HTML5 client application data requests, we use the existence
        // or not of the token string value to determine response policy.
        // This behavior is somewhat nuanced insofar as the current logic
        // allows both client and server app to forgo this policy (currently
        // enforced with a hard redirect to the QC deployment environement's
        // central login page) to be shut off for local development.
        ____label: "Unverified Username Hash Identifier",
        ____description: "The qcToken (cookie) assigned to user by quantcast.com.",
        ____accept: [ "jsNull", "jsString" ],
        ____defaultValue: null
    }, // qcToken
    */

    ruxUser: {
        // For parity release we're providing minimal security in the UX service.
        // ruxUser is accordingly a go/no-go flag that is set to indicate that
        // the client HTML request forwarded a qcToken value in its cookie.
        // We don't however tell you if the qcToken value is valid. And, we don't
        // tell you what the qcToken value is either.
        ____label: "UX User Authenticate",
        ____description: "A flag indicating the user's level of UX access (this is a client-side concept). Server-side decissions are based on private server-only truth state.",
        ____accept: [ "jsNull", "jsString" ],
        ____defaultValue: null
    } // qcToken

};
