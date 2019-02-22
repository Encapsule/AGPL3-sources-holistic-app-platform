// client-user-sesison-open-request-spec.js
//

const clientUserSessionOpenRequestSpec = module.exports = {
    ____label: "Client User Session Open Request",
    ____description: "Information sent by the HTML5 client application to create a new user session.",
    ____types: "jsObject",

    username_sha256: {
	____label: "Username SHA256",
	____description: "The SHA256 digest hash of the user's claimed-valid username.",
	____accept: "jsString"
    },
    password_sha256: {
	____label: "Password SHA256",
	____description: "The SHA256 digest hash of the user's claimed-valid password.",
	____accept: [ "jsString" ]
    }

};
