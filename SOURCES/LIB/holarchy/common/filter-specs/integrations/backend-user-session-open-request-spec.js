// user-auth-request-spec.js
//
// This is an Encapsule/arccore.filter object specification that
// declares the format of an "user authorization request" descriptor
// object. This object is specified for login/re-authorization requests.
// And, within the request JSON sent to the backend for each AJAX request
// initiated by the user agent in the context of the user session."

module.exports = {
    ____label: "Backend User Session Open Request",
    ____description: "Information used by the backend service to verify a user session token, or generate a new one for use by the user agent process.",
    ____types: "jsObject",
    username: {
        ____label: "Username",
        ____description: "A unique username assigned to a human operator of this system.",
        ____accept: "jsString"
    },
    password: {
        ____label: "Password",
        ____description: "The md5 digest hash of the human-readable passphrase shared with the human operator assigned to username.",
        ____accept: [ "jsNull", "jsString" ],
        ____defaultValue: null
    },
    user_session_token: {
 	____label: "User Session Token",
        ____description: "The previously-issued user session token value, or null if the user has logged out/never logged in.",
        ____accept: [ "jsNull", "jsString" ],
        ____defaultValue: null
    },
    source: {
        ____label: "Source",
        ____description: "Request source metadata.",
        ____types: "jsObject",
        ip_address: {
	    ____label: "IPv4 Address",
	    ____description: "IPv4 address of the machine hosting the user's agent process (typically a browser).",
	    ____accept: "jsString"
        },
        user_agent: {
	    ____label: "User Agent",
	    ____description: "The identity of user's agent application (typically derived from User-Agent header or navigator.userAgent DOM).",
	    ____accept: "jsString"
        }
    }

};
